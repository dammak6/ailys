import fs from "fs";
import path from "path";
import crypto from "crypto";

function stringToUuid(str) {
  const hash = crypto.createHash("md5").update("ailys-namespace-" + str).digest("hex");
  return [
    hash.substring(0, 8),
    hash.substring(8, 12),
    "4" + hash.substring(13, 16),
    "8" + hash.substring(17, 20),
    hash.substring(20, 32),
  ].join("-");
}

function escapeSql(val) {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return val ? "true" : "false";
  return `'${String(val).replace(/'/g, "''")}'`;
}

function generate() {
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data", "admin-data.json"), "utf-8"));

  // File 1: Collections, Colors, Products, Images, Variants, Size Guides
  const lines1 = [];
  lines1.push("-- =============================================================================");
  lines1.push("-- AÏLYS PRODUCTION MIGRATION: 06 - REAL CATALOG & COLLECTIONS SEED");
  lines1.push("-- =============================================================================\n");

  lines1.push("-- 1. COLLECTIONS");
  for (const col of (data.collections || [])) {
    const colId = stringToUuid(`col-${col.slug || col.id}`);
    lines1.push(`
INSERT INTO public.collections (id, title, slug, subtitle, description, story, hero_desktop_image, hero_mobile_image, is_capsule, is_published, display_order)
VALUES (
  '${colId}',
  ${escapeSql(col.title)},
  ${escapeSql(col.slug)},
  ${escapeSql(col.subtitle || "")},
  ${escapeSql(col.description || "")},
  ${escapeSql(col.story || "")},
  ${escapeSql(col.heroDesktopImage || "/images/editorial/03_the_silhouette.webp")},
  ${escapeSql(col.heroMobileImage || null)},
  ${col.isCapsule ? "true" : "false"},
  ${col.isPublished !== false ? "true" : "false"},
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

  // Colors
  const colorsMap = new Map();
  for (const prod of (data.products || [])) {
    for (const c of (prod.colors || [])) {
      if (!colorsMap.has(c.name)) {
        colorsMap.set(c.name, c.hex || "#1C2833");
      }
    }
  }

  for (const [name, hex] of colorsMap.entries()) {
    lines1.push(`
INSERT INTO public.colors (id, name, hex, display_order)
VALUES ('${stringToUuid(`col-${name}`)}', ${escapeSql(name)}, ${escapeSql(hex)}, 10)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;
`);
  }

  // Products
  lines1.push("\n-- 2. PRODUCTS, IMAGES & VARIANTS");
  for (const prod of (data.products || [])) {
    const prodId = stringToUuid(`prod-${prod.slug}`);
    lines1.push(`
INSERT INTO public.products (
  id, name, slug, subtitle, description, materials, care, fit, price, sale_price,
  category_id, sub_category, is_published, is_new, is_capsule, is_featured, is_sold_out_manual_override
) VALUES (
  '${prodId}',
  ${escapeSql(prod.name)},
  ${escapeSql(prod.slug)},
  ${escapeSql(prod.subtitle || null)},
  ${escapeSql(prod.description || "")},
  ${escapeSql(prod.materials || null)},
  ${escapeSql(prod.care || null)},
  ${escapeSql(prod.fit || null)},
  ${prod.price || 0},
  ${prod.salePrice ? prod.salePrice : "NULL"},
  (SELECT id FROM public.categories WHERE slug = ${escapeSql(prod.category || "femme")} LIMIT 1),
  ${escapeSql(prod.subCategory || "Prêt-à-porter")},
  ${prod.isPublished !== false ? "true" : "false"},
  ${prod.isNew ? "true" : "false"},
  ${prod.isCapsule ? "true" : "false"},
  ${prod.isFeatured ? "true" : "false"},
  ${prod.isSoldOut ? "true" : "false"}
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_published = EXCLUDED.is_published,
  is_sold_out_manual_override = EXCLUDED.is_sold_out_manual_override;
`);

    if (prod.collectionSlug) {
      lines1.push(`
INSERT INTO public.collection_products (collection_id, product_id, display_order)
VALUES (
  (SELECT id FROM public.collections WHERE slug = ${escapeSql(prod.collectionSlug)} LIMIT 1),
  '${prodId}',
  1
)
ON CONFLICT (collection_id, product_id) DO NOTHING;
`);
    }

    // Images
    const allImages = [];
    if (prod.primaryImage) allImages.push({ url: prod.primaryImage, isPrimary: true, order: 1 });
    if (prod.secondaryImage && prod.secondaryImage !== prod.primaryImage) {
      allImages.push({ url: prod.secondaryImage, isPrimary: false, order: 2 });
    }
    if (Array.isArray(prod.gallery)) {
      prod.gallery.forEach((g) => {
        if (!allImages.find((img) => img.url === g)) {
          allImages.push({ url: g, isPrimary: false, order: allImages.length + 1 });
        }
      });
    }

    for (const img of allImages) {
      const imgId = stringToUuid(`img-${prod.slug}-${img.url}`);
      lines1.push(`
INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('${imgId}', '${prodId}', ${escapeSql(img.url)}, ${escapeSql(prod.name)}, ${img.isPrimary ? "true" : "false"}, ${img.order})
ON CONFLICT (id) DO NOTHING;
`);
    }

    // Sizes & Variants
    const prefix = (prod.category === "homme") ? "H-" : (prod.category === "enfant" ? "E-" : "F-");
    for (const sz of (prod.sizes || ["36", "38", "40", "42"])) {
      const szCode = `${prefix}${sz}`;
      lines1.push(`
INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '${prodId}', id, true
FROM public.sizes
WHERE code = '${szCode}'
ON CONFLICT (product_id, size_id) DO NOTHING;
`);

      for (const col of (prod.colors || [{ name: "Noir Ébène" }])) {
        const sku = `AILYS-${prod.slug.substring(0, 10).toUpperCase()}-${sz}-${col.name.substring(0, 3).toUpperCase()}`;
        const varId = stringToUuid(`var-${prod.slug}-${sz}-${col.name}`);

        lines1.push(`
INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '${varId}',
  '${prodId}',
  s.id,
  c.id,
  '${sku}',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = '${szCode}' AND c.name = ${escapeSql(col.name)}
ON CONFLICT (sku) DO NOTHING;
`);
      }
    }
  }

  // Size guide
  lines1.push(`
-- 3. SIZE GUIDES
INSERT INTO public.size_guides (id, category_id, title, description, how_to_measure)
SELECT 
  '${stringToUuid("sg-femme")}',
  c.id,
  'Guide des Tailles AÏLYS — Silhouette Femme',
  'Nos silhouettes sont calibrées selon les standards de confection méditerranéens.',
  'Mesurez au point le plus fort de la poitrine, le creux de la taille et le point le plus large des hanches.'
FROM public.categories c
WHERE c.slug = 'femme'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.size_guide_rows (size_guide_id, size_code, chest_min_cm, chest_max_cm, waist_min_cm, waist_max_cm, hips_min_cm, hips_max_cm, display_order)
VALUES
  ('${stringToUuid("sg-femme")}', '36 (XS)', 82.0, 86.0, 62.0, 66.0, 88.0, 92.0, 1),
  ('${stringToUuid("sg-femme")}', '38 (S)', 86.0, 90.0, 66.0, 70.0, 92.0, 96.0, 2),
  ('${stringToUuid("sg-femme")}', '40 (M)', 90.0, 94.0, 70.0, 74.0, 96.0, 100.0, 3),
  ('${stringToUuid("sg-femme")}', '42 (L)', 94.0, 98.0, 74.0, 78.0, 100.0, 104.0, 4),
  ('${stringToUuid("sg-femme")}', '44 (XL)', 98.0, 104.0, 78.0, 84.0, 104.0, 110.0, 5)
ON CONFLICT DO NOTHING;

INSERT INTO public.size_guides (id, category_id, title, description, how_to_measure)
SELECT 
  '${stringToUuid("sg-homme")}',
  c.id,
  'Guide des Tailles AÏLYS — Silhouette Homme',
  'Confection structurée et aisance de mouvement pour les silhouettes masculines.',
  'Mesurez le tour de poitrine bien horizontalement, le tour de taille au niveau du nombril et le tour de hanches.'
FROM public.categories c
WHERE c.slug = 'homme'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.size_guide_rows (size_guide_id, size_code, chest_min_cm, chest_max_cm, waist_min_cm, waist_max_cm, hips_min_cm, hips_max_cm, display_order)
VALUES
  ('${stringToUuid("sg-homme")}', 'S', 90.0, 95.0, 78.0, 83.0, 92.0, 97.0, 1),
  ('${stringToUuid("sg-homme")}', 'M', 96.0, 101.0, 84.0, 89.0, 98.0, 103.0, 2),
  ('${stringToUuid("sg-homme")}', 'L', 102.0, 107.0, 90.0, 95.0, 104.0, 109.0, 3),
  ('${stringToUuid("sg-homme")}', 'XL', 108.0, 114.0, 96.0, 102.0, 110.0, 116.0, 4)
ON CONFLICT DO NOTHING;
`);

  const path1 = path.join(process.cwd(), "supabase", "migrations", "20260923060000_seed_collections_and_products.sql");
  fs.writeFileSync(path1, lines1.join("\n"), "utf-8");
  console.log("Written migration 06 to:", path1);

  // File 2: Media and Homepage CMS
  const lines2 = [];
  lines2.push("-- =============================================================================");
  lines2.push("-- AÏLYS PRODUCTION MIGRATION: 07 - REAL CMS & MEDIA SEED");
  lines2.push("-- =============================================================================\n");

  lines2.push("-- 1. MEDIA ASSETS");
  for (const m of (data.media || [])) {
    const medId = stringToUuid(`med-${m.name || m.url}`);
    lines2.push(`
INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '${medId}',
  ${escapeSql(m.name || "asset.webp")},
  ${escapeSql(m.name || "asset.webp")},
  ${escapeSql(m.mimeType || "image/webp")},
  102400,
  1920,
  1080,
  ${escapeSql(m.url)},
  'media',
  ${escapeSql(JSON.stringify(m.transform || {}))}::jsonb
)
ON CONFLICT (id) DO NOTHING;
`);
  }

  lines2.push("\n-- 2. HOMEPAGE SECTIONS & CONTENT");
  const sections = data.homepagePublished || data.homepageDraft || [];
  for (const sec of sections) {
    const secId = stringToUuid(`hp-sec-${sec.key}`);
    lines2.push(`
INSERT INTO public.homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
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

    const meta = {
      badge: sec.badge,
      ctaText: sec.ctaText,
      ctaLink: sec.ctaLink,
      secondaryCtaText: sec.secondaryCtaText,
      secondaryCtaLink: sec.secondaryCtaLink,
      desktopImageTransform: sec.desktopImageTransform,
      mobileImageTransform: sec.mobileImageTransform,
      selectedProductSlugs: sec.selectedProductSlugs,
    };

    lines2.push(`
INSERT INTO public.homepage_content (
  section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  '${secId}',
  'main_content',
  ${escapeSql(sec.description || "")},
  ${escapeSql(sec.desktopImage || null)},
  ${escapeSql(sec.mobileImage || null)},
  ${escapeSql(JSON.stringify(meta))}::jsonb
)
ON CONFLICT (section_id, content_key) DO UPDATE SET
  content_value = EXCLUDED.content_value,
  desktop_image_url = EXCLUDED.desktop_image_url,
  mobile_image_url = EXCLUDED.mobile_image_url,
  metadata = EXCLUDED.metadata;
`);
  }

  const path2 = path.join(process.cwd(), "supabase", "migrations", "20260923070000_seed_cms_and_media.sql");
  fs.writeFileSync(path2, lines2.join("\n"), "utf-8");
  console.log("Written migration 07 to:", path2);
}

generate();
