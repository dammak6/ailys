import { createServerSupabaseClient } from "../supabase/server";
import { createAdminSupabaseClient } from "../supabase/admin";
import { PRODUCTS, COLLECTIONS, CATEGORIES, SAMPLE_ORDERS, Product, Collection, ImageTransformMetadata, DEFAULT_IMAGE_TRANSFORM } from "../data";

export interface CreateOrderParams {
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  altPhone?: string;
  governorate: string;
  city: string;
  address: string;
  notes?: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  items: {
    productId?: string;
    productName: string;
    size: string;
    color: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    imageUrl?: string;
  }[];
}

export interface CreateReturnParams {
  orderId?: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  type: "echange" | "retour";
  reason: string;
  comments?: string;
  tagsIntactConfirmed: boolean;
  items: {
    orderItemId?: string;
    productName: string;
    quantity: number;
    requestedExchangeSize?: string;
  }[];
}

function isLiveSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes("placeholder-project") && !key.includes("placeholder-anon-key"));
}

export const AilysRepository = {
  // ---------------------------------------------------------------------------
  // PRODUCTS
  // ---------------------------------------------------------------------------
  async getProducts(filters?: {
    category?: string;
    size?: string;
    sortBy?: "newest" | "price-asc" | "price-desc";
  }): Promise<Product[]> {
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        let query = supabase
          .from("products")
          .select(`
            *,
            categories (*),
            product_images (*),
            product_variants (*, sizes (*), colors (*))
          `)
          .eq("is_published", true);

        if (filters?.category && filters.category !== "all") {
          query = query.eq("categories.slug", filters.category);
        }

        if (filters?.sortBy === "price-asc") {
          query = query.order("price", { ascending: true });
        } else if (filters?.sortBy === "price-desc") {
          query = query.order("price", { ascending: false });
        } else {
          query = query.order("is_new", { ascending: false }).order("created_at", { ascending: false });
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((row: any) => ({
            id: row.id,
            slug: row.slug,
            name: row.name,
            subtitle: row.subtitle || "",
            category: row.categories?.slug || "femme",
            subCategory: row.sub_category || "",
            price: Number(row.price),
            salePrice: row.sale_price ? Number(row.sale_price) : undefined,
            collection: "Lumière d'Été",
            collectionSlug: "lumiere-d-ete",
            primaryImage: row.product_images?.find((img: any) => img.is_primary)?.image_url || "/images/products/ensemble-tailleur.jpg",
            secondaryImage: row.product_images?.find((img: any) => !img.is_primary)?.image_url || "/images/campaign/hero-portrait-woman.jpg",
            gallery: row.product_images?.map((img: any) => img.image_url) || [],
            colors: [{ name: "Blanc Os", hex: "#F5F3EC" }],
            sizes: ["36", "38", "40", "42"],
            description: row.description || "",
            materials: row.materials || "",
            care: row.care || "",
            fit: row.fit || "",
            isNew: row.is_new,
            isCapsule: row.is_capsule,
            isSoldOut: row.is_sold_out,
            isFeatured: row.is_featured,
          }));
        }
      } catch (err) {
        console.warn("Supabase query failed, falling back to local data:", err);
      }
    }

    // Default Fallback
    let result = [...PRODUCTS];
    if (filters?.category && filters.category !== "all") {
      result = result.filter((p) => p.category === filters.category);
    }
    if (filters?.size && filters.size !== "all") {
      result = result.filter((p) => p.sizes.includes(filters.size!));
    }
    if (filters?.sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (filters?.sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return result;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = await this.getProducts();
    return products.find((p) => p.slug === slug) || null;
  },

  // ---------------------------------------------------------------------------
  // COLLECTIONS
  // ---------------------------------------------------------------------------
  async getCollections(): Promise<Collection[]> {
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("collections")
          .select(`
            *,
            collection_products (product_id, products (slug))
          `)
          .eq("is_published", true)
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((row: any) => ({
            id: row.id,
            slug: row.slug,
            title: row.title,
            subtitle: row.subtitle || "",
            description: row.description || "",
            story: row.story || "",
            heroDesktopImage: row.hero_desktop_image,
            heroMobileImage: row.hero_mobile_image || row.hero_desktop_image,
            productSlugs: row.collection_products?.map((cp: any) => cp.products?.slug).filter(Boolean) || [],
          }));
        }
      } catch (err) {
        console.warn("Supabase collections query failed, fallback to local:", err);
      }
    }

    return COLLECTIONS;
  },

  // ---------------------------------------------------------------------------
  // ORDERS (Guest Checkout, Cash on Delivery only)
  // ---------------------------------------------------------------------------
  async createOrder(params: CreateOrderParams) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `AILYS-2609-${randomSuffix}`;

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();

        const { data: order, error: orderError }: { data: any; error: any } = await (supabase
          .from("orders") as any)
          .insert({
            order_code: orderCode,
            customer_name: params.customerName,
            customer_email: params.customerEmail || null,
            customer_phone: params.customerPhone,
            alt_phone: params.altPhone || null,
            governorate: params.governorate,
            city: params.city,
            address: params.address,
            notes: params.notes || null,
            subtotal: params.subtotal,
            shipping_fee: params.shippingFee,
            total: params.total,
            payment_method: "COD",
            status: "nouveau",
          })
          .select()
          .single();

        if (orderError) throw orderError;

        if (params.items && params.items.length > 0) {
          const itemsToInsert = params.items.map((item) => ({
            order_id: order.id,
            product_id: item.productId || null,
            product_name: item.productName,
            size: item.size,
            color: item.color,
            unit_price: item.unitPrice,
            quantity: item.quantity,
            total_price: item.totalPrice,
            image_url: item.imageUrl || null,
          }));

          const { error: itemsError } = await (supabase
            .from("order_items") as any)
            .insert(itemsToInsert);

          if (itemsError) throw itemsError;
        }

        return {
          success: true,
          orderCode,
          orderId: order.id,
          total: params.total,
          status: "nouveau",
        };
      } catch (err) {
        console.warn("Supabase order creation failed, fallback to local store:", err);
      }
    }

    // Local store & in-memory sync for instant Admin visibility
    const localId = `ord-${Date.now()}`;
    const newAdminOrder = {
      id: localId,
      orderCode,
      customerName: params.customerName,
      customerEmail: params.customerEmail || "",
      customerPhone: params.customerPhone,
      altPhone: params.altPhone || "",
      governorate: params.governorate,
      city: params.city,
      address: params.address,
      notes: params.notes || "",
      subtotal: params.subtotal,
      shippingFee: params.shippingFee,
      total: params.total,
      paymentMethod: "COD",
      status: "nouveau",
      createdAt: new Date().toISOString(),
      items: params.items.map((it, idx) => ({
        id: `it-${Date.now()}-${idx}`,
        productName: it.productName,
        size: it.size,
        color: it.color,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        totalPrice: it.totalPrice,
        imageUrl: it.imageUrl || "/images/products/ensemble-tailleur.jpg",
      })),
    };

    ADMIN_ORDERS.unshift(newAdminOrder);

    SAMPLE_ORDERS[orderCode] = {
      orderCode,
      orderId: localId,
      customerName: params.customerName,
      phone: params.customerPhone,
      orderDate: new Date().toLocaleDateString("fr-FR"),
      status: "Nouveau",
      items: newAdminOrder.items.map((it) => ({
        id: it.id,
        productName: it.productName,
        size: it.size,
        color: it.color,
        price: it.unitPrice,
        quantity: it.quantity,
        image: it.imageUrl,
      })),
    };

    return {
      success: true,
      orderCode,
      orderId: localId,
      total: params.total,
      status: "nouveau",
    };
  },

  // ---------------------------------------------------------------------------
  // ORDER LOOKUP FOR RETURNS & EXCHANGES
  // ---------------------------------------------------------------------------
  async lookupOrderForReturn(orderCode: string, phone: string) {
    const cleanCode = orderCode.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\s+/g, "").replace(/\+216/g, "");

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: order, error }: { data: any; error: any } = await (supabase
          .from("orders") as any)
          .select(`
            *,
            order_items (*)
          `)
          .eq("order_code", cleanCode)
          .single();

        if (!error && order) {
          // Compare phone ending
          const orderPhoneClean = order.customer_phone.replace(/\s+/g, "").replace(/\+216/g, "");
          if (orderPhoneClean.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhoneClean)) {
            return {
              orderCode: order.order_code,
              orderId: order.id,
              customerName: order.customer_name,
              phone: order.customer_phone,
              orderDate: new Date(order.created_at).toLocaleDateString("fr-FR"),
              status: order.status,
              items: order.order_items.map((it: any) => ({
                id: it.id,
                productName: it.product_name,
                size: it.size,
                color: it.color,
                price: Number(it.unit_price),
                quantity: it.quantity,
                image: it.image_url || "/images/products/ensemble-tailleur.jpg",
              })),
            };
          }
        }
      } catch (err) {
        console.warn("Supabase order lookup failed, checking local samples:", err);
      }
    }

    // Check ADMIN_ORDERS
    const adminOrder = ADMIN_ORDERS.find((o) => o.orderCode?.toUpperCase() === cleanCode);
    if (adminOrder) {
      const orderPhoneClean = (adminOrder.customerPhone || "").replace(/\s+/g, "").replace(/\+216/g, "");
      if (orderPhoneClean.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhoneClean) || cleanPhone.length === 0) {
        return {
          orderCode: adminOrder.orderCode,
          orderId: adminOrder.id,
          customerName: adminOrder.customerName,
          phone: adminOrder.customerPhone,
          orderDate: new Date(adminOrder.createdAt).toLocaleDateString("fr-FR"),
          status: adminOrder.status,
          items: adminOrder.items.map((it: any) => ({
            id: it.id,
            productName: it.productName,
            size: it.size,
            color: it.color,
            price: Number(it.unitPrice),
            quantity: it.quantity,
            image: it.imageUrl || "/images/products/ensemble-tailleur.jpg",
          })),
        };
      }
    }

    const localOrder = SAMPLE_ORDERS[cleanCode];
    if (localOrder) {
      return localOrder;
    }

    return null;
  },

  // ---------------------------------------------------------------------------
  // CREATE RETURN OR EXCHANGE REQUEST
  // ---------------------------------------------------------------------------
  async createReturnRequest(params: CreateReturnParams) {
    const requestCode = `RET-${Math.floor(100000 + Math.random() * 900000)}`;

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();

        const { data: ret, error: returnError }: { data: any; error: any } = await (supabase
          .from("returns") as any)
          .insert({
            request_code: requestCode,
            order_id: params.orderId || "00000000-0000-0000-0000-000000000000",
            order_code: params.orderCode,
            customer_name: params.customerName,
            customer_phone: params.customerPhone,
            customer_email: params.customerEmail || null,
            type: params.type,
            reason: params.reason,
            comments: params.comments || null,
            tags_intact_confirmed: params.tagsIntactConfirmed,
            status: "en_attente",
          })
          .select()
          .single();

        if (returnError) throw returnError;

        if (params.items && params.items.length > 0) {
          const returnItemsToInsert = params.items.map((item) => ({
            return_id: ret.id,
            order_item_id: item.orderItemId || null,
            product_name: item.productName,
            quantity: item.quantity,
            requested_exchange_size: item.requestedExchangeSize || null,
          }));

          await (supabase.from("return_items") as any).insert(returnItemsToInsert);
        }

        return {
          success: true,
          requestCode,
        };
      } catch (err) {
        console.warn("Supabase return creation failed, falling back to local:", err);
      }
    }

    // Add to in-memory returns list
    const newReturn = {
      id: `ret-${Date.now()}`,
      requestCode,
      orderId: params.orderId || "order-001",
      orderCode: params.orderCode,
      customerName: params.customerName,
      customerPhone: params.customerPhone,
      customerEmail: params.customerEmail,
      type: params.type,
      reason: params.reason,
      comments: params.comments,
      status: "en_attente" as const,
      tagsIntactConfirmed: params.tagsIntactConfirmed,
      createdAt: new Date().toISOString(),
      items: params.items.map((it, idx) => ({
        id: `ret-it-${idx}`,
        productName: it.productName,
        quantity: it.quantity,
        requestedExchangeSize: it.requestedExchangeSize,
      })),
    };
    ADMIN_RETURNS.unshift(newReturn);

    return {
      success: true,
      requestCode,
    };
  },

  // ---------------------------------------------------------------------------
  // ADMIN: PRODUCTS CRUD
  // ---------------------------------------------------------------------------
  async getAllAdminProducts() {
    return ADMIN_PRODUCTS;
  },

  async createProduct(data: any) {
    const newProduct: any = {
      id: `prod-${Date.now()}`,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: data.name,
      subtitle: data.subtitle || "",
      category: data.category || "femme",
      subCategory: data.subCategory || "",
      price: Number(data.price),
      salePrice: data.salePrice ? Number(data.salePrice) : undefined,
      collection: data.collection || "Lumière d'Été",
      collectionSlug: data.collectionSlug || "lumiere-d-ete",
      primaryImage: data.primaryImage || "/images/products/ensemble-tailleur.jpg",
      secondaryImage: data.secondaryImage || "/images/campaign/hero-portrait-woman.jpg",
      gallery: data.gallery || [data.primaryImage || "/images/products/ensemble-tailleur.jpg"],
      colors: data.colors || [{ name: "Noir Mât", hex: "#0B0B0B" }],
      sizes: data.sizes || ["36", "38", "40", "42"],
      description: data.description || "",
      materials: data.materials || "100% Matières Naturelles",
      care: data.care || "Nettoyage à sec recommandé",
      fit: data.fit || "Coupe ajustée",
      isNew: data.isNew ?? true,
      isCapsule: data.isCapsule ?? false,
      isSoldOut: data.isSoldOut ?? false,
      isFeatured: data.isFeatured ?? false,
      isPublished: data.isPublished ?? true,
      createdAt: new Date().toISOString(),
    };
    ADMIN_PRODUCTS.unshift(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, updates: any) {
    const idx = ADMIN_PRODUCTS.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Produit non trouvé");
    ADMIN_PRODUCTS[idx] = { ...ADMIN_PRODUCTS[idx], ...updates };
    return ADMIN_PRODUCTS[idx];
  },

  async togglePublishProduct(id: string) {
    const product = ADMIN_PRODUCTS.find((p) => p.id === id);
    if (!product) throw new Error("Produit non trouvé");
    product.isPublished = !product.isPublished;
    return product;
  },

  async deleteProduct(id: string) {
    const idx = ADMIN_PRODUCTS.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Produit non trouvé");
    const [deleted] = ADMIN_PRODUCTS.splice(idx, 1);
    return deleted;
  },

  // ---------------------------------------------------------------------------
  // ADMIN: COLLECTIONS CRUD
  // ---------------------------------------------------------------------------
  async getAllAdminCollections() {
    return ADMIN_COLLECTIONS;
  },

  async createCollection(data: any) {
    const newCol: any = {
      id: `col-${Date.now()}`,
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: data.title,
      subtitle: data.subtitle || "",
      description: data.description || "",
      heroDesktopImage: data.heroDesktopImage || "/images/campaign/hero-editorial-woman.jpg",
      heroMobileImage: data.heroMobileImage || "/images/campaign/hero-portrait-woman.jpg",
      isCapsule: data.isCapsule ?? false,
      isPublished: data.isPublished ?? true,
      productCount: data.productCount || 0,
      createdAt: new Date().toISOString(),
    };
    ADMIN_COLLECTIONS.unshift(newCol);
    return newCol;
  },

  async updateCollection(id: string, updates: any) {
    const idx = ADMIN_COLLECTIONS.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Collection non trouvée");
    ADMIN_COLLECTIONS[idx] = { ...ADMIN_COLLECTIONS[idx], ...updates };
    return ADMIN_COLLECTIONS[idx];
  },

  async togglePublishCollection(id: string) {
    const col = ADMIN_COLLECTIONS.find((c) => c.id === id);
    if (!col) throw new Error("Collection non trouvée");
    col.isPublished = !col.isPublished;
    return col;
  },

  async deleteCollection(id: string) {
    const idx = ADMIN_COLLECTIONS.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Collection non trouvée");
    const [deleted] = ADMIN_COLLECTIONS.splice(idx, 1);
    return deleted;
  },

  // ---------------------------------------------------------------------------
  // ADMIN: PROMOTIONS CRUD
  // ---------------------------------------------------------------------------
  async getAllAdminPromotions() {
    return ADMIN_PROMOTIONS;
  },

  async createPromotion(data: any) {
    const newPromo = {
      id: `promo-${Date.now()}`,
      code: data.code.toUpperCase().trim(),
      description: data.description || "",
      discountType: data.discountType || "percentage",
      discountValue: Number(data.discountValue),
      minOrderAmount: Number(data.minOrderAmount || 0),
      startDate: data.startDate || new Date().toISOString().split("T")[0],
      endDate: data.endDate || "2026-12-31",
      isActive: data.isActive ?? true,
      usageCount: 0,
    };
    ADMIN_PROMOTIONS.unshift(newPromo);
    return newPromo;
  },

  async updatePromotion(id: string, updates: any) {
    const idx = ADMIN_PROMOTIONS.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Code promo non trouvé");
    ADMIN_PROMOTIONS[idx] = { ...ADMIN_PROMOTIONS[idx], ...updates };
    return ADMIN_PROMOTIONS[idx];
  },

  async togglePromotionActive(id: string) {
    const promo = ADMIN_PROMOTIONS.find((p) => p.id === id);
    if (!promo) throw new Error("Code promo non trouvé");
    promo.isActive = !promo.isActive;
    return promo;
  },

  async deletePromotion(id: string) {
    const idx = ADMIN_PROMOTIONS.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Code promo non trouvé");
    const [deleted] = ADMIN_PROMOTIONS.splice(idx, 1);
    return deleted;
  },

  // ---------------------------------------------------------------------------
  // ADMIN: ORDERS MANAGEMENT
  // ---------------------------------------------------------------------------
  async getAllAdminOrders() {
    return ADMIN_ORDERS;
  },

  async updateOrderStatus(orderId: string, status: string) {
    const order = ADMIN_ORDERS.find((o) => o.id === orderId || o.orderCode === orderId);
    if (!order) throw new Error("Commande non trouvée");
    order.status = status;
    if (SAMPLE_ORDERS[order.orderCode]) {
      SAMPLE_ORDERS[order.orderCode].status = status;
    }
    return order;
  },

  // ---------------------------------------------------------------------------
  // ADMIN: RETURNS & EXCHANGES MANAGEMENT
  // ---------------------------------------------------------------------------
  async getAllAdminReturns() {
    return ADMIN_RETURNS;
  },

  async updateReturnStatus(returnId: string, status: string, adminNotes?: string) {
    const ret = ADMIN_RETURNS.find((r) => r.id === returnId || r.requestCode === returnId);
    if (!ret) throw new Error("Demande de retour non trouvée");
    ret.status = status;
    if (adminNotes !== undefined) ret.adminNotes = adminNotes;
    return ret;
  },

  // ---------------------------------------------------------------------------
  // HOMEPAGE CMS: DRAFT VS PUBLISHED STATE ENGINE
  // ---------------------------------------------------------------------------
  async getPublishedHomepage() {
    return HOMEPAGE_PUBLISHED_SECTIONS
      .filter((s) => s.isEnabled)
      .sort((a, b) => a.order - b.order);
  },

  async getDraftHomepage() {
    return {
      sections: [...HOMEPAGE_DRAFT_SECTIONS].sort((a, b) => a.order - b.order),
      meta: { ...HOMEPAGE_CMS_META },
    };
  },

  async saveHomepageDraft(sections: any[]) {
    HOMEPAGE_DRAFT_SECTIONS = sections.map((s, idx) => ({
      ...s,
      order: idx + 1,
    }));
    HOMEPAGE_CMS_META.hasUnpublishedChanges = true;
    return {
      success: true,
      sections: HOMEPAGE_DRAFT_SECTIONS,
      meta: HOMEPAGE_CMS_META,
    };
  },

  async updateHomepageSection(sectionId: string, updates: any) {
    const section = HOMEPAGE_DRAFT_SECTIONS.find((s) => s.id === sectionId);
    if (!section) throw new Error("Section non trouvée");
    Object.assign(section, updates);
    HOMEPAGE_CMS_META.hasUnpublishedChanges = true;
    return section;
  },

  async reorderHomepageSections(orderedIds: string[]) {
    orderedIds.forEach((id, index) => {
      const sec = HOMEPAGE_DRAFT_SECTIONS.find((s) => s.id === id);
      if (sec) sec.order = index + 1;
    });
    HOMEPAGE_CMS_META.hasUnpublishedChanges = true;
    return HOMEPAGE_DRAFT_SECTIONS.sort((a, b) => a.order - b.order);
  },

  async publishHomepageChanges() {
    // Deep clone draft to published
    HOMEPAGE_PUBLISHED_SECTIONS = JSON.parse(JSON.stringify(HOMEPAGE_DRAFT_SECTIONS));
    HOMEPAGE_CMS_META.hasUnpublishedChanges = false;
    HOMEPAGE_CMS_META.lastPublishedAt = new Date().toISOString();

    return {
      success: true,
      publishedAt: HOMEPAGE_CMS_META.lastPublishedAt,
      sections: HOMEPAGE_PUBLISHED_SECTIONS,
    };
  },

  async discardHomepageDraft() {
    // Reset draft back to published
    HOMEPAGE_DRAFT_SECTIONS = JSON.parse(JSON.stringify(HOMEPAGE_PUBLISHED_SECTIONS));
    HOMEPAGE_CMS_META.hasUnpublishedChanges = false;

    return {
      success: true,
      sections: HOMEPAGE_DRAFT_SECTIONS,
      meta: HOMEPAGE_CMS_META,
    };
  },

  // ---------------------------------------------------------------------------
  // ADMIN: MEDIA LIBRARY
  // ---------------------------------------------------------------------------
  async getAllMedia() {
    return ADMIN_MEDIA;
  },

  async uploadMedia(asset: any) {
    const newMedia = {
      id: `media-${Date.now()}`,
      name: asset.name || `image-${Date.now()}.jpg`,
      url: asset.url,
      dimensions: asset.dimensions || "1200 x 1600",
      size: asset.size || "450 KB",
      mimeType: asset.mimeType || "image/jpeg",
      createdAt: new Date().toISOString().split("T")[0],
    };
    ADMIN_MEDIA.unshift(newMedia);
    return newMedia;
  },

  async updateMediaTransform(mediaId: string, transform: ImageTransformMetadata) {
    const asset = ADMIN_MEDIA.find((m) => m.id === mediaId || m.url === mediaId);
    if (!asset) throw new Error("Média non trouvé");
    asset.transform = transform;
    return asset;
  },

  async deleteMedia(mediaId: string) {
    const idx = ADMIN_MEDIA.findIndex((m) => m.id === mediaId);
    if (idx === -1) throw new Error("Média non trouvé");
    const [deleted] = ADMIN_MEDIA.splice(idx, 1);
    return deleted;
  },

  // ---------------------------------------------------------------------------
  // ADMIN: STORE SETTINGS
  // ---------------------------------------------------------------------------
  async getSiteSettings() {
    return ADMIN_SETTINGS;
  },

  async updateSiteSettings(updates: any) {
    Object.assign(ADMIN_SETTINGS, updates);
    return ADMIN_SETTINGS;
  },
};

// =============================================================================
// IN-MEMORY ADMIN DATA STORES
// =============================================================================

export const ADMIN_PRODUCTS = PRODUCTS.map((p) => ({
  ...p,
  isPublished: true,
  stockQuantity: p.isSoldOut ? 0 : 25,
}));

export const ADMIN_COLLECTIONS = COLLECTIONS.map((c) => ({
  ...c,
  isPublished: true,
  productCount: c.productSlugs?.length || 0,
}));

export const ADMIN_PROMOTIONS = [
  {
    id: "promo-001",
    code: "BIENVENUE10",
    description: "Remise de bienvenue pour première commande",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 150,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    isActive: true,
    usageCount: 42,
  },
  {
    id: "promo-002",
    code: "LUMIERE15",
    description: "Privilège Collection Lumière d'Été",
    discountType: "percentage",
    discountValue: 15,
    minOrderAmount: 300,
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    isActive: true,
    usageCount: 19,
  },
  {
    id: "promo-003",
    code: "PRIVILEGE50",
    description: "Remise exclusive atelier 50 TND dès 500 TND",
    discountType: "fixed",
    discountValue: 50,
    minOrderAmount: 500,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    isActive: false,
    usageCount: 7,
  },
];

export const ADMIN_ORDERS: any[] = [
  {
    id: "ord-001",
    orderCode: "AILYS-2609-4182",
    customerName: "Sarra Mansour",
    customerEmail: "sarra.mansour@example.tn",
    customerPhone: "+216 98 123 456",
    governorate: "Tunis",
    city: "La Marsa",
    address: "Avenue Habib Bourguiba, Résidence Les Palmiers, Apt 4B",
    notes: "Sonner à l'interphone Mansour",
    subtotal: 580.0,
    shippingFee: 0,
    total: 580.0,
    paymentMethod: "COD",
    status: "confirme",
    createdAt: "2026-09-17T10:15:00Z",
    items: [
      {
        id: "it-001",
        productName: "Veste Tailleur Riviera en Lin",
        size: "S",
        color: "Lin Naturel",
        quantity: 1,
        unitPrice: 580.0,
        imageUrl: "/images/products/ensemble-tailleur.jpg",
      },
    ],
  },
  {
    id: "ord-002",
    orderCode: "AILYS-2609-9051",
    customerName: "Mehdi Ben Salem",
    customerEmail: "mehdi.bensalem@gmail.com",
    customerPhone: "+216 55 987 654",
    governorate: "Sousse",
    city: "Kantaoui",
    address: "Villa Les Jasmins, Boulevard du 14 Janvier",
    notes: "Livraison de préférence l'après-midi",
    subtotal: 470.0,
    shippingFee: 0,
    total: 470.0,
    paymentMethod: "COD",
    status: "en_preparation",
    createdAt: "2026-09-16T14:30:00Z",
    items: [
      {
        id: "it-002",
        productName: "Polo Maille Piquée Méditerranée",
        size: "L",
        color: "Blanc Os",
        quantity: 2,
        unitPrice: 235.0,
        imageUrl: "/images/products/polo-homme.jpg",
      },
    ],
  },
  {
    id: "ord-003",
    orderCode: "AILYS-2609-1142",
    customerName: "Leila Chahed",
    customerEmail: "leila.chahed@outlook.com",
    customerPhone: "+216 21 345 678",
    governorate: "Sfax",
    city: "Route de Téniour",
    address: "Km 3, Résidence El Amen, Bâtiment B",
    notes: "Appeler 30 minutes à l'avance",
    subtotal: 820.0,
    shippingFee: 0,
    total: 820.0,
    paymentMethod: "COD",
    status: "nouveau",
    createdAt: "2026-09-17T12:00:00Z",
    items: [
      {
        id: "it-003",
        productName: "Robe Longue Soie & Lin Carthage",
        size: "38",
        color: "Or Mat",
        quantity: 1,
        unitPrice: 820.0,
        imageUrl: "/images/products/robe-soie.jpg",
      },
    ],
  },
];

export const ADMIN_RETURNS: any[] = [
  {
    id: "ret-001",
    requestCode: "RET-841920",
    orderId: "ord-001",
    orderCode: "AILYS-2609-4182",
    customerName: "Sarra Mansour",
    customerPhone: "+216 98 123 456",
    customerEmail: "sarra.mansour@example.tn",
    type: "echange",
    reason: "Taille trop petite",
    comments: "La veste est magnifique mais j'ai besoin d'une taille M au lieu du S.",
    status: "en_attente",
    tagsIntactConfirmed: true,
    adminNotes: "",
    createdAt: "2026-09-17T11:00:00Z",
    items: [
      {
        id: "rit-001",
        productName: "Veste Tailleur Riviera en Lin",
        quantity: 1,
        requestedExchangeSize: "M",
      },
    ],
  },
  {
    id: "ret-002",
    requestCode: "RET-319042",
    orderId: "ord-002",
    orderCode: "AILYS-2609-9051",
    customerName: "Mehdi Ben Salem",
    customerPhone: "+216 55 987 654",
    customerEmail: "mehdi.bensalem@gmail.com",
    type: "retour",
    reason: "Coupe ne convient pas",
    comments: "Étiquettes intactes dans la boîte d'origine.",
    status: "approuve",
    tagsIntactConfirmed: true,
    adminNotes: "Coursier planifié pour enlèvement le 18/09",
    createdAt: "2026-09-16T16:00:00Z",
    items: [
      {
        id: "rit-002",
        productName: "Polo Maille Piquée Méditerranée",
        quantity: 1,
      },
    ],
  },
];

export const DEFAULT_HOMEPAGE_SECTIONS: any[] = [
  {
    id: "sec-hero",
    key: "hero",
    badge: "Nouvelle Collection • 2026",
    title: "L'Élégance Contemporaine Tunisienne",
    subtitle: "Silhouettes sport-chic sculptées par la lumière méditerranéenne",
    description: "Des pièces intemporelles façonnées par la lumière tunisienne. La rencontre entre le vestiaire sport-chic et la noblesse des matières naturelles.",
    ctaText: "Découvrir la Collection",
    ctaLink: "#nouvelle-collection",
    secondaryCtaText: "L'Histoire AÏLYS",
    secondaryCtaLink: "/a-propos",
    desktopImage: "/images/campaign/hero-editorial-woman.jpg",
    mobileImage: "/images/campaign/hero-portrait-woman.jpg",
    desktopImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 40 },
      objectPosition: "50% 40%",
      aspectRatio: "16:9",
    },
    mobileImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 30 },
      objectPosition: "50% 30%",
      aspectRatio: "3:4",
    },
    order: 1,
    isEnabled: true,
  },
  {
    id: "sec-collection",
    key: "new_collection",
    badge: "Lumière d'Été",
    title: "Nouvelle Collection — Lumière d'Été",
    subtitle: "Matières nobles, coupes épurées et légèreté méditerranéenne",
    description: "Inspirée par la pureté des lignes de Sidi Bou Saïd et la noblesse du lin lavé. Chaque silhouette allie rigueur de confection et aisance sport-chic.",
    ctaText: "Voir toute la collection",
    ctaLink: "/collections/lumiere-d-ete",
    desktopImage: "/images/campaign/editorial-portrait-tunisian-light.jpg",
    mobileImage: "/images/campaign/editorial-portrait-tunisian-light.jpg",
    desktopImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 35 },
      objectPosition: "50% 35%",
      aspectRatio: "3:4",
    },
    mobileImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 35 },
      objectPosition: "50% 35%",
      aspectRatio: "3:4",
    },
    selectedProductSlugs: [
      "ensemble-tailleur-lin-ivoire",
      "veste-zippee-sport-chic-noire",
      "robe-longue-soie-lin-carthage"
    ],
    order: 2,
    isEnabled: true,
  },
  {
    id: "sec-philosophy",
    key: "philosophy",
    badge: "La Philosophie",
    title: "Philosophie AÏLYS",
    subtitle: "« Quiet confidence, shaped by Tunisian light. »",
    description: "Notre démarche refuse l'ostentation. Elle privilégie la tenue impeccable d'un col, la texture vivante d'un lin brut et la subtilité d'un reflet doré au coucher du soleil.",
    ctaText: "Notre Vision",
    ctaLink: "/a-propos",
    desktopImage: "/images/campaign/editorial-portrait-tunisian-light.jpg",
    mobileImage: "/images/campaign/editorial-portrait-tunisian-light.jpg",
    desktopImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 50 },
      objectPosition: "50% 50%",
      aspectRatio: "original",
    },
    mobileImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 50 },
      objectPosition: "50% 50%",
      aspectRatio: "original",
    },
    order: 3,
    isEnabled: true,
  },
  {
    id: "sec-craftsmanship",
    key: "craftsmanship",
    badge: "Savoir-Faire & Confection",
    title: "Savoir-Faire & Confection",
    subtitle: "Lin naturel, finitions cousues main et zips signature dorés",
    description: "Chaque vêtement AÏLYS est confectionné en Tunisie dans des ateliers partenaires sélectionnés pour leur rigueur artisanale.",
    ctaText: "Découvrir l'Atelier",
    ctaLink: "/a-propos",
    desktopImage: "/images/campaign/hero-editorial-woman.jpg",
    mobileImage: "/images/campaign/hero-editorial-woman.jpg",
    desktopImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 50 },
      objectPosition: "50% 50%",
      aspectRatio: "16:9",
    },
    mobileImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 50 },
      objectPosition: "50% 50%",
      aspectRatio: "3:4",
    },
    order: 4,
    isEnabled: true,
  },
  {
    id: "sec-about",
    key: "about",
    badge: "Transmission Mère-Fille",
    title: "L'Origine d'AÏLYS",
    subtitle: "Une transmission mère-fille au cœur de Tunis",
    description: "AÏLYS est née d'un dialogue complice entre Aïda, attachée aux belles matières et à la coupe classique, et sa fille, guidée par une allure sport-chic dynamique.",
    ctaText: "Lire l'histoire",
    ctaLink: "/a-propos",
    desktopImage: "/images/campaign/hero-portrait-woman.jpg",
    mobileImage: "/images/campaign/hero-portrait-woman.jpg",
    desktopImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 35 },
      objectPosition: "50% 35%",
      aspectRatio: "3:4",
    },
    mobileImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 35 },
      objectPosition: "50% 35%",
      aspectRatio: "3:4",
    },
    order: 5,
    isEnabled: true,
  },
  {
    id: "sec-cta",
    key: "final_cta",
    badge: "Atelier AÏLYS",
    title: "Rejoindre l'Univers AÏLYS",
    subtitle: "Accédez en avant-première aux pièces numérotées et capsules limitées",
    description: "Explorez notre vestiaire contemporain et découvrez l'élégance sobre de notre maison.",
    ctaText: "Explorer le Shop",
    ctaLink: "/shop",
    desktopImage: "/images/campaign/hero-editorial-woman.jpg",
    mobileImage: "/images/campaign/hero-editorial-woman.jpg",
    desktopImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 50 },
      objectPosition: "50% 50%",
      aspectRatio: "16:9",
    },
    mobileImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 50 },
      objectPosition: "50% 50%",
      aspectRatio: "3:4",
    },
    order: 6,
    isEnabled: true,
  },
];

export let HOMEPAGE_PUBLISHED_SECTIONS: any[] = JSON.parse(
  JSON.stringify(DEFAULT_HOMEPAGE_SECTIONS)
);

export let HOMEPAGE_DRAFT_SECTIONS: any[] = JSON.parse(
  JSON.stringify(DEFAULT_HOMEPAGE_SECTIONS)
);

export let HOMEPAGE_CMS_META = {
  lastPublishedAt: "2026-09-17T12:00:00Z",
  hasUnpublishedChanges: false,
};

export const ADMIN_MEDIA: any[] = [
  {
    id: "med-001",
    name: "hero-editorial-woman.jpg",
    url: "/images/campaign/hero-editorial-woman.jpg",
    dimensions: "2400 x 1350",
    size: "1.2 MB",
    mimeType: "image/jpeg",
    createdAt: "2026-09-15",
    transform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 40 },
      objectPosition: "50% 40%",
      aspectRatio: "16:9",
      desktop: { zoom: 1, rotate: 0, focalPoint: { x: 50, y: 40 }, aspectRatio: "16:9" },
      mobile: { zoom: 1.1, rotate: 0, focalPoint: { x: 50, y: 30 }, aspectRatio: "3:4" },
    },
  },
  {
    id: "med-002",
    name: "hero-portrait-woman.jpg",
    url: "/images/campaign/hero-portrait-woman.jpg",
    dimensions: "1200 x 1600",
    size: "820 KB",
    mimeType: "image/jpeg",
    createdAt: "2026-09-15",
    transform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 35 },
      objectPosition: "50% 35%",
      aspectRatio: "3:4",
      desktop: { zoom: 1, rotate: 0, focalPoint: { x: 50, y: 35 }, aspectRatio: "16:9" },
      mobile: { zoom: 1, rotate: 0, focalPoint: { x: 50, y: 35 }, aspectRatio: "3:4" },
    },
  },
  {
    id: "med-003",
    name: "editorial-portrait-tunisian-light.jpg",
    url: "/images/campaign/editorial-portrait-tunisian-light.jpg",
    dimensions: "1200 x 1600",
    size: "760 KB",
    mimeType: "image/jpeg",
    createdAt: "2026-09-15",
  },
  {
    id: "med-004",
    name: "ensemble-tailleur.jpg",
    url: "/images/products/ensemble-tailleur.jpg",
    dimensions: "1200 x 1600",
    size: "640 KB",
    mimeType: "image/jpeg",
    createdAt: "2026-09-15",
  },
  {
    id: "med-005",
    name: "veste-sport-chic.jpg",
    url: "/images/products/veste-sport-chic.jpg",
    dimensions: "1200 x 1600",
    size: "590 KB",
    mimeType: "image/jpeg",
    createdAt: "2026-09-15",
  },
  {
    id: "med-006",
    name: "robe-soie.jpg",
    url: "/images/products/robe-soie.jpg",
    dimensions: "1200 x 1600",
    size: "680 KB",
    mimeType: "image/jpeg",
    createdAt: "2026-09-15",
  },
  {
    id: "med-007",
    name: "polo-homme.jpg",
    url: "/images/products/polo-homme.jpg",
    dimensions: "1200 x 1600",
    size: "510 KB",
    mimeType: "image/jpeg",
    createdAt: "2026-09-15",
  },
  {
    id: "med-008",
    name: "ailys-emblem-gold-transparent.png",
    url: "/brand/ailys-emblem-gold-transparent.png",
    dimensions: "512 x 512",
    size: "45 KB",
    mimeType: "image/png",
    createdAt: "2026-09-15",
  },
];

export const ADMIN_SETTINGS = {
  brandName: "AÏLYS",
  brandTagline: "Maison de Confection Contemporaine Tunisienne",
  contactPhone: "+216 70 000 000",
  contactWhatsApp: "+216 98 000 000",
  contactEmail: "concierge@ailys.tn",
  atelierAddress: "Les Berges du Lac II, 1053 Tunis, Tunisie",
  freeShippingThreshold: 200,
  standardShippingFee: 7,
  deliveryDelayTunis: "24h - 48h",
  deliveryDelayRegions: "48h - 72h",
  announcementBarMessage: "Livraison offerte partout en Tunisie dès 200 TND • Paiement à la livraison",
  announcementBarActive: true,
};
