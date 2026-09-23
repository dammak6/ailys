import fs from "fs";
import path from "path";
import crypto from "crypto";

// Deterministic UUID generator from any input string
function stringToUuid(str: string): string {
  const hash = crypto.createHash("md5").update("ailys-namespace-" + str).digest("hex");
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    "4" + hash.substring(13, 16), // version 4 style
    "8" + hash.substring(17, 20), // variant
    hash.substring(20, 32),
  ].join("-");
}

function escapeSql(val: any): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return val ? "true" : "false";
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function main() {
  const adminDataPath = path.join(process.cwd(), "data", "admin-data.json");
  if (!fs.existsSync(adminDataPath)) {
    console.error("admin-data.json not found at", adminDataPath);
    process.exit(1);
  }

  const raw = fs.readFileSync(adminDataPath, "utf-8");
  const data = JSON.parse(raw);

  const lines: string[] = [];
  lines.push("-- =============================================================================");
  lines.push("-- AÏLYS SEED DATA GENERATED FROM local admin-data.json");
  lines.push("-- Generated at: " + new Date().toISOString());
  lines.push("-- =============================================================================");
  lines.push("");

  // 1. Roles & Permissions are already in migration 20260923000000_init_ailys_schema.sql
  // Initial Super Admin user is authenticated via Supabase Auth
  lines.push("-- 1. INITIAL SUPER ADMIN USER");
  const superAdminId = stringToUuid("admin-direction-ailys");
  lines.push(`
INSERT INTO admin_users (id, email, full_name, role_id, is_active)
SELECT 
  '${superAdminId}',
  'direction@ailys.tn',
  'Direction AÏLYS',
  r.id,
  true
FROM roles r
WHERE r.name = 'SUPER_ADMIN'
ON CONFLICT (email) DO NOTHING;
`);

  // 2. Categories
  lines.push("-- 2. TAXONOMY: CATEGORIES");
  const categories = [
    { slug: "femme", name: "Femme", gender: "femme", tagline: "L'allure sport-chic au féminin", description: "Des tailleurs déstructurés en lin lavé aux robes fluides coupées pour la liberté de mouvement.", hero: "/images/campaign/hero-editorial-woman.jpg", order: 1 },
    { slug: "homme", name: "Homme", gender: "homme", tagline: "Coupes épurées & matières nobles", description: "L'équilibre précis entre confection tailleur et aisance sportive.", hero: "/images/campaign/man-sport-chic.jpg", order: 2 },
    { slug: "enfant", name: "Enfant", gender: "enfant", tagline: "L'élégance familiale partagée", description: "Conçus avec les mêmes étoffes nobles et finitions artisanales que les pièces adultes.", hero: "/images/campaign/girl-sport-chic.jpg", order: 3 },
  ];

  for (const cat of categories) {
    const catId = stringToUuid(`category-${cat.slug}`);
    lines.push(`
INSERT INTO categories (id, slug, name, gender, tagline, description, hero_image_url, display_order)
VALUES ('${catId}', ${escapeSql(cat.slug)}, ${escapeSql(cat.name)}, ${escapeSql(cat.gender)}, ${escapeSql(cat.tagline)}, ${escapeSql(cat.description)}, ${escapeSql(cat.hero)}, ${cat.order})
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, description = EXCLUDED.description;
`);
  }

  // 3. Sizes
  lines.push("-- 3. TAXONOMY: SIZES");
  const standardSizes = [
    { code: "F-36", name: "36 (XS)", gender: "femme", order: 1 },
    { code: "F-38", name: "38 (S)", gender: "femme", order: 2 },
    { code: "F-40", name: "40 (M)", gender: "femme", order: 3 },
    { code: "F-42", name: "42 (L)", gender: "femme", order: 4 },
    { code: "F-44", name: "44 (XL)", gender: "femme", order: 5 },
    { code: "H-S", name: "S", gender: "homme", order: 6 },
    { code: "H-M", name: "M", gender: "homme", order: 7 },
    { code: "H-L", name: "L", gender: "homme", order: 8 },
    { code: "H-XL", name: "XL", gender: "homme", order: 9 },
    { code: "H-XXL", name: "XXL", gender: "homme", order: 10 },
  ];

  for (const sz of standardSizes) {
    const sizeId = stringToUuid(`size-${sz.code}`);
    lines.push(`
INSERT INTO sizes (id, name, code, gender, display_order)
VALUES ('${sizeId}', ${escapeSql(sz.name)}, ${escapeSql(sz.code)}, ${escapeSql(sz.gender)}, ${sz.order})
ON CONFLICT (code) DO NOTHING;
`);
  }

  // 4. Colors
  lines.push("-- 4. TAXONOMY: COLORS");
  const colorsMap = new Map<string, { id: string; name: string; hex: string }>();

  // Extract all distinct colors from products
  let colorOrder = 1;
  for (const prod of (data.products || [])) {
    for (const c of (prod.colors || [])) {
      if (!colorsMap.has(c.name)) {
        const cId = stringToUuid(`color-${c.name}`);
        colorsMap.set(c.name, { id: cId, name: c.name, hex: c.hex || "#000000" });
      }
    }
  }

  for (const col of colorsMap.values()) {
    lines.push(`
INSERT INTO colors (id, name, hex, display_order)
VALUES ('${col.id}', ${escapeSql(col.name)}, ${escapeSql(col.hex)}, ${colorOrder++})
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;
`);
  }

  // 5. Collections
  lines.push("-- 5. COLLECTIONS");
  for (const col of (data.collections || [])) {
    const colId = stringToUuid(`col-${col.slug || col.id}`);
    lines.push(`
INSERT INTO collections (id, slug, title, subtitle, description, story, hero_desktop_image, hero_mobile_image, is_capsule, is_published, display_order)
VALUES (
  '${colId}',
  ${escapeSql(col.slug)},
  ${escapeSql(col.title)},
  ${escapeSql(col.subtitle || "")},
  ${escapeSql(col.description || "")},
  ${escapeSql(col.story || "")},
  ${escapeSql(col.heroDesktopImage || "/images/editorial/03_the_silhouette.webp")},
  ${escapeSql(col.heroMobileImage || null)},
  ${col.isCapsule ? "true" : "false"},
  ${col.isPublished ? "true" : "false"},
  1
)
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  hero_desktop_image = EXCLUDED.hero_desktop_image,
  is_published = EXCLUDED.is_published;
`);
  }

  // 6. Products, Images, Sizes, Variants
  lines.push("-- 6. PRODUCTS & ASSOCIATED TABLES");
  for (const prod of (data.products || [])) {
    const prodId = stringToUuid(`prod-${prod.slug || prod.id}`);
    const catId = stringToUuid(`category-${prod.category || "femme"}`);
    const colId = prod.collectionSlug ? `'${stringToUuid(`col-${prod.collectionSlug}`)}'` : "NULL";

    lines.push(`
INSERT INTO products (
  id, slug, name, subtitle, description, price, sale_price, category_id, primary_collection_id,
  sub_category, materials, care, fit, is_published, is_featured, is_new, is_sold_out
) VALUES (
  '${prodId}',
  ${escapeSql(prod.slug)},
  ${escapeSql(prod.name)},
  ${escapeSql(prod.subtitle || null)},
  ${escapeSql(prod.description || "")},
  ${prod.price || 0},
  ${prod.salePrice ? prod.salePrice : "NULL"},
  '${catId}',
  ${colId},
  ${escapeSql(prod.subCategory || null)},
  ${escapeSql(prod.materials || null)},
  ${escapeSql(prod.care || null)},
  ${escapeSql(prod.fit || null)},
  ${prod.isPublished !== false ? "true" : "false"},
  ${prod.isFeatured ? "true" : "false"},
  ${prod.isNew ? "true" : "false"},
  ${prod.isSoldOut ? "true" : "false"}
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  is_sold_out = EXCLUDED.is_sold_out;
`);

    // Collection join if present
    if (prod.collectionSlug) {
      const parentColId = stringToUuid(`col-${prod.collectionSlug}`);
      lines.push(`
INSERT INTO collection_products (collection_id, product_id, display_order)
VALUES ('${parentColId}', '${prodId}', 1)
ON CONFLICT (collection_id, product_id) DO NOTHING;
`);
    }

    // Product Images
    const allImages: { url: string; isPrimary: boolean; order: number }[] = [];
    if (prod.primaryImage) {
      allImages.push({ url: prod.primaryImage, isPrimary: true, order: 1 });
    }
    if (prod.secondaryImage && prod.secondaryImage !== prod.primaryImage) {
      allImages.push({ url: prod.secondaryImage, isPrimary: false, order: 2 });
    }
    if (Array.isArray(prod.gallery)) {
      prod.gallery.forEach((gUrl: string, idx: number) => {
        if (!allImages.find((img) => img.url === gUrl)) {
          allImages.push({ url: gUrl, isPrimary: false, order: allImages.length + 1 });
        }
      });
    }

    for (const img of allImages) {
      const imgId = stringToUuid(`img-${prod.slug}-${img.url}`);
      lines.push(`
INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('${imgId}', '${prodId}', ${escapeSql(img.url)}, ${escapeSql(prod.name)}, ${img.isPrimary ? "true" : "false"}, ${img.order})
ON CONFLICT (id) DO NOTHING;
`);
    }

    // Product Variants for size x color combinations
    for (const sizeStr of (prod.sizes || [])) {
      const sizeCode = `F-${sizeStr}`;
      const sizeId = stringToUuid(`size-${sizeCode}`);

      for (const col of (prod.colors || [])) {
        const colorRecord = colorsMap.get(col.name);
        const colorId = colorRecord ? `'${colorRecord.id}'` : "NULL";
        const variantId = stringToUuid(`var-${prod.slug}-${sizeStr}-${col.name}`);
        const sku = `AILYS-${prod.slug.substring(0, 10).toUpperCase()}-${sizeStr}-${(col.name || "DEF").substring(0, 3).toUpperCase()}`;

        lines.push(`
INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('${variantId}', '${prodId}', '${sizeId}', ${colorId}, ${escapeSql(sku)}, 15, true)
ON CONFLICT (id) DO NOTHING;
`);
      }
    }
  }

  // 7. Customers & Orders
  lines.push("-- 7. CUSTOMERS, ADDRESSES & ORDERS");
  for (const ord of (data.orders || [])) {
    const customerPhone = ord.customerPhone || "21600000000";
    const customerId = stringToUuid(`cust-${customerPhone}`);
    const nameParts = (ord.customerName || "Client").trim().split(" ");
    const firstName = nameParts[0] || "Client";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Insert customer
    lines.push(`
INSERT INTO customers (id, email, phone, first_name, last_name, total_orders_count, total_spent)
VALUES (
  '${customerId}',
  ${escapeSql(ord.customerEmail || null)},
  ${escapeSql(customerPhone)},
  ${escapeSql(firstName)},
  ${escapeSql(lastName)},
  1,
  ${ord.total || 0}
)
ON CONFLICT (phone) DO UPDATE SET
  total_orders_count = customers.total_orders_count + 1,
  total_spent = customers.total_spent + EXCLUDED.total_spent;
`);

    // Insert customer address
    const addressId = stringToUuid(`addr-${customerId}-${ord.address || "default"}`);
    lines.push(`
INSERT INTO customer_addresses (id, customer_id, governorate, city, address, is_default)
VALUES (
  '${addressId}',
  '${customerId}',
  ${escapeSql(ord.governorate || "Tunis")},
  ${escapeSql(ord.city || "Tunis")},
  ${escapeSql(ord.address || "")},
  true
)
ON CONFLICT (id) DO NOTHING;
`);

    // Insert order
    const orderId = stringToUuid(`order-${ord.orderCode || ord.id}`);
    lines.push(`
INSERT INTO orders (
  id, order_code, customer_id, customer_name, customer_email, customer_phone, alt_phone,
  governorate, city, address, notes, subtotal, shipping_fee, total, payment_method, status, created_at
) VALUES (
  '${orderId}',
  ${escapeSql(ord.orderCode)},
  '${customerId}',
  ${escapeSql(ord.customerName)},
  ${escapeSql(ord.customerEmail || null)},
  ${escapeSql(customerPhone)},
  ${escapeSql(ord.altPhone || null)},
  ${escapeSql(ord.governorate || "Tunis")},
  ${escapeSql(ord.city || "Tunis")},
  ${escapeSql(ord.address || "")},
  ${escapeSql(ord.notes || null)},
  ${ord.subtotal || 0},
  ${ord.shippingFee || 0},
  ${ord.total || 0},
  ${escapeSql(ord.paymentMethod || "COD")},
  ${escapeSql(ord.status || "nouveau")},
  ${escapeSql(ord.createdAt || new Date().toISOString())}
)
ON CONFLICT (order_code) DO NOTHING;
`);

    // Insert order items
    if (Array.isArray(ord.items)) {
      for (let i = 0; i < ord.items.length; i++) {
        const item = ord.items[i];
        const itemId = stringToUuid(`item-${ord.orderCode}-${i}`);
        lines.push(`
INSERT INTO order_items (
  id, order_id, product_name, size, color, unit_price, quantity, total_price, image_url
) VALUES (
  '${itemId}',
  '${orderId}',
  ${escapeSql(item.productName || "Pièce AÏLYS")},
  ${escapeSql(item.size || "Standard")},
  ${escapeSql(item.color || "Standard")},
  ${item.unitPrice || 0},
  ${item.quantity || 1},
  ${item.totalPrice || item.unitPrice || 0},
  ${escapeSql(item.imageUrl || null)}
)
ON CONFLICT (id) DO NOTHING;
`);
      }
    }
  }

  // 8. Media Assets
  lines.push("-- 8. MEDIA ASSETS");
  for (const m of (data.media || [])) {
    const mediaId = stringToUuid(`media-${m.name || m.url || m.id}`);
    const sizeBytes = typeof m.size === "string" ? parseInt(m.size) * 1024 || 102400 : (m.size || 102400);

    lines.push(`
INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '${mediaId}',
  ${escapeSql(m.name || "asset.webp")},
  ${escapeSql(m.name || "asset.webp")},
  ${escapeSql(m.mimeType || "image/webp")},
  ${sizeBytes},
  ${escapeSql(m.url)},
  'media'
)
ON CONFLICT (id) DO NOTHING;
`);
  }

  // 9. Homepage Sections & Content
  lines.push("-- 9. HOMEPAGE SECTIONS & CONTENT");
  const homepageItems = data.homepagePublished || data.homepageDraft || [];
  for (const sec of homepageItems) {
    const secId = stringToUuid(`hp-sec-${sec.key}`);
    lines.push(`
INSERT INTO homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
VALUES (
  '${secId}',
  ${escapeSql(sec.key)},
  ${escapeSql(sec.title || "")},
  ${escapeSql(sec.subtitle || "")},
  ${sec.order || 1},
  ${sec.isEnabled !== false ? "true" : "false"}
)
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  display_order = EXCLUDED.display_order,
  is_enabled = EXCLUDED.is_enabled;
`);

    // Insert content fields
    const contentId = stringToUuid(`hp-cnt-${sec.key}`);
    const metadata = {
      badge: sec.badge,
      ctaText: sec.ctaText,
      ctaLink: sec.ctaLink,
      secondaryCtaText: sec.secondaryCtaText,
      secondaryCtaLink: sec.secondaryCtaLink,
      desktopImageTransform: sec.desktopImageTransform,
      mobileImageTransform: sec.mobileImageTransform,
      selectedProductSlugs: sec.selectedProductSlugs,
    };

    lines.push(`
INSERT INTO homepage_content (
  id, section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  '${contentId}',
  '${secId}',
  'main_content',
  ${escapeSql(sec.description || "")},
  ${escapeSql(sec.desktopImage || null)},
  ${escapeSql(sec.mobileImage || null)},
  ${escapeSql(JSON.stringify(metadata))}::jsonb
)
ON CONFLICT (section_id, content_key) DO UPDATE SET
  content_value = EXCLUDED.content_value,
  desktop_image_url = EXCLUDED.desktop_image_url,
  mobile_image_url = EXCLUDED.mobile_image_url,
  metadata = EXCLUDED.metadata;
`);
  }

  const outputPath = path.join(process.cwd(), "supabase", "migrations", "seed_current_data.sql");
  fs.writeFileSync(outputPath, lines.join("\n"), "utf-8");
  console.log(`Generated PostgreSQL seed script at: ${outputPath} (${lines.length} lines)`);
}

main().catch(console.error);
