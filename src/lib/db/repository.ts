import fs from "fs";
import path from "path";
import { createServerSupabaseClient } from "../supabase/server";
import { createAdminSupabaseClient } from "../supabase/admin";
import { PRODUCTS, COLLECTIONS, CATEGORIES, SAMPLE_ORDERS, Product, Collection, ImageTransformMetadata, DEFAULT_IMAGE_TRANSFORM } from "../data";

const DATA_DIR = path.join(process.cwd(), "data");
const STORAGE_FILE = path.join(DATA_DIR, "admin-data.json");


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
            collection: "Nouvelle Collection",
            collectionSlug: "nouvelle-collection",
            primaryImage: row.product_images?.find((img: any) => img.is_primary)?.image_url || "/images/editorial/03_the_silhouette.webp",
            secondaryImage: row.product_images?.find((img: any) => !img.is_primary)?.image_url || "/images/editorial/10_the_close_up.webp",
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
    let result = [...ADMIN_PRODUCTS];
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
    return result.map((p) => {
      const asset = ADMIN_MEDIA.find((m) => m.url === p.primaryImage);
      return {
        ...p,
        primaryImageTransform: p.primaryImageTransform || asset?.transform,
      };
    });
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

    return ADMIN_COLLECTIONS.filter((c: any) => c.isPublished);
  },

  async getCollectionBySlug(slug: string): Promise<Collection | null> {
    const collections = await this.getCollections();
    return collections.find((c) => c.slug === slug) || null;
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
        imageUrl: it.imageUrl || "/images/editorial/03_the_silhouette.webp",
      })),
    };

    loadStateFromDisk();
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

    saveStateToDisk();

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
                image: it.image_url || "/images/editorial/03_the_silhouette.webp",
              })),
            };
          }
        }
      } catch (err) {
        console.warn("Supabase order lookup failed, checking local samples:", err);
      }
    }

    // Check ADMIN_ORDERS
    loadStateFromDisk();
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
            image: it.imageUrl || "/images/editorial/03_the_silhouette.webp",
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
    loadStateFromDisk();
    ADMIN_RETURNS.unshift(newReturn);
    saveStateToDisk();

    return {
      success: true,
      requestCode,
    };
  },

  // ---------------------------------------------------------------------------
  // ADMIN: PRODUCTS CRUD
  // ---------------------------------------------------------------------------
  async getAllAdminProducts() {
    loadStateFromDisk();
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
      primaryImage: data.primaryImage || "/images/editorial/03_the_silhouette.webp",
      secondaryImage: data.secondaryImage || "/images/editorial/10_the_close_up.webp",
      gallery: data.gallery || [data.primaryImage || "/images/editorial/03_the_silhouette.webp"],
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
    PRODUCTS.unshift(newProduct);
    saveStateToDisk();
    return newProduct;
  },

  async updateProduct(id: string, updates: any) {
    const idx = ADMIN_PRODUCTS.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Produit non trouvé");
    ADMIN_PRODUCTS[idx] = { ...ADMIN_PRODUCTS[idx], ...updates };
    const pIdx = PRODUCTS.findIndex((p) => p.id === id);
    if (pIdx !== -1) PRODUCTS[pIdx] = { ...PRODUCTS[pIdx], ...updates };
    saveStateToDisk();
    return ADMIN_PRODUCTS[idx];
  },

  async togglePublishProduct(id: string) {
    const product = ADMIN_PRODUCTS.find((p) => p.id === id);
    if (!product) throw new Error("Produit non trouvé");
    product.isPublished = !product.isPublished;
    const pIdx = PRODUCTS.findIndex((p) => p.id === id);
    if (pIdx !== -1) (PRODUCTS[pIdx] as any).isPublished = product.isPublished;
    saveStateToDisk();
    return product;
  },

  async deleteProduct(id: string) {
    const idx = ADMIN_PRODUCTS.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Produit non trouvé");
    const [deleted] = ADMIN_PRODUCTS.splice(idx, 1);
    const pIdx = PRODUCTS.findIndex((p) => p.id === id);
    if (pIdx !== -1) PRODUCTS.splice(pIdx, 1);
    saveStateToDisk();
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
      story: data.story || data.description || "",
      heroDesktopImage: data.heroDesktopImage || "/images/editorial/08_mediterranean_street.webp",
      heroMobileImage: data.heroMobileImage || "/images/editorial/03_the_silhouette.webp",
      isCapsule: data.isCapsule ?? false,
      isPublished: data.isPublished ?? true,
      productCount: data.productCount || 0,
      productSlugs: data.productSlugs || [],
      createdAt: new Date().toISOString(),
    };
    ADMIN_COLLECTIONS.unshift(newCol);
    COLLECTIONS.unshift(newCol);
    saveStateToDisk();
    return newCol;
  },

  async updateCollection(id: string, updates: any) {
    const idx = ADMIN_COLLECTIONS.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Collection non trouvée");
    ADMIN_COLLECTIONS[idx] = { ...ADMIN_COLLECTIONS[idx], ...updates };
    const cIdx = COLLECTIONS.findIndex((c) => c.id === id);
    if (cIdx !== -1) COLLECTIONS[cIdx] = { ...COLLECTIONS[cIdx], ...updates };
    saveStateToDisk();
    return ADMIN_COLLECTIONS[idx];
  },

  async togglePublishCollection(id: string) {
    const col = ADMIN_COLLECTIONS.find((c) => c.id === id);
    if (!col) throw new Error("Collection non trouvée");
    col.isPublished = !col.isPublished;
    const cIdx = COLLECTIONS.findIndex((c) => c.id === id);
    if (cIdx !== -1) COLLECTIONS[cIdx].isPublished = col.isPublished;
    saveStateToDisk();
    return col;
  },

  async deleteCollection(id: string) {
    const idx = ADMIN_COLLECTIONS.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Collection non trouvée");
    const [deleted] = ADMIN_COLLECTIONS.splice(idx, 1);
    const cIdx = COLLECTIONS.findIndex((c) => c.id === id);
    if (cIdx !== -1) COLLECTIONS.splice(cIdx, 1);
    saveStateToDisk();
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
    saveStateToDisk();
    return newPromo;
  },

  async updatePromotion(id: string, updates: any) {
    const idx = ADMIN_PROMOTIONS.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Code promo non trouvé");
    ADMIN_PROMOTIONS[idx] = { ...ADMIN_PROMOTIONS[idx], ...updates };
    saveStateToDisk();
    return ADMIN_PROMOTIONS[idx];
  },

  async togglePromotionActive(id: string) {
    const promo = ADMIN_PROMOTIONS.find((p) => p.id === id);
    if (!promo) throw new Error("Code promo non trouvé");
    promo.isActive = !promo.isActive;
    saveStateToDisk();
    return promo;
  },

  async deletePromotion(id: string) {
    const idx = ADMIN_PROMOTIONS.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Code promo non trouvé");
    const [deleted] = ADMIN_PROMOTIONS.splice(idx, 1);
    saveStateToDisk();
    return deleted;
  },

  // ---------------------------------------------------------------------------
  // ADMIN: ORDERS MANAGEMENT
  // ---------------------------------------------------------------------------
  async getAllAdminOrders() {
    loadStateFromDisk();
    return ADMIN_ORDERS;
  },

  async updateOrderStatus(orderId: string, status: string) {
    loadStateFromDisk();
    const order = ADMIN_ORDERS.find((o) => o.id === orderId || o.orderCode === orderId);
    if (!order) throw new Error("Commande non trouvée");
    order.status = status;
    if (SAMPLE_ORDERS[order.orderCode]) {
      SAMPLE_ORDERS[order.orderCode].status = status;
    }
    saveStateToDisk();
    return order;
  },

  // ---------------------------------------------------------------------------
  // ADMIN: RETURNS & EXCHANGES MANAGEMENT
  // ---------------------------------------------------------------------------
  async getAllAdminReturns() {
    loadStateFromDisk();
    return ADMIN_RETURNS;
  },

  async updateReturnStatus(returnId: string, status: string, adminNotes?: string) {
    const ret = ADMIN_RETURNS.find((r) => r.id === returnId || r.requestCode === returnId);
    if (!ret) throw new Error("Demande de retour non trouvée");
    ret.status = status;
    if (adminNotes !== undefined) ret.adminNotes = adminNotes;
    saveStateToDisk();
    return ret;
  },

  // ---------------------------------------------------------------------------
  // HOMEPAGE CMS: DRAFT VS PUBLISHED STATE ENGINE
  // ---------------------------------------------------------------------------
  async getPublishedHomepage() {
    return HOMEPAGE_PUBLISHED_SECTIONS
      .filter((s) => s.isEnabled)
      .sort((a, b) => a.order - b.order)
      .map((s) => {
        const sec = { ...s };
        if (sec.desktopImage && !sec.desktopImageTransform) {
          const media = ADMIN_MEDIA.find((m) => m.url === sec.desktopImage);
          if (media?.transform) sec.desktopImageTransform = media.transform;
        }
        if (sec.mobileImage && !sec.mobileImageTransform) {
          const media = ADMIN_MEDIA.find((m) => m.url === sec.mobileImage);
          if (media?.transform) sec.mobileImageTransform = media.transform;
        }
        return sec;
      });
  },

  async getDraftHomepage() {
    return {
      sections: [...HOMEPAGE_DRAFT_SECTIONS].sort((a, b) => a.order - b.order),
      meta: { ...HOMEPAGE_CMS_META },
    };
  },

  async saveHomepageDraft(sections: any[], autoPublish: boolean = true) {
    HOMEPAGE_DRAFT_SECTIONS = sections.map((s, idx) => ({
      ...s,
      order: idx + 1,
    }));
    if (autoPublish) {
      HOMEPAGE_PUBLISHED_SECTIONS = JSON.parse(JSON.stringify(HOMEPAGE_DRAFT_SECTIONS));
      HOMEPAGE_CMS_META.hasUnpublishedChanges = false;
      HOMEPAGE_CMS_META.lastPublishedAt = new Date().toISOString();
    } else {
      HOMEPAGE_CMS_META.hasUnpublishedChanges = true;
    }
    saveStateToDisk();
    return {
      success: true,
      sections: HOMEPAGE_DRAFT_SECTIONS,
      publishedSections: HOMEPAGE_PUBLISHED_SECTIONS,
      meta: HOMEPAGE_CMS_META,
    };
  },

  async updateHomepageSection(sectionId: string, updates: any) {
    const section = HOMEPAGE_DRAFT_SECTIONS.find((s) => s.id === sectionId);
    if (!section) throw new Error("Section non trouvée");
    Object.assign(section, updates);
    const pubSection = HOMEPAGE_PUBLISHED_SECTIONS.find((s) => s.id === sectionId);
    if (pubSection) {
      Object.assign(pubSection, updates);
    }
    HOMEPAGE_CMS_META.hasUnpublishedChanges = false;
    HOMEPAGE_CMS_META.lastPublishedAt = new Date().toISOString();
    saveStateToDisk();
    return section;
  },

  async reorderHomepageSections(orderedIds: string[]) {
    orderedIds.forEach((id, index) => {
      const sec = HOMEPAGE_DRAFT_SECTIONS.find((s) => s.id === id);
      if (sec) sec.order = index + 1;
    });
    HOMEPAGE_CMS_META.hasUnpublishedChanges = true;
    saveStateToDisk();
    return HOMEPAGE_DRAFT_SECTIONS.sort((a, b) => a.order - b.order);
  },

  async publishHomepageChanges() {
    // Deep clone draft to published
    HOMEPAGE_PUBLISHED_SECTIONS = JSON.parse(JSON.stringify(HOMEPAGE_DRAFT_SECTIONS));
    HOMEPAGE_CMS_META.hasUnpublishedChanges = false;
    HOMEPAGE_CMS_META.lastPublishedAt = new Date().toISOString();
    saveStateToDisk();

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
    saveStateToDisk();

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
      name: asset.name || `image-${Date.now()}.webp`,
      url: asset.url,
      dimensions: asset.dimensions || "1200 x 1600",
      size: asset.size || "450 KB",
      mimeType: asset.mimeType || "image/jpeg",
      createdAt: new Date().toISOString().split("T")[0],
    };
    ADMIN_MEDIA.unshift(newMedia);
    saveStateToDisk();
    return newMedia;
  },

  async updateMediaTransform(mediaId: string, transform: ImageTransformMetadata) {
    const asset = ADMIN_MEDIA.find((m) => m.id === mediaId || m.url === mediaId);
    if (!asset) throw new Error("Média non trouvé");
    asset.transform = transform;

    // Propagate transform to all Homepage sections (draft and published) using this image
    const updateSectionTransforms = (secList: any[]) => {
      secList.forEach((s) => {
        if (s.desktopImage === asset.url || s.image === asset.url) {
          const dt = transform.desktop || transform;
          s.desktopImageTransform = { ...(s.desktopImageTransform || {}), ...transform, ...dt };
        }
        if (s.mobileImage === asset.url) {
          const mt = transform.mobile || transform;
          s.mobileImageTransform = { ...(s.mobileImageTransform || {}), ...transform, ...mt };
        }
      });
    };
    updateSectionTransforms(HOMEPAGE_DRAFT_SECTIONS);
    updateSectionTransforms(HOMEPAGE_PUBLISHED_SECTIONS);

    // Propagate transform to Products
    const updateProductTransforms = (prodList: any[]) => {
      prodList.forEach((p) => {
        if (p.primaryImage === asset.url) {
          p.primaryImageTransform = { ...(p.primaryImageTransform || {}), ...transform };
        }
        if (p.secondaryImage === asset.url) {
          p.secondaryImageTransform = { ...(p.secondaryImageTransform || {}), ...transform };
        }
      });
    };
    updateProductTransforms(ADMIN_PRODUCTS);
    updateProductTransforms(PRODUCTS);

    saveStateToDisk();
    return asset;
  },

  getImageTransform(url: string): ImageTransformMetadata | undefined {
    return ADMIN_MEDIA.find((m) => m.url === url)?.transform;
  },

  async deleteMedia(mediaId: string) {
    const idx = ADMIN_MEDIA.findIndex((m) => m.id === mediaId);
    if (idx === -1) throw new Error("Média non trouvé");
    const [deleted] = ADMIN_MEDIA.splice(idx, 1);
    saveStateToDisk();
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
    saveStateToDisk();
    return ADMIN_SETTINGS;
  },

  // ---------------------------------------------------------------------------
  // GLOBAL SAVE & PERSISTENCE
  // ---------------------------------------------------------------------------
  async saveAll(activeData?: {
    settings?: any;
    homepageSections?: any[];
    publishHomepage?: boolean;
  }) {
    if (activeData?.settings) {
      Object.assign(ADMIN_SETTINGS, activeData.settings);
    }
    if (Array.isArray(activeData?.homepageSections) && activeData.homepageSections.length > 0) {
      HOMEPAGE_DRAFT_SECTIONS.length = 0;
      HOMEPAGE_DRAFT_SECTIONS.push(
        ...activeData.homepageSections.map((s, idx) => ({ ...s, order: idx + 1 }))
      );
    }
    // Auto-publish to live site on every save unless explicitly disabled
    if (activeData?.publishHomepage !== false) {
      HOMEPAGE_PUBLISHED_SECTIONS.length = 0;
      HOMEPAGE_PUBLISHED_SECTIONS.push(
        ...JSON.parse(JSON.stringify(HOMEPAGE_DRAFT_SECTIONS))
      );
      HOMEPAGE_CMS_META.hasUnpublishedChanges = false;
      HOMEPAGE_CMS_META.lastPublishedAt = new Date().toISOString();
    }
    return saveStateToDisk();
  },

  async getLastSavedInfo() {
    return getLastSavedInfo();
  },
};

// =============================================================================
// IN-MEMORY ADMIN DATA STORES
// =============================================================================

export const ADMIN_PRODUCTS: any[] = [...PRODUCTS];

export const ADMIN_COLLECTIONS: any[] = [...COLLECTIONS];

export const ADMIN_PROMOTIONS: any[] = [];

export const ADMIN_ORDERS: any[] = [];

export const ADMIN_RETURNS: any[] = [];

export const DEFAULT_HOMEPAGE_SECTIONS: any[] = [
  {
    id: "sec-hero",
    key: "hero",
    badge: "Nouvelle Collection",
    title: "L'Élégance Contemporaine au Quotidien",
    subtitle: "Silhouettes sport-chic façonnées par la lumière tunisienne",
    description: "Des coupes épurées et confortables pensées pour accompagner le rythme de la femme moderne avec assurance et simplicité.",
    ctaText: "DÉCOUVRIR AÏLYS",
    ctaLink: "#nouvelle-collection",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    desktopImage: "/images/editorial/01_ailys_hero.webp",
    mobileImage: "/images/editorial/02_ailys_portrait.webp",
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
      focalPoint: { x: 50, y: 35 },
      objectPosition: "50% 35%",
      aspectRatio: "3:4",
    },
    order: 1,
    isEnabled: true,
  },
  {
    id: "sec-collection",
    key: "new_collection",
    badge: "Nouvelle Collection",
    title: "Nouvelle Collection",
    subtitle: "Matières douces, coupes nettes et confort contemporain",
    description: "Des pièces faciles à vivre au tombé impeccable, où la pureté des lignes rencontre le confort des matières naturelles.",
    ctaText: "Découvrir les collections",
    ctaLink: "/collections",
    desktopImage: "/images/editorial/03_the_silhouette.webp",
    mobileImage: "/images/editorial/03_the_silhouette.webp",
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
    selectedProductSlugs: [],
    order: 2,
    isEnabled: true,
  },
  {
    id: "sec-philosophy",
    key: "philosophy",
    badge: "La Philosophie",
    title: "L'Allure AÏLYS",
    subtitle: "« Quiet confidence, shaped by Tunisian light. »",
    description: "Une élégance sans artifice. Des volumes équilibrés et des matières agréables à porter pour traverser les journées actives avec aisance.",
    ctaText: "L'Esprit AÏLYS",
    ctaLink: "/a-propos",
    desktopImage: "/images/editorial/06_tunisian_architecture.webp",
    mobileImage: "/images/editorial/06_tunisian_architecture.webp",
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
    badge: "Confection & Matières",
    title: "Confection & Matières",
    subtitle: "Matières sélectionnées, coupes précises et finitions soignées",
    description: "Chaque silhouette AÏLYS est confectionnée en Tunisie avec un souci constant du détail, de la qualité des coutures et du confort d'usage.",
    ctaText: "En savoir plus",
    ctaLink: "/a-propos",
    desktopImage: "/images/editorial/04_craftsmanship_detail.webp",
    mobileImage: "/images/editorial/04_craftsmanship_detail.webp",
    desktopImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 50 },
      objectPosition: "50% 50%",
      aspectRatio: "1:1",
    },
    mobileImageTransform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 50 },
      objectPosition: "50% 50%",
      aspectRatio: "1:1",
    },
    order: 4,
    isEnabled: true,
  },
  {
    id: "sec-about",
    key: "about",
    badge: "Origine du Nom",
    title: "Aïcha & la Fleur de Lys",
    subtitle: "L'union du prénom et de la fleur",
    description: "Le nom AÏLYS réunit Aïcha, la fille de la fondatrice, et la fleur de lys, sa fleur de prédilection. Une histoire de transmission et d'élégance naturelle.",
    ctaText: "Découvrir l'histoire",
    ctaLink: "/a-propos",
    desktopImage: "/images/editorial/07_minimal_studio.webp",
    mobileImage: "/images/editorial/07_minimal_studio.webp",
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
    badge: "L'Univers AÏLYS",
    title: "Découvrir la Collection",
    subtitle: "Une allure contemporaine pensée pour le quotidien",
    description: "Explorez notre sélection de pièces pour Femme, Homme et Enfant, alliant confort et élégance sobre.",
    ctaText: "Découvrir la boutique",
    ctaLink: "/shop",
    desktopImage: "/images/editorial/12_the_finale_cta.webp",
    mobileImage: "/images/editorial/12_the_finale_cta.webp",
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
    id: "med-01",
    name: "01_ailys_hero.webp",
    url: "/images/editorial/01_ailys_hero.webp",
    dimensions: "2560 x 1440",
    size: "124 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
    transform: {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: 50, y: 40 },
      objectPosition: "50% 40%",
      aspectRatio: "16:9",
      desktop: { zoom: 1, rotate: 0, focalPoint: { x: 50, y: 40 }, aspectRatio: "16:9" },
      mobile: { zoom: 1.1, rotate: 0, focalPoint: { x: 50, y: 35 }, aspectRatio: "3:4" },
    },
  },
  {
    id: "med-02",
    name: "02_ailys_portrait.webp",
    url: "/images/editorial/02_ailys_portrait.webp",
    dimensions: "1664 x 2080",
    size: "168 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
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
    id: "med-03",
    name: "03_the_silhouette.webp",
    url: "/images/editorial/03_the_silhouette.webp",
    dimensions: "1664 x 2080",
    size: "286 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
  },
  {
    id: "med-04",
    name: "04_craftsmanship_detail.webp",
    url: "/images/editorial/04_craftsmanship_detail.webp",
    dimensions: "1920 x 1920",
    size: "513 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
  },
  {
    id: "med-05",
    name: "05_movement.webp",
    url: "/images/editorial/05_movement.webp",
    dimensions: "2560 x 1440",
    size: "273 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
  },
  {
    id: "med-06",
    name: "06_tunisian_architecture.webp",
    url: "/images/editorial/06_tunisian_architecture.webp",
    dimensions: "1664 x 2080",
    size: "281 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
  },
  {
    id: "med-07",
    name: "07_minimal_studio.webp",
    url: "/images/editorial/07_minimal_studio.webp",
    dimensions: "1664 x 2080",
    size: "188 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
  },
  {
    id: "med-08",
    name: "08_mediterranean_street.webp",
    url: "/images/editorial/08_mediterranean_street.webp",
    dimensions: "2560 x 1440",
    size: "197 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
  },
  {
    id: "med-09",
    name: "09_ailys_still_life.webp",
    url: "/images/editorial/09_ailys_still_life.webp",
    dimensions: "1920 x 1920",
    size: "395 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
  },
  {
    id: "med-10",
    name: "10_the_close_up.webp",
    url: "/images/editorial/10_the_close_up.webp",
    dimensions: "1664 x 2080",
    size: "188 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
  },
  {
    id: "med-11",
    name: "11_ailys_atmosphere.webp",
    url: "/images/editorial/11_ailys_atmosphere.webp",
    dimensions: "2560 x 1440",
    size: "292 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
  },
  {
    id: "med-12",
    name: "12_the_finale_cta.webp",
    url: "/images/editorial/12_the_finale_cta.webp",
    dimensions: "2560 x 1440",
    size: "254 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
  },
  {
    id: "med-man",
    name: "man-collection.webp",
    url: "/images/editorial/man-collection.webp",
    dimensions: "819 x 1024",
    size: "87 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
  },
  {
    id: "med-children",
    name: "children-collection.webp",
    url: "/images/editorial/children-collection.webp",
    dimensions: "819 x 1024",
    size: "72 KB",
    mimeType: "image/webp",
    createdAt: "2026-09-18",
  },
  {
    id: "med-logo",
    name: "logo.svg",
    url: "/logo.svg",
    dimensions: "567 x 567",
    size: "5 KB",
    mimeType: "image/svg+xml",
    createdAt: "2026-09-17",
  },
];

export const ADMIN_SETTINGS = {
  brandName: "AÏLYS",
  brandTagline: "Maison de Confection Contemporaine Tunisienne",
  contactPhone: "+216 70 000 000",
  contactWhatsApp: "+216 98 000 000",
  contactEmail: "concierge@ailys.tn",
  atelierAddress: "Sfax, Tunisie",
  freeShippingThreshold: 200,
  standardShippingFee: 7,
  deliveryDelayTunis: "24h - 48h",
  deliveryDelayRegions: "24h - 48h",
  announcementBarMessage: "Livraison 24h - 48h partout en Tunisie • Expédié depuis Sfax • Paiement à la livraison",
  announcementBarActive: true,
};

// =============================================================================
// DISK PERSISTENCE ENGINE (data/admin-data.json)
// =============================================================================

export let LAST_SAVED_AT: string | null = null;

export function saveStateToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const timestamp = new Date().toISOString();
    LAST_SAVED_AT = timestamp;
    const payload = {
      lastSavedAt: timestamp,
      version: "1.0",
      settings: ADMIN_SETTINGS,
      homepageDraft: HOMEPAGE_DRAFT_SECTIONS,
      homepagePublished: HOMEPAGE_PUBLISHED_SECTIONS,
      homepageMeta: { ...HOMEPAGE_CMS_META, lastSavedAt: timestamp },
      products: ADMIN_PRODUCTS,
      collections: ADMIN_COLLECTIONS,
      promotions: ADMIN_PROMOTIONS,
      orders: ADMIN_ORDERS,
      returns: ADMIN_RETURNS,
      media: ADMIN_MEDIA,
    };
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(payload, null, 2), "utf-8");
    return {
      success: true,
      lastSavedAt: timestamp,
      stats: {
        products: ADMIN_PRODUCTS.length,
        collections: ADMIN_COLLECTIONS.length,
        promotions: ADMIN_PROMOTIONS.length,
        orders: ADMIN_ORDERS.length,
        returns: ADMIN_RETURNS.length,
        media: ADMIN_MEDIA.length,
      },
    };
  } catch (err) {
    console.error("Error saving admin state to disk:", err);
    throw err;
  }
}

export function getLastSavedInfo() {
  let savedTime = LAST_SAVED_AT;
  if (!savedTime && fs.existsSync(STORAGE_FILE)) {
    try {
      const stat = fs.statSync(STORAGE_FILE);
      savedTime = stat.mtime.toISOString();
    } catch {
      // ignore
    }
  }
  return {
    lastSavedAt: savedTime,
    stats: {
      products: ADMIN_PRODUCTS.length,
      collections: ADMIN_COLLECTIONS.length,
      promotions: ADMIN_PROMOTIONS.length,
      orders: ADMIN_ORDERS.length,
      returns: ADMIN_RETURNS.length,
      media: ADMIN_MEDIA.length,
    },
  };
}

export function loadStateFromDisk() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      const data = JSON.parse(raw);
      if (Array.isArray(data.products) && data.products.length > 0) {
        ADMIN_PRODUCTS.length = 0;
        ADMIN_PRODUCTS.push(...data.products);
        PRODUCTS.length = 0;
        PRODUCTS.push(...data.products);
      }
      if (Array.isArray(data.collections) && data.collections.length > 0) {
        ADMIN_COLLECTIONS.length = 0;
        ADMIN_COLLECTIONS.push(...data.collections);
        COLLECTIONS.length = 0;
        COLLECTIONS.push(...data.collections);
      }
      if (Array.isArray(data.promotions)) {
        ADMIN_PROMOTIONS.length = 0;
        ADMIN_PROMOTIONS.push(...data.promotions);
      }
      if (Array.isArray(data.orders)) {
        ADMIN_ORDERS.length = 0;
        ADMIN_ORDERS.push(...data.orders);
      }
      if (Array.isArray(data.returns)) {
        ADMIN_RETURNS.length = 0;
        ADMIN_RETURNS.push(...data.returns);
      }
      if (Array.isArray(data.media)) {
        ADMIN_MEDIA.length = 0;
        ADMIN_MEDIA.push(...data.media);
      }
      if (data.settings && typeof data.settings === "object") {
        Object.assign(ADMIN_SETTINGS, data.settings);
      }
      if (Array.isArray(data.homepageDraft)) {
        HOMEPAGE_DRAFT_SECTIONS.length = 0;
        HOMEPAGE_DRAFT_SECTIONS.push(...data.homepageDraft);
      }
      if (Array.isArray(data.homepagePublished)) {
        HOMEPAGE_PUBLISHED_SECTIONS.length = 0;
        HOMEPAGE_PUBLISHED_SECTIONS.push(...data.homepagePublished);
      }
      if (data.homepageMeta) {
        Object.assign(HOMEPAGE_CMS_META, data.homepageMeta);
      }
      if (data.lastSavedAt) {
        LAST_SAVED_AT = data.lastSavedAt;
      }
    }
  } catch (err) {
    console.warn("Could not load admin-data.json:", err);
  }
}

// Initial hydration from disk
loadStateFromDisk();

