import fs from "fs";
import path from "path";
import { createServerSupabaseClient } from "../supabase/server";
import { createAdminSupabaseClient } from "../supabase/admin";
import { CATEGORIES, SAMPLE_ORDERS, Product, Collection, ImageTransformMetadata, DEFAULT_IMAGE_TRANSFORM } from "../data";

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
    requestedExchangeColor?: string;
    returnedVariantId?: string;
    replacementVariantId?: string;
    replacementQuantity?: number;
    exchangeSize?: string;
    exchangeColor?: string;
  }[];
}

function isLiveSupabaseConfigured(): boolean {
  const DEFAULT_SUPABASE_URL = "https://kafyatqatggifedqtctm.supabase.co";
  const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZnlhdHFhdGdnaWZlZHF0Y3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTcwNzgsImV4cCI6MjEwNTU3MzA3OH0.Uo7z-jd2-cBVAlndWhTCfuOxRCpapPK2A7dEBBUqWf4";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
  return !!(url && key && !url.includes("placeholder-project") && !key.includes("placeholder-anon-key"));
}

async function getSupabaseAdminOrServerClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey && !serviceKey.includes("placeholder")) {
    return createAdminSupabaseClient();
  }
  return await createServerSupabaseClient();
}

function mapSupabaseProductRow(row: any): Product {
  const rawSizes = (row.product_variants || [])
    .map((v: any) => v.sizes?.name?.replace(/\s*\(.*?\)/, "") || v.sizes?.code?.replace(/^[FHE]-/, ""))
    .filter(Boolean);
  const sizes = Array.from(new Set(rawSizes)) as string[];
  if (sizes.length === 0) sizes.push("36", "38", "40", "42");

  const rawColors = (row.product_variants || [])
    .map((v: any) => (v.colors ? { name: v.colors.name, hex: v.colors.hex } : null))
    .filter(Boolean);
  const colorMap = new Map();
  rawColors.forEach((c: any) => {
    if (c && !colorMap.has(c.name)) colorMap.set(c.name, c);
  });
  const colors = Array.from(colorMap.values());
  if (colors.length === 0) colors.push({ name: "Noir Ébène", hex: "#111111" });

  const images = (row.product_images || []).sort(
    (a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)
  );
  const primaryImg =
    images.find((i: any) => i.is_primary)?.image_url ||
    images[0]?.image_url ||
    "/images/editorial/03_the_silhouette.webp";
  const secondaryImg =
    images.find((i: any) => !i.is_primary)?.image_url ||
    images[1]?.image_url ||
    primaryImg;
  const gallery = images.map((i: any) => i.image_url);

  const isSoldOut =
    Boolean(row.is_sold_out_manual_override) ||
    (Array.isArray(row.product_variants) &&
      row.product_variants.length > 0 &&
      row.product_variants.every((v: any) => (v.stock_quantity || 0) <= 0));

  // Dynamic collection from collection_products join
  const primaryCollection = row.collection_products?.[0]?.collections;
  const collectionName = primaryCollection?.title || "";
  const collectionSlug = primaryCollection?.slug || "";

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle || "",
    category: row.categories?.slug || "femme",
    subCategory: row.sub_category || "",
    price: Number(row.price),
    salePrice: row.sale_price ? Number(row.sale_price) : undefined,
    collection: collectionName,
    collectionSlug: collectionSlug,
    primaryImage: primaryImg,
    secondaryImage: secondaryImg,
    gallery: gallery.length > 0 ? gallery : [primaryImg],
    colors,
    sizes,
    description: row.description || "",
    materials: row.materials || "",
    care: row.care || "",
    fit: row.fit || "",
    isNew: Boolean(row.is_new),
    isCapsule: Boolean(row.is_capsule),
    isSoldOut,
    isFeatured: Boolean(row.is_featured),
    sizeGuide: row.size_guide || null,
  };
}

export const AilysRepository = {
  // ---------------------------------------------------------------------------
  // PRODUCTS (Supabase Single Source of Truth)
  // ---------------------------------------------------------------------------
  async getProducts(filters?: {
    category?: string;
    size?: string;
    sortBy?: "newest" | "price-asc" | "price-desc";
  }): Promise<Product[]> {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured. Database must be single source of truth.");
    }

    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from("products")
      .select(`
        *,
        categories (*),
        product_images (*),
        product_variants (*, sizes (*), colors (*)),
        collection_products (collections (*))
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
    if (error) {
      console.error("Supabase getProducts query error:", error);
      throw new Error(`Erreur Supabase lors de la récupération des produits: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    let mapped = data.map(mapSupabaseProductRow);

    if (filters?.size && filters.size !== "all") {
      mapped = mapped.filter((p) => p.sizes.includes(filters.size!));
    }

    return mapped.map((p) => {
      const asset = ADMIN_MEDIA.find((m) => m.url === p.primaryImage);
      return {
        ...p,
        primaryImageTransform: p.primaryImageTransform || asset?.transform,
      };
    });
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (*),
        product_images (*),
        product_variants (*, sizes (*), colors (*)),
        collection_products (collections (*))
      `)
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error(`Supabase getProductBySlug error for slug ${slug}:`, error);
      throw new Error(`Erreur Supabase: ${error.message}`);
    }

    if (!data) return null;

    const mapped = mapSupabaseProductRow(data);
    const asset = ADMIN_MEDIA.find((m) => m.url === mapped.primaryImage);
    return {
      ...mapped,
      primaryImageTransform: mapped.primaryImageTransform || asset?.transform,
    };
  },

  // ---------------------------------------------------------------------------
  // COLLECTIONS (Supabase Single Source of Truth)
  // ---------------------------------------------------------------------------
  async getCollections(): Promise<Collection[]> {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("collections")
      .select(`
        *,
        collection_products (product_id, products (slug))
      `)
      .eq("is_published", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Supabase getCollections error:", error);
      throw new Error(`Erreur Supabase getCollections: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

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
      isCapsule: Boolean(row.is_capsule),
      isPublished: Boolean(row.is_published),
      productCount: row.collection_products?.filter((cp: any) => !!cp.products)?.length || 0,
    }));
  },

  async getCollectionBySlug(slug: string): Promise<Collection | null> {
    const collections = await this.getCollections();
    return collections.find((c) => c.slug === slug) || null;
  },

  // ---------------------------------------------------------------------------
  // ORDERS (Guest Checkout, Cash on Delivery only)
  // ---------------------------------------------------------------------------
  async createOrder(params: CreateOrderParams) {
    if (isLiveSupabaseConfigured()) {
      const supabase = await createServerSupabaseClient();
      const { data: rpcRes, error: rpcErr } = await (supabase.rpc as any)("execute_checkout", {
        p_customer_name: params.customerName,
        p_phone: params.customerPhone,
        p_governorate: params.governorate,
        p_city: params.city,
        p_address: params.address,
        p_items: params.items.map((it: any) => ({
          product_id: it.productId && it.productId.length === 36 ? it.productId : undefined,
          product_slug: it.productId && it.productId.length !== 36 ? it.productId : it.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          variant_id: it.variantId || it.variant_id || undefined,
          product_name: it.productName,
          size: it.size,
          color: it.color,
          quantity: it.quantity,
          image_url: it.imageUrl,
        })),
        p_customer_email: params.customerEmail || undefined,
        p_alt_phone: params.altPhone || undefined,
        p_notes: params.notes || undefined,
      });

      if (rpcErr) {
        throw new Error(`Supabase checkout error: ${rpcErr.message}`);
      }

      const res = rpcRes as any;
      if (!res || !res.success) {
        throw new Error(res?.error || "Checkout failed to complete");
      }

      return {
        success: true,
        orderCode: res.orderCode,
        orderId: res.orderId,
        total: Number(res.total),
        status: "nouveau",
      };
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `AILYS-2609-${randomSuffix}`;

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
        const { data, error } = await (supabase.rpc as any)("track_order", {
          p_order_code: cleanCode,
          p_phone: cleanPhone,
        });

        if (!error && data && data.found) {
          return {
            orderCode: data.orderCode,
            orderId: data.orderId,
            customerName: data.customerName || "",
            phone: phone,
            orderDate: new Date(data.createdAt).toLocaleDateString("fr-FR"),
            status: data.status,
            items: (data.items || []).map((it: any) => ({
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
        const supabase = await createServerSupabaseClient();
        const { data: rpcRes, error: rpcErr } = await (supabase.rpc as any)("submit_return_request", {
          p_order_code: params.orderCode,
          p_phone: params.customerPhone,
          p_type: params.type || "retour",
          p_reason: params.reason || "Autre",
          p_items: params.items,
          p_comments: params.comments || null,
          p_tags_intact: params.tagsIntactConfirmed ?? true,
        });

        if (!rpcErr && rpcRes && rpcRes.success) {
          return {
            success: true,
            requestCode: rpcRes.requestCode || rpcRes.returnCode,
            returnCode: rpcRes.returnCode || rpcRes.requestCode,
            returnId: rpcRes.returnId,
          };
        }

        if (rpcErr) {
          console.warn("Supabase submit_return_request error:", rpcErr.message);
        }
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
  // ADMIN: PRODUCTS CRUD (Supabase Single Source of Truth)
  // ---------------------------------------------------------------------------
  async getAllAdminProducts() {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        categories (*),
        product_images (*),
        product_variants (*, sizes (*), colors (*)),
        collection_products (collections (*))
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase getAllAdminProducts error:", error);
      throw new Error(`Erreur Supabase Admin: ${error.message}`);
    }

    if (!data) return [];

    return data.map((row: any) => {
      const p = mapSupabaseProductRow(row);
      return {
        ...p,
        isPublished: Boolean(row.is_published),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    });
  },

  async createProduct(data: any) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();

    // 1. Resolve category_id
    let categoryId = data.categoryId;
    if (!categoryId && data.category) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", data.category.toLowerCase())
        .maybeSingle();
      if (cat) categoryId = cat.id;
    }
    if (!categoryId) {
      const { data: firstCat } = await supabase.from("categories").select("id").limit(1).single();
      categoryId = firstCat?.id;
    }

    const newId = crypto.randomUUID();
    const slug = (data.slug || data.name || "produit")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newProductRow: any = {
      id: newId,
      name: data.name,
      slug,
      subtitle: data.subtitle || "",
      description: data.description || "",
      materials: data.materials || "",
      care: data.care || data.care_instructions || "",
      fit: data.fit || "",
      price: Number(data.price),
      sale_price: data.salePrice ? Number(data.salePrice) : null,
      category_id: categoryId,
      sub_category: data.subCategory || "",
      is_published: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      is_new: data.isNew !== undefined ? Boolean(data.isNew) : true,
      is_capsule: Boolean(data.isCapsule),
      is_featured: Boolean(data.isFeatured),
      is_sold_out_manual_override: Boolean(data.isSoldOut),
      size_guide: data.sizeGuide || null,
    };

    const { data: created, error } = await supabase
      .from("products")
      .insert(newProductRow)
      .select()
      .single();

    if (error) {
      console.error("Supabase createProduct error:", error);
      throw new Error(`Erreur Supabase création produit: ${error.message}`);
    }

    // 2. Insert primary image if provided
    if (data.primaryImage) {
      await supabase.from("product_images").insert({
        product_id: newId,
        image_url: data.primaryImage,
        is_primary: true,
        display_order: 1,
      });
    }

    // 3. Insert secondary/gallery images
    if (Array.isArray(data.gallery) && data.gallery.length > 0) {
      const galleryInserts = data.gallery
        .filter((img: string) => img && img !== data.primaryImage)
        .map((img: string, idx: number) => ({
          product_id: newId,
          image_url: img,
          is_primary: false,
          display_order: idx + 2,
        }));
      if (galleryInserts.length > 0) {
        await supabase.from("product_images").insert(galleryInserts);
      }
    }

    // 4. Default variants if sizes provided
    if (Array.isArray(data.sizes) && data.sizes.length > 0) {
      const { data: dbSizes } = await supabase.from("sizes").select("id, name, code");
      const { data: dbColors } = await supabase.from("colors").select("id, name").limit(1);
      const defaultColorId = dbColors?.[0]?.id;

      if (dbSizes && defaultColorId) {
        const variantInserts = data.sizes.map((sName: string, idx: number) => {
          const matchSize = dbSizes.find(
            (s: any) =>
              s.name.toLowerCase().includes(sName.toLowerCase()) ||
              s.code.toLowerCase().includes(sName.toLowerCase())
          ) || dbSizes[0];

          return {
            product_id: newId,
            size_id: matchSize.id,
            color_id: defaultColorId,
            sku: `AILYS-${slug.slice(0, 10).toUpperCase()}-${sName.toUpperCase()}-${idx}`,
            stock_quantity: 15,
            low_stock_threshold: 3,
            is_active: true,
          };
        });
        await supabase.from("product_variants").insert(variantInserts);
      }
    }

    // 5. Connect collection if specified
    if (data.collectionId || data.collectionSlug || data.collection) {
      let colId = data.collectionId;
      if (!colId) {
        const cSlug = data.collectionSlug || data.collection?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const { data: col } = await supabase.from("collections").select("id").eq("slug", cSlug).maybeSingle();
        if (col) colId = col.id;
      }
      if (colId) {
        await supabase.from("collection_products").insert({
          collection_id: colId,
          product_id: newId,
          display_order: 1,
        });
      }
    }

    return created;
  },

  async updateProduct(id: string, updates: any) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const updatePayload: any = { updated_at: new Date().toISOString() };

    if (updates.name !== undefined) updatePayload.name = updates.name;
    if (updates.slug !== undefined) updatePayload.slug = updates.slug;
    if (updates.subtitle !== undefined) updatePayload.subtitle = updates.subtitle;
    if (updates.price !== undefined) updatePayload.price = Number(updates.price);
    if (updates.salePrice !== undefined) updatePayload.sale_price = updates.salePrice ? Number(updates.salePrice) : null;
    if (updates.description !== undefined) updatePayload.description = updates.description;
    if (updates.materials !== undefined) updatePayload.materials = updates.materials;
    if (updates.care !== undefined) updatePayload.care = updates.care;
    if (updates.care_instructions !== undefined) updatePayload.care = updates.care_instructions;
    if (updates.fit !== undefined) updatePayload.fit = updates.fit;
    if (updates.isNew !== undefined) updatePayload.is_new = updates.isNew;
    if (updates.isCapsule !== undefined) updatePayload.is_capsule = updates.isCapsule;
    if (updates.isFeatured !== undefined) updatePayload.is_featured = updates.isFeatured;
    if (updates.isPublished !== undefined) updatePayload.is_published = updates.isPublished;
    if (updates.isSoldOut !== undefined) updatePayload.is_sold_out_manual_override = updates.isSoldOut;
    if (updates.sizeGuide !== undefined) updatePayload.size_guide = updates.sizeGuide;
    if (updates.size_guide !== undefined) updatePayload.size_guide = updates.size_guide;
    if (updates.subCategory !== undefined) updatePayload.sub_category = updates.subCategory;

    if (updates.category) {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", updates.category.toLowerCase())
        .maybeSingle();
      if (cat) updatePayload.category_id = cat.id;
    }

    const { data, error } = await supabase
      .from("products")
      .update(updatePayload)
      .or(`id.eq.${id},slug.eq.${id}`)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase updateProduct error:", error);
      throw new Error(`Erreur Supabase mise à jour produit: ${error.message}`);
    }

    return data;
  },

  async togglePublishProduct(id: string) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { data: existing, error: fetchErr } = await supabase
      .from("products")
      .select("id, is_published")
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();

    if (fetchErr || !existing) {
      throw new Error("Produit non trouvé dans Supabase");
    }

    const newStatus = !existing.is_published;
    const { data, error } = await supabase
      .from("products")
      .update({ is_published: newStatus, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur Supabase toggle publish: ${error.message}`);
    }

    return data;
  },

  async deleteProduct(id: string) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();

    const { data: existing } = await supabase
      .from("products")
      .select("id, name, slug")
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();

    if (!existing) {
      throw new Error("Produit introuvable dans Supabase");
    }

    // Clean up dependent foreign keys explicitly
    await supabase.from("collection_products").delete().eq("product_id", existing.id);
    await supabase.from("product_images").delete().eq("product_id", existing.id);
    await supabase.from("product_variants").delete().eq("product_id", existing.id);

    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase deleteProduct error:", error);
      throw new Error(`Erreur Supabase suppression produit: ${error.message}`);
    }

    return data;
  },

  // ---------------------------------------------------------------------------
  // ADMIN: COLLECTIONS CRUD (Supabase Single Source of Truth)
  // ---------------------------------------------------------------------------
  async getAllAdminCollections() {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { data, error } = await supabase
      .from("collections")
      .select(`
        *,
        collection_products (product_id, products (id, slug, name))
      `)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Supabase getAllAdminCollections error:", error);
      throw new Error(`Erreur Supabase: ${error.message}`);
    }

    if (!data) return [];

    return data.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      subtitle: row.subtitle || "",
      description: row.description || "",
      story: row.story || "",
      heroDesktopImage: row.hero_desktop_image,
      heroMobileImage: row.hero_mobile_image || row.hero_desktop_image,
      isCapsule: Boolean(row.is_capsule),
      isPublished: Boolean(row.is_published),
      displayOrder: row.display_order,
      productCount: row.collection_products?.filter((cp: any) => !!cp.products)?.length || 0,
      productSlugs: row.collection_products?.map((cp: any) => cp.products?.slug).filter(Boolean) || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  async createCollection(data: any) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const newId = crypto.randomUUID();
    const slug = (data.slug || data.title || "collection")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const newColRow: any = {
      id: newId,
      slug,
      title: data.title,
      subtitle: data.subtitle || "",
      description: data.description || "",
      story: data.story || data.description || "",
      hero_desktop_image: data.heroDesktopImage || "/images/editorial/08_mediterranean_street.webp",
      hero_mobile_image: data.heroMobileImage || data.heroDesktopImage || "/images/editorial/03_the_silhouette.webp",
      is_capsule: Boolean(data.isCapsule),
      is_published: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      display_order: data.displayOrder || 1,
    };

    const { data: created, error } = await supabase
      .from("collections")
      .insert(newColRow)
      .select()
      .single();

    if (error) {
      console.error("Supabase createCollection error:", error);
      throw new Error(`Erreur Supabase création collection: ${error.message}`);
    }

    if (Array.isArray(data.productSlugs) && data.productSlugs.length > 0) {
      const { data: prods } = await supabase
        .from("products")
        .select("id, slug")
        .in("slug", data.productSlugs);

      if (prods && prods.length > 0) {
        const links = prods.map((p: any, idx: number) => ({
          collection_id: newId,
          product_id: p.id,
          display_order: idx + 1,
        }));
        await supabase.from("collection_products").insert(links);
      }
    }

    return created;
  },

  async updateCollection(id: string, updates: any) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const updatePayload: any = { updated_at: new Date().toISOString() };

    if (updates.title !== undefined) updatePayload.title = updates.title;
    if (updates.slug !== undefined) updatePayload.slug = updates.slug;
    if (updates.subtitle !== undefined) updatePayload.subtitle = updates.subtitle;
    if (updates.description !== undefined) updatePayload.description = updates.description;
    if (updates.story !== undefined) updatePayload.story = updates.story;
    if (updates.heroDesktopImage !== undefined) updatePayload.hero_desktop_image = updates.heroDesktopImage;
    if (updates.heroMobileImage !== undefined) updatePayload.hero_mobile_image = updates.heroMobileImage;
    if (updates.isCapsule !== undefined) updatePayload.is_capsule = updates.isCapsule;
    if (updates.isPublished !== undefined) updatePayload.is_published = updates.isPublished;
    if (updates.displayOrder !== undefined) updatePayload.display_order = updates.displayOrder;

    const { data, error } = await supabase
      .from("collections")
      .update(updatePayload)
      .or(`id.eq.${id},slug.eq.${id}`)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase updateCollection error:", error);
      throw new Error(`Erreur Supabase mise à jour collection: ${error.message}`);
    }

    if (Array.isArray(updates.productSlugs)) {
      const colId = data?.id || id;
      await supabase.from("collection_products").delete().eq("collection_id", colId);
      if (updates.productSlugs.length > 0) {
        const { data: prods } = await supabase
          .from("products")
          .select("id, slug")
          .in("slug", updates.productSlugs);
        if (prods && prods.length > 0) {
          const links = prods.map((p: any, idx: number) => ({
            collection_id: colId,
            product_id: p.id,
            display_order: idx + 1,
          }));
          await supabase.from("collection_products").insert(links);
        }
      }
    }

    return data;
  },

  async togglePublishCollection(id: string) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { data: existing, error: fetchErr } = await supabase
      .from("collections")
      .select("id, is_published")
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();

    if (fetchErr || !existing) {
      throw new Error("Collection non trouvée dans Supabase");
    }

    const newStatus = !existing.is_published;
    const { data, error } = await supabase
      .from("collections")
      .update({ is_published: newStatus, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur Supabase toggle publish collection: ${error.message}`);
    }

    return data;
  },

  async deleteCollection(id: string) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();

    const { data: existing } = await supabase
      .from("collections")
      .select("id")
      .or(`id.eq.${id},slug.eq.${id}`)
      .maybeSingle();

    if (!existing) {
      throw new Error("Collection introuvable dans Supabase");
    }

    await supabase.from("collection_products").delete().eq("collection_id", existing.id);

    const { data, error } = await supabase
      .from("collections")
      .delete()
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      console.error("Supabase deleteCollection error:", error);
      throw new Error(`Erreur Supabase suppression collection: ${error.message}`);
    }

    return data;
  },

  // ---------------------------------------------------------------------------
  // ADMIN: PROMOTIONS CRUD
  // ---------------------------------------------------------------------------
  async getAllAdminPromotions() {
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();
        const { data, error } = await supabase
          .from("promotions")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((p: any) => ({
            id: p.id,
            code: p.code,
            description: p.description || "",
            discountType: p.discount_type,
            discountValue: Number(p.discount_value),
            minOrderAmount: Number(p.min_order_amount || 0),
            startDate: p.start_date ? p.start_date.split("T")[0] : "",
            endDate: p.end_date ? p.end_date.split("T")[0] : "",
            isActive: p.is_active,
            usageCount: 0,
          }));
        }
      } catch (err) {
        console.warn("Supabase promotions query failed, fallback to local:", err);
      }
    }
    return ADMIN_PROMOTIONS;
  },

  async createPromotion(data: any) {
    const code = data.code.toUpperCase().trim();
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();
        const { data: inserted, error } = await supabase
          .from("promotions")
          .insert({
            code,
            description: data.description || "",
            discount_type: data.discountType || "percentage",
            discount_value: Number(data.discountValue),
            min_order_amount: Number(data.minOrderAmount || 0),
            start_date: data.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString(),
            end_date: data.endDate ? new Date(data.endDate).toISOString() : "2026-12-31T23:59:59Z",
            is_active: data.isActive ?? true,
          })
          .select()
          .single();

        if (!error && inserted) {
          const newPromo = {
            id: inserted.id,
            code: inserted.code,
            description: inserted.description || "",
            discountType: inserted.discount_type,
            discountValue: Number(inserted.discount_value),
            minOrderAmount: Number(inserted.min_order_amount || 0),
            startDate: inserted.start_date ? inserted.start_date.split("T")[0] : "",
            endDate: inserted.end_date ? inserted.end_date.split("T")[0] : "",
            isActive: inserted.is_active,
            usageCount: 0,
          };
          ADMIN_PROMOTIONS.unshift(newPromo);
          saveStateToDisk();
          return newPromo;
        }
      } catch (err) {
        console.warn("Supabase promotion create warning:", err);
      }
    }

    const newPromo = {
      id: `promo-${Date.now()}`,
      code,
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
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();
        const payload: any = {};
        if (updates.code) payload.code = updates.code.toUpperCase().trim();
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.discountType) payload.discount_type = updates.discountType;
        if (updates.discountValue !== undefined) payload.discount_value = Number(updates.discountValue);
        if (updates.minOrderAmount !== undefined) payload.min_order_amount = Number(updates.minOrderAmount);
        if (updates.isActive !== undefined) payload.is_active = updates.isActive;

        await supabase
          .from("promotions")
          .update(payload)
          .or(`id.eq.${id},code.eq.${id}`);
      } catch (err) {
        console.warn("Supabase update promotion warning:", err);
      }
    }

    const idx = ADMIN_PROMOTIONS.findIndex((p) => p.id === id);
    if (idx !== -1) {
      ADMIN_PROMOTIONS[idx] = { ...ADMIN_PROMOTIONS[idx], ...updates };
      saveStateToDisk();
      return ADMIN_PROMOTIONS[idx];
    }
    return updates;
  },

  async togglePromotionActive(id: string) {
    const promo = ADMIN_PROMOTIONS.find((p) => p.id === id);
    const newActive = promo ? !promo.isActive : true;

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();
        await supabase
          .from("promotions")
          .update({ is_active: newActive })
          .or(`id.eq.${id},code.eq.${id}`);
      } catch (err) {
        console.warn("Supabase toggle promotion warning:", err);
      }
    }

    if (!promo) throw new Error("Code promo non trouvé");
    promo.isActive = newActive;
    saveStateToDisk();
    return promo;
  },

  async deletePromotion(id: string) {
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();
        await supabase
          .from("promotions")
          .delete()
          .or(`id.eq.${id},code.eq.${id}`);
      } catch (err) {
        console.warn("Supabase delete promotion warning:", err);
      }
    }

    const idx = ADMIN_PROMOTIONS.findIndex((p) => p.id === id);
    if (idx !== -1) {
      const [deleted] = ADMIN_PROMOTIONS.splice(idx, 1);
      saveStateToDisk();
      return deleted;
    }
    return { id };
  },

  // ---------------------------------------------------------------------------
  // ADMIN: ORDERS MANAGEMENT
  // ---------------------------------------------------------------------------
  async getAllAdminOrders() {
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (*)
          `)
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((o: any) => ({
            id: o.id,
            orderCode: o.order_code,
            customerName: o.customer_name,
            customerEmail: o.customer_email || "",
            customerPhone: o.customer_phone,
            altPhone: o.alt_phone || "",
            governorate: o.governorate,
            city: o.city,
            address: o.address,
            notes: o.delivery_notes || "",
            subtotal: Number(o.subtotal),
            shippingFee: Number(o.shipping_fee),
            total: Number(o.total),
            paymentMethod: o.payment_method === "cash_on_delivery" ? "COD" : o.payment_method,
            paymentStatus: o.payment_status,
            status: o.status,
            createdAt: o.created_at,
            items: (o.order_items || []).map((it: any) => ({
              id: it.id,
              productName: it.product_name,
              size: it.size,
              color: it.color,
              quantity: it.quantity,
              unitPrice: Number(it.unit_price),
              totalPrice: Number(it.total_price),
              imageUrl: it.image_url || "/images/editorial/03_the_silhouette.webp",
            })),
          }));
        }
      } catch (err) {
        console.warn("Supabase admin orders query failed, fallback to local:", err);
      }
    }

    loadStateFromDisk();
    return ADMIN_ORDERS;
  },

  async updateOrderStatus(orderId: string, status: string) {
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();
        const { data: currentOrder } = await supabase
          .from("orders")
          .select("id, order_code, status")
          .or(`id.eq.${orderId},order_code.eq.${orderId}`)
          .single();

        if (currentOrder) {
          const prevStatus = currentOrder.status;
          const { data: updated, error } = await supabase
            .from("orders")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", currentOrder.id)
            .select(`*, order_items (*)`)
            .single();

          if (!error && updated) {
            try {
              await supabase.from("order_status_history").insert({
                order_id: currentOrder.id,
                previous_status: prevStatus,
                new_status: status,
                actor_role: "ADMIN",
                note: `Statut mis à jour vers ${status}`,
              });
            } catch (histErr) {
              console.warn("Order status history insert warning:", histErr);
            }

            // Sync with local memory/disk as fallback
            loadStateFromDisk();
            const localOrd = ADMIN_ORDERS.find((o) => o.id === orderId || o.orderCode === orderId);
            if (localOrd) {
              localOrd.status = status;
              saveStateToDisk();
            }

            return {
              id: updated.id,
              orderCode: updated.order_code,
              customerName: updated.customer_name,
              customerEmail: updated.customer_email || "",
              customerPhone: updated.customer_phone,
              altPhone: updated.alt_phone || "",
              governorate: updated.governorate,
              city: updated.city,
              address: updated.address,
              notes: updated.delivery_notes || "",
              subtotal: Number(updated.subtotal),
              shippingFee: Number(updated.shipping_fee),
              total: Number(updated.total),
              paymentMethod: updated.payment_method === "cash_on_delivery" ? "COD" : updated.payment_method,
              paymentStatus: updated.payment_status,
              status: updated.status,
              createdAt: updated.created_at,
              items: (updated.order_items || []).map((it: any) => ({
                id: it.id,
                productName: it.product_name,
                size: it.size,
                color: it.color,
                quantity: it.quantity,
                unitPrice: Number(it.unit_price),
                totalPrice: Number(it.total_price),
                imageUrl: it.image_url || "/images/editorial/03_the_silhouette.webp",
              })),
            };
          }
        }
      } catch (err) {
        console.warn("Supabase order status update failed, fallback to local:", err);
      }
    }

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
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("returns")
          .select(`
            *,
            return_items (*)
          `)
          .order("created_at", { ascending: false });

        if (!error && data) {
          return data.map((r: any) => ({
            id: r.id,
            requestCode: r.request_code,
            orderId: r.order_id,
            orderCode: r.order_code,
            customerName: r.customer_name,
            customerPhone: r.customer_phone,
            customerEmail: r.customer_email || "",
            type: r.type,
            reason: r.reason,
            comments: r.comments || "",
            status: r.status,
            tagsIntactConfirmed: r.tags_intact_confirmed,
            inspectionNotes: r.inspection_notes || "",
            adminNotes: r.admin_notes || "",
            createdAt: r.created_at,
            items: (r.return_items || []).map((it: any) => ({
              id: it.id,
              productName: it.product_name,
              quantity: it.quantity,
              requestedExchangeSize: it.requested_exchange_size,
              requestedExchangeColor: it.requested_exchange_color,
              conditionStatus: it.condition_status,
            })),
          }));
        }
      } catch (err) {
        console.warn("Supabase admin returns query failed, fallback to local:", err);
      }
    }

    loadStateFromDisk();
    return ADMIN_RETURNS;
  },

  async updateReturnStatus(returnId: string, status: string, adminNotes?: string) {
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: currentReturn } = await supabase
          .from("returns")
          .select("id, request_code, status")
          .or(`id.eq.${returnId},request_code.eq.${returnId}`)
          .single();

        if (currentReturn) {
          const prevStatus = currentReturn.status;
          const updatePayload: any = { status, updated_at: new Date().toISOString() };
          if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;

          const { data: updated, error } = await supabase
            .from("returns")
            .update(updatePayload)
            .eq("id", currentReturn.id)
            .select(`*, return_items (*)`)
            .single();

          if (!error && updated) {
            try {
              await supabase.from("return_status_history").insert({
                return_id: currentReturn.id,
                previous_status: prevStatus,
                new_status: status,
                actor_role: "ADMIN",
                note: adminNotes || `Statut de retour mis à jour vers ${status}`,
              });
            } catch (histErr) {
              console.warn("Return status history warning:", histErr);
            }

            if (status === "recu" || status === "complete") {
              try {
                await supabase.rpc("process_return_restock" as any, {
                  p_return_id: currentReturn.id,
                });
              } catch (restockErr) {
                console.warn("process_return_restock RPC warning:", restockErr);
              }
            }

            loadStateFromDisk();
            const localRet = ADMIN_RETURNS.find((r) => r.id === returnId || r.requestCode === returnId);
            if (localRet) {
              localRet.status = status as any;
              if (adminNotes !== undefined) localRet.adminNotes = adminNotes;
              saveStateToDisk();
            }

            return {
              id: updated.id,
              requestCode: updated.request_code,
              orderId: updated.order_id,
              orderCode: updated.order_code,
              customerName: updated.customer_name,
              customerPhone: updated.customer_phone,
              customerEmail: updated.customer_email || "",
              type: updated.type,
              reason: updated.reason,
              comments: updated.comments || "",
              status: updated.status,
              tagsIntactConfirmed: updated.tags_intact_confirmed,
              inspectionNotes: updated.inspection_notes || "",
              adminNotes: updated.admin_notes || "",
              createdAt: updated.created_at,
              items: (updated.return_items || []).map((it: any) => ({
                id: it.id,
                productName: it.product_name,
                quantity: it.quantity,
                requestedExchangeSize: it.requested_exchange_size,
                conditionStatus: it.condition_status,
              })),
            };
          }
        }
      } catch (err) {
        console.warn("Supabase return status update failed, fallback to local:", err);
      }
    }

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
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data, error } = await supabase
          .from("homepage_sections")
          .select(`
            *,
            homepage_content (*)
          `)
          .eq("is_enabled", true)
          .order("display_order", { ascending: true });

        if (!error && data && data.length > 0) {
          return data.map((sec: any) => {
            const content = sec.homepage_content?.[0] || {};
            const meta = content.metadata || {};
            return {
              id: sec.id,
              key: sec.section_key,
              badge: meta.badge || sec.title || "",
              title: sec.title || "",
              subtitle: sec.subtitle || "",
              description: content.content_value || "",
              ctaText: meta.ctaText || "",
              ctaLink: meta.ctaLink || "",
              secondaryCtaText: meta.secondaryCtaText || "",
              secondaryCtaLink: meta.secondaryCtaLink || "",
              desktopImage: content.desktop_image_url || "",
              mobileImage: content.mobile_image_url || content.desktop_image_url || "",
              desktopImageTransform: meta.desktopImageTransform,
              mobileImageTransform: meta.mobileImageTransform,
              selectedProductSlugs: meta.selectedProductSlugs || [],
              order: sec.display_order,
              isEnabled: sec.is_enabled,
            };
          });
        }
      } catch (err) {
        console.warn("Supabase published homepage query failed, fallback:", err);
      }
    }

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

      if (isLiveSupabaseConfigured()) {
        try {
          const supabase = createAdminSupabaseClient();
          for (const s of sections) {
            const { data: upSec } = await supabase
              .from("homepage_sections")
              .upsert({
                section_key: s.key,
                title: s.title,
                subtitle: s.subtitle,
                display_order: s.order,
                is_enabled: s.isEnabled ?? true,
                updated_at: new Date().toISOString(),
              }, { onConflict: "section_key" })
              .select()
              .single();

            if (upSec) {
              await supabase
                .from("homepage_content")
                .upsert({
                  section_id: upSec.id,
                  content_key: "main_content",
                  content_value: s.description || "",
                  desktop_image_url: s.desktopImage || "",
                  mobile_image_url: s.mobileImage || s.desktopImage || "",
                  metadata: {
                    badge: s.badge || "",
                    ctaText: s.ctaText || "",
                    ctaLink: s.ctaLink || "",
                    secondaryCtaText: s.secondaryCtaText || "",
                    secondaryCtaLink: s.secondaryCtaLink || "",
                    desktopImageTransform: s.desktopImageTransform,
                    mobileImageTransform: s.mobileImageTransform,
                    selectedProductSlugs: s.selectedProductSlugs || [],
                  },
                  updated_at: new Date().toISOString(),
                }, { onConflict: "section_id,content_key" });
            }
          }
        } catch (err) {
          console.warn("Supabase homepage auto-publish warning:", err);
        }
      }
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

    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();
        for (const s of HOMEPAGE_PUBLISHED_SECTIONS) {
          const { data: upSec } = await supabase
            .from("homepage_sections")
            .upsert({
              section_key: s.key,
              title: s.title,
              subtitle: s.subtitle,
              display_order: s.order,
              is_enabled: s.isEnabled ?? true,
              updated_at: new Date().toISOString(),
            }, { onConflict: "section_key" })
            .select()
            .single();

          if (upSec) {
            await supabase
              .from("homepage_content")
              .upsert({
                section_id: upSec.id,
                content_key: "main_content",
                content_value: s.description || "",
                desktop_image_url: s.desktopImage || "",
                mobile_image_url: s.mobileImage || s.desktopImage || "",
                metadata: {
                  badge: s.badge || "",
                  ctaText: s.ctaText || "",
                  ctaLink: s.ctaLink || "",
                  secondaryCtaText: s.secondaryCtaText || "",
                  secondaryCtaLink: s.secondaryCtaLink || "",
                  desktopImageTransform: s.desktopImageTransform,
                  mobileImageTransform: s.mobileImageTransform,
                  selectedProductSlugs: s.selectedProductSlugs || [],
                },
                updated_at: new Date().toISOString(),
              }, { onConflict: "section_id,content_key" });
          }
        }
      } catch (err) {
        console.warn("Supabase homepage publish warning:", err);
      }
    }

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
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();
        const { data, error } = await supabase
          .from("media")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((m: any) => ({
            id: m.id,
            name: m.original_name || m.filename,
            url: m.public_url,
            dimensions: m.width && m.height ? `${m.width} x ${m.height}` : "1200 x 1600",
            size: m.size_bytes ? `${Math.round(m.size_bytes / 1024)} KB` : "450 KB",
            mimeType: m.mime_type || "image/webp",
            createdAt: m.created_at ? m.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            transform: m.transform_metadata || undefined,
          }));
        }
      } catch (err) {
        console.warn("Supabase media query failed, fallback to local:", err);
      }
    }
    return ADMIN_MEDIA;
  },

  async uploadMedia(asset: any) {
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();
        const { data: inserted } = await supabase
          .from("media")
          .insert({
            filename: asset.name || `image-${Date.now()}.webp`,
            original_name: asset.name || `image-${Date.now()}.webp`,
            mime_type: asset.mimeType || "image/jpeg",
            size_bytes: typeof asset.size === "number" ? asset.size : 102400,
            public_url: asset.url,
            bucket_name: "media",
            transform_metadata: asset.transform || {},
          })
          .select()
          .single();

        if (inserted) {
          const newMedia = {
            id: inserted.id,
            name: inserted.original_name || inserted.filename,
            url: inserted.public_url,
            dimensions: asset.dimensions || "1200 x 1600",
            size: asset.size || "450 KB",
            mimeType: inserted.mime_type,
            createdAt: inserted.created_at ? inserted.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            transform: inserted.transform_metadata,
          };
          ADMIN_MEDIA.unshift(newMedia);
          saveStateToDisk();
          return newMedia;
        }
      } catch (err) {
        console.warn("Supabase upload media warning, fallback:", err);
      }
    }

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
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();
        await supabase
          .from("media")
          .update({ transform_metadata: transform as any })
          .or(`id.eq.${mediaId},public_url.eq.${mediaId}`);
      } catch (err) {
        console.warn("Supabase media transform update warning:", err);
      }
    }

    const asset = ADMIN_MEDIA.find((m) => m.id === mediaId || m.url === mediaId);
    if (asset) {
      asset.transform = transform;
    }

    // Propagate transform to all Homepage sections (draft and published) using this image
    const updateSectionTransforms = (secList: any[]) => {
      secList.forEach((s) => {
        if (s.desktopImage === asset?.url || s.image === asset?.url) {
          const dt = transform.desktop || transform;
          s.desktopImageTransform = { ...(s.desktopImageTransform || {}), ...transform, ...dt };
        }
        if (s.mobileImage === asset?.url) {
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
        if (p.primaryImage === asset?.url) {
          p.primaryImageTransform = { ...(p.primaryImageTransform || {}), ...transform };
        }
        if (p.secondaryImage === asset?.url) {
          p.secondaryImageTransform = { ...(p.secondaryImageTransform || {}), ...transform };
        }
      });
    };
    updateProductTransforms(ADMIN_PRODUCTS);

    saveStateToDisk();
    return asset || { id: mediaId, transform };
  },

  getImageTransform(url: string): ImageTransformMetadata | undefined {
    return ADMIN_MEDIA.find((m) => m.url === url)?.transform;
  },

  async deleteMedia(mediaId: string) {
    if (isLiveSupabaseConfigured()) {
      try {
        const supabase = createAdminSupabaseClient();
        await supabase
          .from("media")
          .delete()
          .or(`id.eq.${mediaId},public_url.eq.${mediaId}`);
      } catch (err) {
        console.warn("Supabase delete media warning:", err);
      }
    }

    const idx = ADMIN_MEDIA.findIndex((m) => m.id === mediaId || m.url === mediaId);
    if (idx !== -1) {
      const [deleted] = ADMIN_MEDIA.splice(idx, 1);
      saveStateToDisk();
      return deleted;
    }
    return { id: mediaId };
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

export const ADMIN_PRODUCTS: any[] = [];

export const ADMIN_COLLECTIONS: any[] = [];

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

