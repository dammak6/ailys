import { createServerSupabaseClient } from "../supabase/server";
import { createAdminSupabaseClient } from "../supabase/admin";
import {
  CATEGORIES,
  Product,
  Collection,
  HomepageSection,
  ImageTransformMetadata,
  DEFAULT_IMAGE_TRANSFORM,
} from "../data";

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
  const DEFAULT_SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZnlhdHFhdGdnaWZlZHF0Y3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTcwNzgsImV4cCI6MjEwNTU3MzA3OH0.Uo7z-jd2-cBVAlndWhTCfuOxRCpapPK2A7dEBBUqWf4";
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
  const primaryImgObj = images.find((i: any) => i.is_primary) || images[0];
  const primaryImg =
    primaryImgObj?.image_url ||
    "https://kafyatqatggifedqtctm.supabase.co/storage/v1/object/public/media/editorial/03_the_silhouette.webp";
  const secondaryImgObj = images.find((i: any) => !i.is_primary) || images[1];
  const secondaryImg =
    secondaryImgObj?.image_url ||
    primaryImg;
  const gallery = images.map((i: any) => i.image_url);

  let primaryImageTransform: ImageTransformMetadata | undefined = undefined;
  if (primaryImgObj?.crop_metadata && Object.keys(primaryImgObj.crop_metadata).length > 0) {
    primaryImageTransform = primaryImgObj.crop_metadata;
  } else if (primaryImgObj?.focal_point_x !== null && primaryImgObj?.focal_point_x !== undefined) {
    primaryImageTransform = {
      zoom: 1,
      rotate: 0,
      focalPoint: { x: Number(primaryImgObj.focal_point_x), y: Number(primaryImgObj.focal_point_y || 50) },
      objectPosition: `${primaryImgObj.focal_point_x}% ${primaryImgObj.focal_point_y || 50}%`,
      aspectRatio: "3:4",
    };
  }

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
    primaryImageTransform,
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

    const supabase = await getSupabaseAdminOrServerClient();
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

    return mapped;
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
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
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error(`Supabase getProductBySlug error for slug ${slug}:`, error);
      throw new Error(`Erreur Supabase: ${error.message}`);
    }

    if (!data) return null;

    return mapSupabaseProductRow(data);
  },

  // ---------------------------------------------------------------------------
  // COLLECTIONS (Supabase Single Source of Truth)
  // ---------------------------------------------------------------------------
  async getCollections(): Promise<Collection[]> {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }

    const supabase = await getSupabaseAdminOrServerClient();
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
  // ORDERS (Guest Checkout, Cash on Delivery only - Supabase execute_checkout RPC)
  // ---------------------------------------------------------------------------
  async createOrder(params: CreateOrderParams) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase n'est pas configuré. Impossible d'enregistrer la commande.");
    }

    const supabase = await getSupabaseAdminOrServerClient();
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
      console.error("Supabase checkout error:", rpcErr);
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
  },

  // ---------------------------------------------------------------------------
  // ORDER LOOKUP FOR RETURNS & EXCHANGES (Supabase track_order RPC)
  // ---------------------------------------------------------------------------
  async lookupOrderForReturn(orderCode: string, phone: string) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase n'est pas configuré.");
    }

    const cleanCode = orderCode.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\s+/g, "").replace(/\+216/g, "");

    const supabase = await getSupabaseAdminOrServerClient();
    const { data, error } = await (supabase.rpc as any)("track_order", {
      p_order_code: cleanCode,
      p_phone: cleanPhone,
    });

    if (error) {
      console.error("Supabase track_order error:", error);
      throw new Error(`Erreur Supabase suivi commande: ${error.message}`);
    }

    if (!data || !data.found) {
      return null;
    }

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
        image: it.imageUrl || "https://kafyatqatggifedqtctm.supabase.co/storage/v1/object/public/media/editorial/03_the_silhouette.webp",
      })),
    };
  },

  // ---------------------------------------------------------------------------
  // CREATE RETURN OR EXCHANGE REQUEST (Supabase submit_return_request RPC)
  // ---------------------------------------------------------------------------
  async createReturnRequest(params: CreateReturnParams) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase n'est pas configuré.");
    }

    const supabase = await getSupabaseAdminOrServerClient();
    const { data: rpcRes, error: rpcErr } = await (supabase.rpc as any)("submit_return_request", {
      p_order_code: params.orderCode,
      p_phone: params.customerPhone,
      p_type: params.type || "retour",
      p_reason: params.reason || "Autre",
      p_items: params.items,
      p_comments: params.comments || null,
      p_tags_intact: params.tagsIntactConfirmed ?? true,
    });

    if (rpcErr) {
      console.error("Supabase submit_return_request error:", rpcErr);
      throw new Error(`Erreur Supabase demande de retour: ${rpcErr.message}`);
    }

    const res = rpcRes as any;
    if (!res || !res.success) {
      throw new Error(res?.error || "La demande de retour n'a pas pu être enregistrée.");
    }

    return {
      success: true,
      requestCode: res.requestCode || res.returnCode,
      returnCode: res.returnCode || res.requestCode,
      returnId: res.returnId,
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
      hero_desktop_image: data.heroDesktopImage || "https://kafyatqatggifedqtctm.supabase.co/storage/v1/object/public/media/editorial/08_mediterranean_street.webp",
      hero_mobile_image: data.heroMobileImage || data.heroDesktopImage || "https://kafyatqatggifedqtctm.supabase.co/storage/v1/object/public/media/editorial/03_the_silhouette.webp",
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
  // ADMIN: PROMOTIONS CRUD (Supabase Single Source of Truth)
  // ---------------------------------------------------------------------------
  async getAllAdminPromotions() {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase getAllAdminPromotions error:", error);
      throw new Error(`Erreur Supabase promotions: ${error.message}`);
    }

    if (!data) return [];

    return data.map((p: any) => ({
      id: p.id,
      code: p.code,
      description: p.description || "",
      discountType: p.discount_type,
      discountValue: Number(p.discount_value),
      minOrderAmount: Number(p.min_order_amount || 0),
      startDate: p.start_date ? p.start_date.split("T")[0] : "",
      endDate: p.end_date ? p.end_date.split("T")[0] : "",
      isActive: Boolean(p.is_active),
      usageCount: 0,
    }));
  },

  async createPromotion(data: any) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const code = data.code.toUpperCase().trim();
    const supabase = await getSupabaseAdminOrServerClient();
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

    if (error) {
      console.error("Supabase createPromotion error:", error);
      throw new Error(`Erreur Supabase création code promo: ${error.message}`);
    }

    return {
      id: inserted.id,
      code: inserted.code,
      description: inserted.description || "",
      discountType: inserted.discount_type,
      discountValue: Number(inserted.discount_value),
      minOrderAmount: Number(inserted.min_order_amount || 0),
      startDate: inserted.start_date ? inserted.start_date.split("T")[0] : "",
      endDate: inserted.end_date ? inserted.end_date.split("T")[0] : "",
      isActive: Boolean(inserted.is_active),
      usageCount: 0,
    };
  },

  async updatePromotion(id: string, updates: any) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const payload: any = {};
    if (updates.code) payload.code = updates.code.toUpperCase().trim();
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.discountType) payload.discount_type = updates.discountType;
    if (updates.discountValue !== undefined) payload.discount_value = Number(updates.discountValue);
    if (updates.minOrderAmount !== undefined) payload.min_order_amount = Number(updates.minOrderAmount);
    if (updates.isActive !== undefined) payload.is_active = updates.isActive;
    if (updates.startDate) payload.start_date = new Date(updates.startDate).toISOString();
    if (updates.endDate) payload.end_date = new Date(updates.endDate).toISOString();

    const { data, error } = await supabase
      .from("promotions")
      .update(payload)
      .or(`id.eq.${id},code.eq.${id}`)
      .select()
      .single();

    if (error) {
      console.error("Supabase updatePromotion error:", error);
      throw new Error(`Erreur Supabase mise à jour promotion: ${error.message}`);
    }

    return {
      id: data.id,
      code: data.code,
      description: data.description || "",
      discountType: data.discount_type,
      discountValue: Number(data.discount_value),
      minOrderAmount: Number(data.min_order_amount || 0),
      startDate: data.start_date ? data.start_date.split("T")[0] : "",
      endDate: data.end_date ? data.end_date.split("T")[0] : "",
      isActive: Boolean(data.is_active),
      usageCount: 0,
    };
  },

  async togglePromotionActive(id: string) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { data: existing, error: fetchErr } = await supabase
      .from("promotions")
      .select("id, is_active")
      .or(`id.eq.${id},code.eq.${id}`)
      .single();

    if (fetchErr || !existing) {
      throw new Error("Code promo non trouvé dans Supabase");
    }

    const newActive = !existing.is_active;
    const { data, error } = await supabase
      .from("promotions")
      .update({ is_active: newActive })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erreur Supabase toggle promotion: ${error.message}`);
    }

    return {
      id: data.id,
      code: data.code,
      description: data.description || "",
      discountType: data.discount_type,
      discountValue: Number(data.discount_value),
      minOrderAmount: Number(data.min_order_amount || 0),
      startDate: data.start_date ? data.start_date.split("T")[0] : "",
      endDate: data.end_date ? data.end_date.split("T")[0] : "",
      isActive: Boolean(data.is_active),
      usageCount: 0,
    };
  },

  async deletePromotion(id: string) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { error } = await supabase
      .from("promotions")
      .delete()
      .or(`id.eq.${id},code.eq.${id}`);

    if (error) {
      console.error("Supabase deletePromotion error:", error);
      throw new Error(`Erreur Supabase suppression promotion: ${error.message}`);
    }

    return { id };
  },

  // ---------------------------------------------------------------------------
  // ADMIN: ORDERS MANAGEMENT (Supabase Single Source of Truth)
  // ---------------------------------------------------------------------------
  async getAllAdminOrders() {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase getAllAdminOrders error:", error);
      throw new Error(`Erreur Supabase commandes Admin: ${error.message}`);
    }

    if (!data) return [];

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
        imageUrl: it.image_url || "https://kafyatqatggifedqtctm.supabase.co/storage/v1/object/public/media/editorial/03_the_silhouette.webp",
      })),
    }));
  },

  async updateOrderStatus(orderId: string, status: string) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { data: currentOrder, error: findErr } = await supabase
      .from("orders")
      .select("id, order_code, status")
      .or(`id.eq.${orderId},order_code.eq.${orderId}`)
      .single();

    if (findErr || !currentOrder) {
      throw new Error("Commande non trouvée dans Supabase");
    }

    const prevStatus = currentOrder.status;
    const { data: updated, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", currentOrder.id)
      .select(`*, order_items (*)`)
      .single();

    if (error || !updated) {
      console.error("Supabase updateOrderStatus error:", error);
      throw new Error(`Erreur Supabase mise à jour statut commande: ${error?.message}`);
    }

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
        imageUrl: it.image_url || "https://kafyatqatggifedqtctm.supabase.co/storage/v1/object/public/media/editorial/03_the_silhouette.webp",
      })),
    };
  },

  async deleteOrder(orderId: string) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();

    // 1. Fetch order details to ensure it exists and get identifiers
    const { data: order, error: findErr } = await supabase
      .from("orders")
      .select("id, order_code")
      .or(`id.eq.${orderId},order_code.eq.${orderId}`)
      .maybeSingle();

    if (findErr) {
      console.error("Supabase deleteOrder find error:", findErr);
      throw new Error(`Erreur recherche commande: ${findErr.message}`);
    }

    if (!order) {
      throw new Error("Commande non trouvée dans Supabase");
    }

    // 2. Fetch associated documents (e.g. invoice PDFs) to clean up storage if present
    const { data: documents } = await supabase
      .from("order_documents")
      .select("storage_path")
      .eq("order_id", order.id);

    // 3. Delete order from orders table
    // Database foreign key CASCADE rules automatically handle:
    // - order_items
    // - order_status_history
    // - order_edit_history
    // - promotion_usages
    // - order_documents
    // Database foreign key SET NULL rules automatically handle:
    // - returns.order_id
    const { error: deleteErr } = await supabase
      .from("orders")
      .delete()
      .eq("id", order.id);

    if (deleteErr) {
      console.error("Supabase deleteOrder error:", deleteErr);
      throw new Error(`Erreur Supabase suppression commande: ${deleteErr.message}`);
    }

    // 4. Safely clean up invoice PDF file(s) from Supabase Storage if any
    if (documents && documents.length > 0) {
      const paths = documents
        .map((d: any) => d.storage_path)
        .filter((p: string | null) => Boolean(p));

      if (paths.length > 0) {
        try {
          await supabase.storage.from("invoices").remove(paths);
        } catch (storageErr) {
          console.warn("Could not delete invoice file(s) from Supabase Storage:", storageErr);
        }
      }
    }

    return {
      success: true,
      id: order.id,
      orderCode: order.order_code,
    };
  },

  // ---------------------------------------------------------------------------
  // ADMIN: RETURNS & EXCHANGES MANAGEMENT (Supabase Single Source of Truth)
  // ---------------------------------------------------------------------------
  async getAllAdminReturns() {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { data, error } = await supabase
      .from("returns")
      .select(`
        *,
        return_items (*)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase getAllAdminReturns error:", error);
      throw new Error(`Erreur Supabase retours Admin: ${error.message}`);
    }

    if (!data) return [];

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
      tagsIntactConfirmed: Boolean(r.tags_intact_confirmed),
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
  },

  async updateReturnStatus(returnId: string, status: string, adminNotes?: string) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { data: currentReturn, error: findErr } = await supabase
      .from("returns")
      .select("id, request_code, status")
      .or(`id.eq.${returnId},request_code.eq.${returnId}`)
      .single();

    if (findErr || !currentReturn) {
      throw new Error("Demande de retour non trouvée dans Supabase");
    }

    const prevStatus = currentReturn.status;
    const updatePayload: any = { status, updated_at: new Date().toISOString() };
    if (adminNotes !== undefined) updatePayload.admin_notes = adminNotes;

    const { data: updated, error } = await supabase
      .from("returns")
      .update(updatePayload)
      .eq("id", currentReturn.id)
      .select(`*, return_items (*)`)
      .single();

    if (error || !updated) {
      throw new Error(`Erreur Supabase mise à jour statut retour: ${error?.message}`);
    }

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
        await (supabase.rpc as any)("process_return_restock", {
          p_return_id: currentReturn.id,
        });
      } catch (restockErr) {
        console.warn("process_return_restock RPC warning:", restockErr);
      }
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
      tagsIntactConfirmed: Boolean(updated.tags_intact_confirmed),
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
  },

  // ---------------------------------------------------------------------------
  // HOMEPAGE CMS (Supabase Single Source of Truth)
  // ---------------------------------------------------------------------------
  async getPublishedHomepage() {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { data, error } = await supabase
      .from("homepage_sections")
      .select(`
        *,
        homepage_content (*)
      `)
      .eq("is_enabled", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Supabase getPublishedHomepage error:", error);
      throw new Error(`Erreur Supabase page d'accueil: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

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
  },

  async getDraftHomepage(): Promise<{ sections: any[]; meta: any }> {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();

    // Query site_settings for draft state
    const { data: draftRow } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "homepage_draft")
      .maybeSingle();

    const { data: metaRow } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "homepage_cms_meta")
      .maybeSingle();

    if (draftRow && Array.isArray(draftRow.value) && draftRow.value.length > 0) {
      const rawSections = (draftRow.value as any[]).map((s: any) => ({ ...s }));
      return {
        sections: rawSections.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
        meta: metaRow?.value || {
          lastPublishedAt: new Date().toISOString(),
          hasUnpublishedChanges: false,
        },
      };
    }

    // If no draft in site_settings yet, load from published homepage_sections
    const published = await this.getPublishedHomepage();
    return {
      sections: published,
      meta: metaRow?.value || {
        lastPublishedAt: new Date().toISOString(),
        hasUnpublishedChanges: false,
      },
    };
  },

  async saveHomepageDraft(sections: any[], autoPublish: boolean = true) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const orderedSections = sections.map((s: any, idx: number) => ({
      ...s,
      order: idx + 1,
    }));

    const now = new Date().toISOString();
    const metaPayload = {
      lastSavedAt: now,
      lastPublishedAt: autoPublish ? now : undefined,
      hasUnpublishedChanges: !autoPublish,
    };

    // Save draft and meta into site_settings
    await supabase.from("site_settings").upsert([
      {
        key: "homepage_draft",
        value: orderedSections,
        is_public: false,
        description: "Homepage CMS unpublished draft state",
        updated_at: now,
      },
      {
        key: "homepage_cms_meta",
        value: metaPayload,
        is_public: false,
        description: "Homepage CMS publication metadata",
        updated_at: now,
      },
    ], { onConflict: "key" });

    let publishedSections = orderedSections;
    if (autoPublish) {
      // Sync into homepage_sections & homepage_content
      for (const s of orderedSections) {
        const { data: upSec, error: secErr } = await supabase
          .from("homepage_sections")
          .upsert({
            section_key: s.key,
            title: s.title,
            subtitle: s.subtitle,
            display_order: s.order,
            is_enabled: s.isEnabled ?? true,
            updated_at: now,
          }, { onConflict: "section_key" })
          .select()
          .single();

        if (secErr) {
          console.error("Supabase homepage_sections upsert error:", secErr);
          throw new Error(`Erreur publication section ${s.key}: ${secErr.message}`);
        }

        if (upSec) {
          const { error: cntErr } = await supabase
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
              updated_at: now,
            }, { onConflict: "section_id,content_key" });

          if (cntErr) {
            console.error("Supabase homepage_content upsert error:", cntErr);
            throw new Error(`Erreur publication contenu ${s.key}: ${cntErr.message}`);
          }
        }
      }
    }

    return {
      success: true,
      sections: orderedSections,
      publishedSections,
      meta: metaPayload,
    };
  },

  async updateHomepageSection(sectionId: string, updates: any) {
    const draft = await this.getDraftHomepage();
    const section = (draft.sections as any[]).find((s: any) => s.id === sectionId || s.key === sectionId);
    if (!section) throw new Error("Section non trouvée");
    Object.assign(section, updates);
    await this.saveHomepageDraft(draft.sections, false);
    return section;
  },

  async reorderHomepageSections(orderedIds: string[]) {
    const draft = await this.getDraftHomepage();
    const sections = draft.sections as any[];
    orderedIds.forEach((id, index) => {
      const sec = sections.find((s: any) => s.id === id || s.key === id);
      if (sec) sec.order = index + 1;
    });
    sections.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    await this.saveHomepageDraft(sections, false);
    return sections;
  },

  async publishHomepageChanges() {
    const draft = await this.getDraftHomepage();
    const result = await this.saveHomepageDraft(draft.sections, true);
    return {
      success: true,
      publishedAt: result.meta.lastPublishedAt,
      sections: result.publishedSections,
    };
  },

  async discardHomepageDraft() {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const published = await this.getPublishedHomepage();
    const now = new Date().toISOString();
    const metaPayload = {
      lastSavedAt: now,
      lastPublishedAt: now,
      hasUnpublishedChanges: false,
    };

    await supabase.from("site_settings").upsert([
      {
        key: "homepage_draft",
        value: published,
        is_public: false,
        description: "Homepage CMS unpublished draft state",
        updated_at: now,
      },
      {
        key: "homepage_cms_meta",
        value: metaPayload,
        is_public: false,
        description: "Homepage CMS publication metadata",
        updated_at: now,
      },
    ], { onConflict: "key" });

    return {
      success: true,
      sections: published,
      meta: metaPayload,
    };
  },

  // ---------------------------------------------------------------------------
  // ADMIN: MEDIA LIBRARY (Supabase Single Source of Truth)
  // ---------------------------------------------------------------------------
  async getAllMedia() {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { data, error } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase getAllMedia error:", error);
      throw new Error(`Erreur Supabase médiathèque: ${error.message}`);
    }

    if (!data) return [];

    return data.map((m: any) => ({
      id: m.id,
      name: m.original_name || m.filename,
      displayName: m.display_name || m.original_name || m.filename,
      filename: m.filename || m.original_name,
      usageTag: m.usage_tag || "Non assigné",
      usageLocations: m.usage_locations || [],
      url: m.public_url,
      dimensions: m.width && m.height ? `${m.width} x ${m.height}` : "1200 x 1600",
      size: m.size_bytes ? `${Math.round(m.size_bytes / 1024)} KB` : "450 KB",
      mimeType: m.mime_type || "image/webp",
      createdAt: m.created_at ? m.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
      transform: m.transform_metadata || undefined,
    }));
  },

  async uploadMedia(asset: any) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const filename = asset.name || `image-${Date.now()}.webp`;
    const displayName = asset.displayName || asset.name || filename;
    const usageTag = asset.usageTag || "Non assigné";
    const usageLocations = asset.usageLocations || [];
    const { data: inserted, error } = await supabase
      .from("media")
      .insert({
        filename,
        original_name: asset.name || filename,
        display_name: displayName,
        usage_tag: usageTag,
        usage_locations: usageLocations,
        mime_type: asset.mimeType || "image/jpeg",
        size_bytes: typeof asset.size === "number" ? asset.size : 102400,
        public_url: asset.url,
        bucket_name: "media",
        transform_metadata: asset.transform || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase uploadMedia error:", error);
      throw new Error(`Erreur Supabase ajout média: ${error.message}`);
    }

    return {
      id: inserted.id,
      name: inserted.original_name || inserted.filename,
      displayName: inserted.display_name || inserted.original_name || inserted.filename,
      filename: inserted.filename || inserted.original_name,
      usageTag: inserted.usage_tag || "Non assigné",
      usageLocations: inserted.usage_locations || [],
      url: inserted.public_url,
      dimensions: asset.dimensions || "1200 x 1600",
      size: asset.size || "450 KB",
      mimeType: inserted.mime_type,
      createdAt: inserted.created_at ? inserted.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
      transform: inserted.transform_metadata,
    };
  },

  async updateMediaDetails(
    mediaId: string,
    updates: { displayName?: string; usageTag?: string; transform?: ImageTransformMetadata }
  ) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const dbPayload: any = {};
    if (updates.displayName !== undefined) {
      dbPayload.display_name = updates.displayName;
    }
    if (updates.usageTag !== undefined) {
      dbPayload.usage_tag = updates.usageTag;
    }
    if (updates.transform !== undefined) {
      dbPayload.transform_metadata = updates.transform;
    }

    const { data, error } = await supabase
      .from("media")
      .update(dbPayload)
      .or(`id.eq.${mediaId},public_url.eq.${mediaId}`)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Supabase updateMediaDetails error:", error);
      throw new Error(`Erreur Supabase mise à jour média: ${error.message}`);
    }

    return {
      id: mediaId,
      displayName: data?.display_name,
      usageTag: data?.usage_tag,
      transform: data?.transform_metadata,
    };
  },

  async updateMediaTransform(mediaId: string, transform: ImageTransformMetadata) {
    return this.updateMediaDetails(mediaId, { transform });
  },

  getImageTransform(_url: string): ImageTransformMetadata | undefined {
    return undefined;
  },

  async deleteMedia(mediaId: string) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();

    // 1. Fetch media record to inspect url
    const { data: mediaRow } = await supabase
      .from("media")
      .select("id, public_url, bucket_name")
      .or(`id.eq.${mediaId},public_url.eq.${mediaId}`)
      .single();

    if (!mediaRow) {
      return { id: mediaId };
    }

    const publicUrl = mediaRow.public_url;

    // 2. Check if the media is currently referenced in product_images
    if (publicUrl) {
      const { data: referencedProduct } = await supabase
        .from("product_images")
        .select("id, product_id")
        .eq("image_url", publicUrl)
        .limit(1);

      if (referencedProduct && referencedProduct.length > 0) {
        throw new Error("Impossible de supprimer cette image : elle est actuellement utilisée par un ou plusieurs produits.");
      }

      // Check collections
      const { data: referencedCollection } = await supabase
        .from("collections")
        .select("id, title")
        .or(`hero_desktop_image.eq.${publicUrl},hero_mobile_image.eq.${publicUrl}`)
        .limit(1);

      if (referencedCollection && referencedCollection.length > 0) {
        throw new Error("Impossible de supprimer cette image : elle est actuellement utilisée par une collection.");
      }
    }

    // 3. Delete from media table
    const { error: dbError } = await supabase
      .from("media")
      .delete()
      .eq("id", mediaRow.id);

    if (dbError) {
      console.error("Supabase deleteMedia error:", dbError);
      throw new Error(`Erreur Supabase suppression média: ${dbError.message}`);
    }

    // 4. Delete from Supabase Storage if publicUrl is a storage URL
    if (publicUrl && publicUrl.includes("/object/public/media/")) {
      const storagePath = publicUrl.split("/object/public/media/")[1];
      if (storagePath) {
        const { error: storageError } = await supabase.storage
          .from("media")
          .remove([storagePath]);
        if (storageError) {
          console.warn("Could not delete file from Supabase Storage:", storageError.message);
        }
      }
    }

    return { id: mediaId };
  },

  // ---------------------------------------------------------------------------
  // ADMIN: STORE SETTINGS (Supabase Single Source of Truth - site_settings)
  // ---------------------------------------------------------------------------
  async getSiteSettings() {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error) {
      console.error("Supabase getSiteSettings error:", error);
      throw new Error(`Erreur Supabase paramètres: ${error.message}`);
    }

    const settingsMap = new Map<string, any>();
    (data || []).forEach((row: any) => settingsMap.set(row.key, row.value));

    const brand = settingsMap.get("brand_info") || {};
    const contact = settingsMap.get("contact_info") || {};
    const shipping = settingsMap.get("shipping_rules") || {};
    const announcement = settingsMap.get("announcement_bar") || {};

    return {
      brandName: brand.name || "AÏLYS",
      brandTagline: brand.tagline || "",
      atelierAddress: brand.atelierAddress || "",
      contactPhone: contact.phone || "",
      contactWhatsApp: contact.whatsapp || "",
      contactEmail: contact.email || "",
      freeShippingThreshold: Number(shipping.freeShippingThreshold ?? 200),
      standardShippingFee: Number(shipping.standardShippingFee ?? 7),
      deliveryDelayTunis: shipping.delayTunis || "24h - 48h",
      deliveryDelayRegions: shipping.delayRegions || "24h - 48h",
      announcementBarMessage: announcement.message || "",
      announcementBarActive: announcement.active ?? true,
    };
  },

  async updateSiteSettings(updates: any) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();

    // 1. Fetch current settings from Supabase
    const { data: currentRows, error: fetchErr } = await supabase
      .from("site_settings")
      .select("key, value");

    if (fetchErr) {
      console.error("Supabase updateSiteSettings fetch error:", fetchErr);
      throw new Error(`Erreur lecture paramètres: ${fetchErr.message}`);
    }

    const settingsMap = new Map<string, any>();
    (currentRows || []).forEach((row: any) => settingsMap.set(row.key, row.value));

    const brand = { ...(settingsMap.get("brand_info") || {}) };
    const contact = { ...(settingsMap.get("contact_info") || {}) };
    const shipping = { ...(settingsMap.get("shipping_rules") || {}) };
    const announcement = { ...(settingsMap.get("announcement_bar") || {}) };

    if (updates.brandName !== undefined) brand.name = updates.brandName;
    if (updates.brandTagline !== undefined) brand.tagline = updates.brandTagline;
    if (updates.atelierAddress !== undefined) brand.atelierAddress = updates.atelierAddress;

    if (updates.contactPhone !== undefined) contact.phone = updates.contactPhone;
    if (updates.contactWhatsApp !== undefined) contact.whatsapp = updates.contactWhatsApp;
    if (updates.contactEmail !== undefined) contact.email = updates.contactEmail;

    if (updates.freeShippingThreshold !== undefined) shipping.freeShippingThreshold = Number(updates.freeShippingThreshold);
    if (updates.standardShippingFee !== undefined) shipping.standardShippingFee = Number(updates.standardShippingFee);
    if (updates.deliveryDelayTunis !== undefined) shipping.delayTunis = updates.deliveryDelayTunis;
    if (updates.deliveryDelayRegions !== undefined) shipping.delayRegions = updates.deliveryDelayRegions;

    if (updates.announcementBarMessage !== undefined) announcement.message = updates.announcementBarMessage;
    if (updates.announcementBarActive !== undefined) announcement.active = Boolean(updates.announcementBarActive);

    const now = new Date().toISOString();
    const rowsToUpsert = [
      { key: "brand_info", value: brand, is_public: true, description: "Brand identification", updated_at: now },
      { key: "contact_info", value: contact, is_public: true, description: "Customer concierge channels", updated_at: now },
      { key: "shipping_rules", value: shipping, is_public: true, description: "Shipping fee calculation parameters", updated_at: now },
      { key: "announcement_bar", value: announcement, is_public: true, description: "Header alert banner", updated_at: now },
    ];

    const { error: upsertErr } = await supabase
      .from("site_settings")
      .upsert(rowsToUpsert, { onConflict: "key" });

    if (upsertErr) {
      console.error("Supabase updateSiteSettings upsert error:", upsertErr);
      throw new Error(`Erreur enregistrement paramètres: ${upsertErr.message}`);
    }

    return {
      brandName: brand.name || "AÏLYS",
      brandTagline: brand.tagline || "",
      atelierAddress: brand.atelierAddress || "",
      contactPhone: contact.phone || "",
      contactWhatsApp: contact.whatsapp || "",
      contactEmail: contact.email || "",
      freeShippingThreshold: Number(shipping.freeShippingThreshold ?? 200),
      standardShippingFee: Number(shipping.standardShippingFee ?? 7),
      deliveryDelayTunis: shipping.delayTunis || "24h - 48h",
      deliveryDelayRegions: shipping.delayRegions || "24h - 48h",
      announcementBarMessage: announcement.message || "",
      announcementBarActive: announcement.active ?? true,
    };
  },

  // ---------------------------------------------------------------------------
  // GLOBAL SAVE & PERSISTENCE (Supabase Single Source of Truth)
  // ---------------------------------------------------------------------------
  async saveAll(activeData?: {
    settings?: any;
    homepageSections?: any[];
    publishHomepage?: boolean;
  }) {
    if (!isLiveSupabaseConfigured()) {
      throw new Error("Supabase is not configured.");
    }
    const supabase = await getSupabaseAdminOrServerClient();

    if (activeData?.settings) {
      await this.updateSiteSettings(activeData.settings);
    }

    if (Array.isArray(activeData?.homepageSections) && activeData.homepageSections.length > 0) {
      await this.saveHomepageDraft(
        activeData.homepageSections,
        activeData?.publishHomepage !== false
      );
    }

    const [promosRes, ordersRes, returnsRes, mediaRes] = await Promise.all([
      supabase.from("promotions").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("returns").select("*", { count: "exact", head: true }),
      supabase.from("media").select("*", { count: "exact", head: true }),
    ]);

    const timestamp = new Date().toISOString();
    return {
      success: true,
      lastSavedAt: timestamp,
      stats: {
        promotions: promosRes.count || 0,
        orders: ordersRes.count || 0,
        returns: returnsRes.count || 0,
        media: mediaRes.count || 0,
      },
    };
  },

  async getLastSavedInfo() {
    if (!isLiveSupabaseConfigured()) {
      return {
        lastSavedAt: null,
        stats: { promotions: 0, orders: 0, returns: 0, media: 0 },
      };
    }
    const supabase = await getSupabaseAdminOrServerClient();

    const [settingsRow, promosRes, ordersRes, returnsRes, mediaRes] = await Promise.all([
      supabase.from("site_settings").select("updated_at").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("promotions").select("*", { count: "exact", head: true }),
      supabase.from("orders").select("*", { count: "exact", head: true }),
      supabase.from("returns").select("*", { count: "exact", head: true }),
      supabase.from("media").select("*", { count: "exact", head: true }),
    ]);

    return {
      lastSavedAt: settingsRow.data?.updated_at || new Date().toISOString(),
      stats: {
        promotions: promosRes.count || 0,
        orders: ordersRes.count || 0,
        returns: returnsRes.count || 0,
        media: mediaRes.count || 0,
      },
    };
  },
};
