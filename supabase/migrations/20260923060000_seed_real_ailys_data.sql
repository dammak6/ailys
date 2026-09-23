-- =============================================================================
-- AÏLYS PRODUCTION MIGRATION: 06 - REAL CONTENT SEED
-- Source: data/admin-data.json (Actual AÏLYS Catalog, Imagery & CMS)
-- =============================================================================

-- 1. COLLECTIONS

INSERT INTO public.collections (id, title, slug, subtitle, description, story, hero_desktop_image, hero_mobile_image, is_capsule, is_published, display_order)
VALUES (
  'aa9f95b6-453a-45fd-81cd-be14e1287ca2',
  'L''Atelier Urbain',
  'atelier-urbain',
  'Édition Sfax 2026 • Denim, Cuir Nappa & Mailles Techniques',
  'Une collection moderne façonnée dans notre atelier de Sfax. Volumes contemporains, denim indigo brut, cuir nappa souple et vestes en jersey scuba double face pour une élégance fonctionnelle et affirmée.',
  'Née au cœur de notre atelier de Sfax, la collection L''Atelier Urbain capture l''équilibre singulier entre l''artisanat textile tunisien et la modernité des coupes contemporaines. Du blouson bomber en cuir nappa à la veste en denim brut selvedge, en passant par les vestes techniques en maille scuba thermique, chaque pièce est construite avec une rigueur architecturale et un confort absolu au quotidien.',
  '/images/editorial/03_the_silhouette.webp',
  '/images/editorial/02_ailys_portrait.webp',
  true,
  true,
  1
)
ON CONFLICT (slug) DO UPDATE SET 
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  hero_desktop_image = EXCLUDED.hero_desktop_image,
  is_published = EXCLUDED.is_published;


INSERT INTO public.colors (id, name, hex, display_order)
VALUES ('958c772c-1b8d-4d83-8676-586518e56b30', 'Indigo Brut', '#1C2833', 10)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;


INSERT INTO public.colors (id, name, hex, display_order)
VALUES ('e0e7434c-2ff3-4dbc-885a-03817c1152c1', 'Noir Nappa', '#111111', 10)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;


INSERT INTO public.colors (id, name, hex, display_order)
VALUES ('68bf911d-4c32-48cc-8a08-35fd6ce320a6', 'Kaki Ombre', '#5C5645', 10)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;


INSERT INTO public.colors (id, name, hex, display_order)
VALUES ('1b67951a-c772-4912-8a42-e90ffeed9973', 'Noir Onyx', '#0E0E10', 10)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;


INSERT INTO public.colors (id, name, hex, display_order)
VALUES ('f2131346-92ba-484b-80ed-c289803a3451', 'Grenat Profond', '#38171E', 10)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;


INSERT INTO public.colors (id, name, hex, display_order)
VALUES ('1ad8c0bf-4cb4-481d-893e-aa23fb8c2401', 'Gris Chiné', '#A8A8AA', 10)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;


INSERT INTO public.colors (id, name, hex, display_order)
VALUES ('f28febbb-545f-42c1-852d-24037c849748', 'Blanc Craie', '#F7F6F2', 10)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;


-- 2. PRODUCTS, VARIANTS & IMAGES

INSERT INTO public.products (
  id, name, slug, subtitle, description, materials, care, fit, price, sale_price,
  category_id, sub_category, is_published, is_new, is_capsule, is_featured, is_sold_out_manual_override
) VALUES (
  '93820d0f-cccd-43fb-84e4-b7f52db6748e',
  'Veste Boxy Denim Indigo Brut',
  'veste-boxy-denim-indigo-brut',
  'Coupe courte architecturale en denim selvedge d''atelier',
  'Veste courte à la coupe boxy affirmée, confectionnée en denim de coton brut indigo profond. Découpes structurées inspirées du vestiaire utilitaire d''atelier, boutons métalliques argentés et poches plaquées amples.',
  '100% Coton denim brut selvedge 12.5 oz de haute tenue',
  'Lavage à froid sur l''envers. Séchage à plat.',
  'Coupe boxy contemporaine légèrement cropped.',
  280,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'femme' LIMIT 1),
  'Vestes & Manteaux',
  false,
  true,
  false,
  true,
  false
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  materials = EXCLUDED.materials,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  is_published = EXCLUDED.is_published,
  is_sold_out_manual_override = EXCLUDED.is_sold_out_manual_override;


INSERT INTO public.collection_products (collection_id, product_id, display_order)
VALUES (
  (SELECT id FROM public.collections WHERE slug = 'atelier-urbain' LIMIT 1),
  '93820d0f-cccd-43fb-84e4-b7f52db6748e',
  1
)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('40636841-735e-4345-8639-cdd6d713783f', '93820d0f-cccd-43fb-84e4-b7f52db6748e', '/images/products/07460319401-A7M.webp', 'Veste Boxy Denim Indigo Brut', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('4b379f7c-f7bc-4d04-8664-6102a92899a3', '93820d0f-cccd-43fb-84e4-b7f52db6748e', '/images/products/07460319401-A6M.webp', 'Veste Boxy Denim Indigo Brut', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('71598437-595c-4aa0-81d8-9b0fafb1736a', '93820d0f-cccd-43fb-84e4-b7f52db6748e', '/images/products/07460319401-A2M.webp', 'Veste Boxy Denim Indigo Brut', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9acf5b36-7b91-4e7a-8951-f886f9747b51', '93820d0f-cccd-43fb-84e4-b7f52db6748e', '/images/products/07460319401-A20M.webp', 'Veste Boxy Denim Indigo Brut', false, 4)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '93820d0f-cccd-43fb-84e4-b7f52db6748e', id, true
FROM public.sizes
WHERE code = 'F-36'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '183a6958-5aea-4e7f-8f11-2ca394399ea8',
  '93820d0f-cccd-43fb-84e4-b7f52db6748e',
  s.id,
  c.id,
  'AILYS-VESTE-BOXY-36-IND',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-36' AND c.name = 'Indigo Brut'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '93820d0f-cccd-43fb-84e4-b7f52db6748e', id, true
FROM public.sizes
WHERE code = 'F-38'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '12f55c3c-04f0-4d2d-87d4-280ad36e4d5a',
  '93820d0f-cccd-43fb-84e4-b7f52db6748e',
  s.id,
  c.id,
  'AILYS-VESTE-BOXY-38-IND',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-38' AND c.name = 'Indigo Brut'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '93820d0f-cccd-43fb-84e4-b7f52db6748e', id, true
FROM public.sizes
WHERE code = 'F-40'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '6f7a6368-a934-4c13-8348-3dffb27cc325',
  '93820d0f-cccd-43fb-84e4-b7f52db6748e',
  s.id,
  c.id,
  'AILYS-VESTE-BOXY-40-IND',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-40' AND c.name = 'Indigo Brut'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '93820d0f-cccd-43fb-84e4-b7f52db6748e', id, true
FROM public.sizes
WHERE code = 'F-42'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '3bead850-4916-4bd8-8b81-ce1796e84b5f',
  '93820d0f-cccd-43fb-84e4-b7f52db6748e',
  s.id,
  c.id,
  'AILYS-VESTE-BOXY-42-IND',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-42' AND c.name = 'Indigo Brut'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.products (
  id, name, slug, subtitle, description, materials, care, fit, price, sale_price,
  category_id, sub_category, is_published, is_new, is_capsule, is_featured, is_sold_out_manual_override
) VALUES (
  'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec',
  'Blouson Nappa Noir Silhouette',
  'blouson-nappa-noir-silhouette',
  'Esprit aviateur contemporain en cuir nappa ultra souple',
  'Blouson zippé en cuir nappa ultra souple au grain lisse velouté. Col chemise franc, poignets et ourlet bas élastiqués pour un effet blousant très chic. Pièce maîtresse de la saison.',
  'Cuir nappa végan souple premium, doublure 100% viscose respirante',
  'Nettoyage délicat avec un chiffon doux légèrement humide. Ne pas repasser.',
  'Coupe blousante décontractée avec taille resserrée par élastique.',
  395,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'femme' LIMIT 1),
  'Vestes & Manteaux',
  true,
  false,
  true,
  true,
  false
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  materials = EXCLUDED.materials,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  is_published = EXCLUDED.is_published,
  is_sold_out_manual_override = EXCLUDED.is_sold_out_manual_override;


INSERT INTO public.collection_products (collection_id, product_id, display_order)
VALUES (
  (SELECT id FROM public.collections WHERE slug = 'atelier-urbain' LIMIT 1),
  'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec',
  1
)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('1281b0a2-20c5-4aca-84a7-2321ac928de2', 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', '/images/products/07670434700-M.webp', 'Blouson Nappa Noir Silhouette', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('898f695b-6f37-4eef-876f-d8b6c89afa2b', 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', '/images/products/07670434700-A6M.webp', 'Blouson Nappa Noir Silhouette', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3236eeda-eb8b-440a-8a00-49d849561267', 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', '/images/products/07670434700-A2M.webp', 'Blouson Nappa Noir Silhouette', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', id, true
FROM public.sizes
WHERE code = 'F-36'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  'd880f552-b787-4d69-8114-4680260f5e33',
  'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec',
  s.id,
  c.id,
  'AILYS-BLOUSON-NA-36-NOI',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-36' AND c.name = 'Noir Nappa'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', id, true
FROM public.sizes
WHERE code = 'F-38'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '3cbbba73-c555-43f1-8b5d-234d96e1f281',
  'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec',
  s.id,
  c.id,
  'AILYS-BLOUSON-NA-38-NOI',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-38' AND c.name = 'Noir Nappa'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', id, true
FROM public.sizes
WHERE code = 'F-40'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  'd39f0b54-27d7-4bc1-8aaa-235e8bc0694a',
  'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec',
  s.id,
  c.id,
  'AILYS-BLOUSON-NA-40-NOI',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-40' AND c.name = 'Noir Nappa'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', id, true
FROM public.sizes
WHERE code = 'F-42'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  'fc8d48b9-5891-40d4-84f1-253759a0b1ee',
  'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec',
  s.id,
  c.id,
  'AILYS-BLOUSON-NA-42-NOI',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-42' AND c.name = 'Noir Nappa'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.products (
  id, name, slug, subtitle, description, materials, care, fit, price, sale_price,
  category_id, sub_category, is_published, is_new, is_capsule, is_featured, is_sold_out_manual_override
) VALUES (
  '80df78d1-69ea-4fa0-8a85-52965c359e30',
  'Veste Boxy Sergé Kaki Ombre',
  'veste-boxy-serge-kaki-ombre',
  'Sergé de coton teinté en pièce, nuance terre d''ombre',
  'Veste courte en toile sergée de coton lourd lavé. Teinte minérale subtile entre kaki patiné et terre d''ombre. Fermeture à boutons métalliques et coupe structurée confortable.',
  '100% Coton sergé lourd délavé aux enzymes',
  'Lavage en machine à 30°C. Séchage sur cintre.',
  'Coupe droite déstructurée.',
  265,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'femme' LIMIT 1),
  'Vestes & Manteaux',
  true,
  true,
  false,
  false,
  false
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  materials = EXCLUDED.materials,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  is_published = EXCLUDED.is_published,
  is_sold_out_manual_override = EXCLUDED.is_sold_out_manual_override;


INSERT INTO public.collection_products (collection_id, product_id, display_order)
VALUES (
  (SELECT id FROM public.collections WHERE slug = 'atelier-urbain' LIMIT 1),
  '80df78d1-69ea-4fa0-8a85-52965c359e30',
  1
)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0a19d7db-a26c-4099-8a9e-9b47f23ed965', '80df78d1-69ea-4fa0-8a85-52965c359e30', '/images/products/07460319700-A7M.webp', 'Veste Boxy Sergé Kaki Ombre', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('25b8b824-5203-441e-8283-fd3bb5a4fedc', '80df78d1-69ea-4fa0-8a85-52965c359e30', '/images/products/07460319700-A6M.webp', 'Veste Boxy Sergé Kaki Ombre', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a6973561-94e4-4ac5-820c-49e45553a0f7', '80df78d1-69ea-4fa0-8a85-52965c359e30', '/images/products/07460319700-A2M.webp', 'Veste Boxy Sergé Kaki Ombre', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9ffd608c-e715-4496-8fdb-3c3326b2fa67', '80df78d1-69ea-4fa0-8a85-52965c359e30', '/images/products/07460319700-A20M.webp', 'Veste Boxy Sergé Kaki Ombre', false, 4)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '80df78d1-69ea-4fa0-8a85-52965c359e30', id, true
FROM public.sizes
WHERE code = 'F-36'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '31c8fe56-cfd4-4e1b-811d-d6170ed9d87c',
  '80df78d1-69ea-4fa0-8a85-52965c359e30',
  s.id,
  c.id,
  'AILYS-VESTE-BOXY-36-KAK',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-36' AND c.name = 'Kaki Ombre'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '80df78d1-69ea-4fa0-8a85-52965c359e30', id, true
FROM public.sizes
WHERE code = 'F-38'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '2119a391-2655-468e-8344-58e2049c4d10',
  '80df78d1-69ea-4fa0-8a85-52965c359e30',
  s.id,
  c.id,
  'AILYS-VESTE-BOXY-38-KAK',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-38' AND c.name = 'Kaki Ombre'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '80df78d1-69ea-4fa0-8a85-52965c359e30', id, true
FROM public.sizes
WHERE code = 'F-40'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  'f8e94120-9179-4711-82d5-9cb1adbd5d54',
  '80df78d1-69ea-4fa0-8a85-52965c359e30',
  s.id,
  c.id,
  'AILYS-VESTE-BOXY-40-KAK',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-40' AND c.name = 'Kaki Ombre'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '80df78d1-69ea-4fa0-8a85-52965c359e30', id, true
FROM public.sizes
WHERE code = 'F-42'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  'aeee2649-e6c3-470e-8b9d-8c7c28907383',
  '80df78d1-69ea-4fa0-8a85-52965c359e30',
  s.id,
  c.id,
  'AILYS-VESTE-BOXY-42-KAK',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-42' AND c.name = 'Kaki Ombre'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.products (
  id, name, slug, subtitle, description, materials, care, fit, price, sale_price,
  category_id, sub_category, is_published, is_new, is_capsule, is_featured, is_sold_out_manual_override
) VALUES (
  '53d57dbd-e234-45b6-8298-5a92054c3346',
  'Veste Zippée Scuba Noir Onyx',
  'veste-zippee-scuba-noir-onyx',
  'Maille technique interlock haute densité à col montant',
  'Veste sport-chic technique en jersey scuba double face. Tombé sculptural sans pli, col montant ajusté, zip en métal argenté et poches italiennes discrètes. La parfaite veste mi-saison urbaine.',
  '75% Coton peigné, 20% Polyester technique, 5% Élasthanne (320 g/m²)',
  'Lavage en machine à 30°C sur l''envers. Repassage doux à la vapeur si nécessaire.',
  'Coupe régulière sportive.',
  245,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'homme' LIMIT 1),
  'Vestes Sport-Chic',
  true,
  true,
  false,
  true,
  false
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  materials = EXCLUDED.materials,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  is_published = EXCLUDED.is_published,
  is_sold_out_manual_override = EXCLUDED.is_sold_out_manual_override;


INSERT INTO public.collection_products (collection_id, product_id, display_order)
VALUES (
  (SELECT id FROM public.collections WHERE slug = 'atelier-urbain' LIMIT 1),
  '53d57dbd-e234-45b6-8298-5a92054c3346',
  1
)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2bd2d6b8-078a-40e3-8152-fb109534d23d', '53d57dbd-e234-45b6-8298-5a92054c3346', '/images/products/07721518800-M.webp', 'Veste Zippée Scuba Noir Onyx', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0ed24251-3204-4eee-8209-ec5be6b8ab34', '53d57dbd-e234-45b6-8298-5a92054c3346', '/images/products/07721522800-A6M.webp', 'Veste Zippée Scuba Noir Onyx', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('92060d7d-0326-437a-81c4-e07a5ce79483', '53d57dbd-e234-45b6-8298-5a92054c3346', '/images/products/07721518800-A4M.webp', 'Veste Zippée Scuba Noir Onyx', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('368cd363-44af-4adf-8d9c-129b32a5f34b', '53d57dbd-e234-45b6-8298-5a92054c3346', '/images/products/07721522800-A8M.webp', 'Veste Zippée Scuba Noir Onyx', false, 4)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('55a9dbcc-613d-470c-817e-378e074d9917', '53d57dbd-e234-45b6-8298-5a92054c3346', '/images/products/07721522800-A20M.webp', 'Veste Zippée Scuba Noir Onyx', false, 5)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '53d57dbd-e234-45b6-8298-5a92054c3346', id, true
FROM public.sizes
WHERE code = 'F-S'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '5b662e77-dde3-485b-8dc1-3f53bea3d148',
  '53d57dbd-e234-45b6-8298-5a92054c3346',
  s.id,
  c.id,
  'AILYS-VESTE-ZIPP-S-NOI',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-S' AND c.name = 'Noir Onyx'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '53d57dbd-e234-45b6-8298-5a92054c3346', id, true
FROM public.sizes
WHERE code = 'F-M'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '5ed5f076-91c4-4240-8b56-b8e705cab259',
  '53d57dbd-e234-45b6-8298-5a92054c3346',
  s.id,
  c.id,
  'AILYS-VESTE-ZIPP-M-NOI',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-M' AND c.name = 'Noir Onyx'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '53d57dbd-e234-45b6-8298-5a92054c3346', id, true
FROM public.sizes
WHERE code = 'F-L'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  'd584bbf4-4619-4f0d-81db-97c6930405bf',
  '53d57dbd-e234-45b6-8298-5a92054c3346',
  s.id,
  c.id,
  'AILYS-VESTE-ZIPP-L-NOI',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-L' AND c.name = 'Noir Onyx'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '53d57dbd-e234-45b6-8298-5a92054c3346', id, true
FROM public.sizes
WHERE code = 'F-XL'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  'f06bfdd2-5a2f-4d75-8a24-688963217b9d',
  '53d57dbd-e234-45b6-8298-5a92054c3346',
  s.id,
  c.id,
  'AILYS-VESTE-ZIPP-XL-NOI',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-XL' AND c.name = 'Noir Onyx'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.products (
  id, name, slug, subtitle, description, materials, care, fit, price, sale_price,
  category_id, sub_category, is_published, is_new, is_capsule, is_featured, is_sold_out_manual_override
) VALUES (
  'cd671668-16f4-4dc6-82c0-baa3d21aad30',
  'Veste Zippée Scuba Grenat',
  'veste-zippee-scuba-grenat',
  'Teinte bordeaux profond noble sur maille scuba double face',
  'Déclinaison dans un rouge grenat sombre et raffiné de notre veste zippée en scuba technique. Apporte une touche de couleur chaude et feutrée au vestiaire masculin.',
  '75% Coton peigné, 20% Polyester technique, 5% Élasthanne',
  'Lavage délicat à 30°C.',
  'Coupe athlétique contemporaine.',
  245,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'homme' LIMIT 1),
  'Vestes Sport-Chic',
  true,
  true,
  false,
  false,
  false
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  materials = EXCLUDED.materials,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  is_published = EXCLUDED.is_published,
  is_sold_out_manual_override = EXCLUDED.is_sold_out_manual_override;


INSERT INTO public.collection_products (collection_id, product_id, display_order)
VALUES (
  (SELECT id FROM public.collections WHERE slug = 'atelier-urbain' LIMIT 1),
  'cd671668-16f4-4dc6-82c0-baa3d21aad30',
  1
)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8eaab0d2-ce9b-4572-8598-7fe8d9634685', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', '/images/products/07721918700-M.webp', 'Veste Zippée Scuba Grenat', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('91cdd383-fc6b-4be1-81ab-95aecec94a45', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', '/images/products/07721918700-A6M.webp', 'Veste Zippée Scuba Grenat', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('4d34e474-32e1-45bb-85d0-d7e469c6e319', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', '/images/products/07721918700-A2M.webp', 'Veste Zippée Scuba Grenat', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ebfe27e3-09f4-4562-8312-04f6f8b1d1ce', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', '/images/products/07721918700-A8M.webp', 'Veste Zippée Scuba Grenat', false, 4)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('66341d06-d269-4c9e-8763-19fa32bea9c0', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', '/images/products/07721918700-A20M.webp', 'Veste Zippée Scuba Grenat', false, 5)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'cd671668-16f4-4dc6-82c0-baa3d21aad30', id, true
FROM public.sizes
WHERE code = 'F-S'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '46721265-0427-434d-8527-17b6e9e2493d',
  'cd671668-16f4-4dc6-82c0-baa3d21aad30',
  s.id,
  c.id,
  'AILYS-VESTE-ZIPP-S-GRE',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-S' AND c.name = 'Grenat Profond'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'cd671668-16f4-4dc6-82c0-baa3d21aad30', id, true
FROM public.sizes
WHERE code = 'F-M'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '8b8129cc-7b41-4667-8451-8e33b7b864ed',
  'cd671668-16f4-4dc6-82c0-baa3d21aad30',
  s.id,
  c.id,
  'AILYS-VESTE-ZIPP-M-GRE',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-M' AND c.name = 'Grenat Profond'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'cd671668-16f4-4dc6-82c0-baa3d21aad30', id, true
FROM public.sizes
WHERE code = 'F-L'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '4ec39002-0d18-47c6-87ba-890829478bae',
  'cd671668-16f4-4dc6-82c0-baa3d21aad30',
  s.id,
  c.id,
  'AILYS-VESTE-ZIPP-L-GRE',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-L' AND c.name = 'Grenat Profond'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'cd671668-16f4-4dc6-82c0-baa3d21aad30', id, true
FROM public.sizes
WHERE code = 'F-XL'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '8c203195-8f1b-443b-8ea8-948519bfca05',
  'cd671668-16f4-4dc6-82c0-baa3d21aad30',
  s.id,
  c.id,
  'AILYS-VESTE-ZIPP-XL-GRE',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-XL' AND c.name = 'Grenat Profond'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.products (
  id, name, slug, subtitle, description, materials, care, fit, price, sale_price,
  category_id, sub_category, is_published, is_new, is_capsule, is_featured, is_sold_out_manual_override
) VALUES (
  '747dc74e-00cb-433b-8810-939a506408b4',
  'Veste Zippée Scuba Gris Chiné',
  'veste-zippee-scuba-gris-chine',
  'Maille scuba chinée douce au tombé net et structuré',
  'Veste zippée polyvalente en scuba chiné gris perle. Idéale superposée sur une chemise ou un t-shirt pour une allure sport-chic décontractée.',
  '70% Coton, 25% Polyester, 5% Élasthanne',
  'Lavage en machine à 30°C.',
  'Coupe décontractée urbaine.',
  245,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'homme' LIMIT 1),
  'Vestes Sport-Chic',
  true,
  true,
  false,
  false,
  false
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  materials = EXCLUDED.materials,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  is_published = EXCLUDED.is_published,
  is_sold_out_manual_override = EXCLUDED.is_sold_out_manual_override;


INSERT INTO public.collection_products (collection_id, product_id, display_order)
VALUES (
  (SELECT id FROM public.collections WHERE slug = 'atelier-urbain' LIMIT 1),
  '747dc74e-00cb-433b-8810-939a506408b4',
  1
)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('fd8db672-25e6-4671-8c07-09c2de0456fb', '747dc74e-00cb-433b-8810-939a506408b4', '/images/products/07721918803-M.webp', 'Veste Zippée Scuba Gris Chiné', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('bfe8cfbe-b01c-4c07-89e2-caa21decb49d', '747dc74e-00cb-433b-8810-939a506408b4', '/images/products/07721918803-A6M.webp', 'Veste Zippée Scuba Gris Chiné', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ac011f8c-0629-4e1f-85bd-f8d10585cf58', '747dc74e-00cb-433b-8810-939a506408b4', '/images/products/07721918803-A5M.webp', 'Veste Zippée Scuba Gris Chiné', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('92d43366-e40e-42fc-81f0-9cff26f4e9a1', '747dc74e-00cb-433b-8810-939a506408b4', '/images/products/07721918803-A20M.webp', 'Veste Zippée Scuba Gris Chiné', false, 4)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '747dc74e-00cb-433b-8810-939a506408b4', id, true
FROM public.sizes
WHERE code = 'F-S'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '2932f14b-bbd3-48c2-8515-da1b3d41ec0f',
  '747dc74e-00cb-433b-8810-939a506408b4',
  s.id,
  c.id,
  'AILYS-VESTE-ZIPP-S-GRI',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-S' AND c.name = 'Gris Chiné'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '747dc74e-00cb-433b-8810-939a506408b4', id, true
FROM public.sizes
WHERE code = 'F-M'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '0a7f5eb0-4213-4cdd-8375-bcd01e9f7569',
  '747dc74e-00cb-433b-8810-939a506408b4',
  s.id,
  c.id,
  'AILYS-VESTE-ZIPP-M-GRI',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-M' AND c.name = 'Gris Chiné'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '747dc74e-00cb-433b-8810-939a506408b4', id, true
FROM public.sizes
WHERE code = 'F-L'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  'd857bc09-60dd-40fc-88a9-736a73d7825f',
  '747dc74e-00cb-433b-8810-939a506408b4',
  s.id,
  c.id,
  'AILYS-VESTE-ZIPP-L-GRI',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-L' AND c.name = 'Gris Chiné'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '747dc74e-00cb-433b-8810-939a506408b4', id, true
FROM public.sizes
WHERE code = 'F-XL'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  'b8878da6-58ea-4387-802d-7463e9a33d98',
  '747dc74e-00cb-433b-8810-939a506408b4',
  s.id,
  c.id,
  'AILYS-VESTE-ZIPP-XL-GRI',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-XL' AND c.name = 'Gris Chiné'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.products (
  id, name, slug, subtitle, description, materials, care, fit, price, sale_price,
  category_id, sub_category, is_published, is_new, is_capsule, is_featured, is_sold_out_manual_override
) VALUES (
  'd5423939-ad39-4de5-8110-5513d7489e13',
  'T-Shirt Oversize Atelier Sfax',
  't-shirt-oversize-atelier-sfax',
  'Jersey de coton lourd 260g, typographie atelier discrète',
  'T-shirt à la coupe ample et tombé lourd, confectionné en jersey de coton dense 260g. Col ras-du-cou robuste et micro-typographie inspirée des inscriptions de patronnage d''atelier.',
  '100% Coton peigné cardé lourd (260 g/m²)',
  'Lavage en machine à 30°C sur l''envers. Repasser à température moyenne.',
  'Coupe oversize contemporaine aux épaules tombantes.',
  125,
  NULL,
  (SELECT id FROM public.categories WHERE slug = 'homme' LIMIT 1),
  'Polos & Mailles',
  true,
  true,
  false,
  true,
  false
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  materials = EXCLUDED.materials,
  care = EXCLUDED.care,
  fit = EXCLUDED.fit,
  is_published = EXCLUDED.is_published,
  is_sold_out_manual_override = EXCLUDED.is_sold_out_manual_override;


INSERT INTO public.collection_products (collection_id, product_id, display_order)
VALUES (
  (SELECT id FROM public.collections WHERE slug = 'atelier-urbain' LIMIT 1),
  'd5423939-ad39-4de5-8110-5513d7489e13',
  1
)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6ae24f19-7ba4-4304-846f-7f47e512136e', 'd5423939-ad39-4de5-8110-5513d7489e13', '/images/products/07231523250-A7M.webp', 'T-Shirt Oversize Atelier Sfax', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0f99dddc-86c0-425d-8080-6d8186425d50', 'd5423939-ad39-4de5-8110-5513d7489e13', '/images/products/07231523250-A6M.webp', 'T-Shirt Oversize Atelier Sfax', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a5011696-4efc-489c-8c38-5bb8a9037199', 'd5423939-ad39-4de5-8110-5513d7489e13', '/images/products/07231523250-A2M.webp', 'T-Shirt Oversize Atelier Sfax', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('348ac1a1-bc00-49fd-85dc-30cad820bc8d', 'd5423939-ad39-4de5-8110-5513d7489e13', '/images/products/07231523250-A20M.webp', 'T-Shirt Oversize Atelier Sfax', false, 4)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'd5423939-ad39-4de5-8110-5513d7489e13', id, true
FROM public.sizes
WHERE code = 'F-S'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '6fa62266-022f-4afa-8646-b41f06f336cd',
  'd5423939-ad39-4de5-8110-5513d7489e13',
  s.id,
  c.id,
  'AILYS-T-SHIRT-OV-S-BLA',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-S' AND c.name = 'Blanc Craie'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'd5423939-ad39-4de5-8110-5513d7489e13', id, true
FROM public.sizes
WHERE code = 'F-M'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  'c9936f68-019e-4606-8ced-efbf5113f8de',
  'd5423939-ad39-4de5-8110-5513d7489e13',
  s.id,
  c.id,
  'AILYS-T-SHIRT-OV-M-BLA',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-M' AND c.name = 'Blanc Craie'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'd5423939-ad39-4de5-8110-5513d7489e13', id, true
FROM public.sizes
WHERE code = 'F-L'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  'c8e970f4-0c1c-419f-8b2b-50aa14d814ca',
  'd5423939-ad39-4de5-8110-5513d7489e13',
  s.id,
  c.id,
  'AILYS-T-SHIRT-OV-L-BLA',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-L' AND c.name = 'Blanc Craie'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'd5423939-ad39-4de5-8110-5513d7489e13', id, true
FROM public.sizes
WHERE code = 'F-XL'
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO public.product_variants (id, product_id, size_id, color_id, sku, stock_quantity, low_stock_threshold, is_active)
SELECT 
  '8a9f66b7-b2a8-4e9b-8af8-4c07e9424762',
  'd5423939-ad39-4de5-8110-5513d7489e13',
  s.id,
  c.id,
  'AILYS-T-SHIRT-OV-XL-BLA',
  15,
  2,
  true
FROM public.sizes s
CROSS JOIN public.colors c
WHERE s.code = 'F-XL' AND c.name = 'Blanc Craie'
ON CONFLICT (sku) DO NOTHING;


-- 3. MEDIA ASSETS

INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '151f8789-275f-423d-8cfa-8dd452baf934',
  '01_ailys_hero.webp',
  '01_ailys_hero.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/01_ailys_hero.webp',
  'media',
  '{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":40},"objectPosition":"50% 40%","aspectRatio":"16:9","desktop":{"zoom":1,"focalPoint":{"x":50,"y":40}},"mobile":{"zoom":1.1,"focalPoint":{"x":50,"y":35}}}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '958cb1cf-0fa5-4de4-8ce1-200674652855',
  '02_ailys_portrait.webp',
  '02_ailys_portrait.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/02_ailys_portrait.webp',
  'media',
  '{"zoom":1,"rotate":0,"focalPoint":{"x":49,"y":36},"objectPosition":"49% 36%","aspectRatio":"16:9","desktop":{"zoom":1,"rotate":0,"focalPoint":{"x":49,"y":36},"objectPosition":"49% 36%","aspectRatio":"16:9"},"mobile":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":35},"objectPosition":"50% 50%","aspectRatio":"3:4"}}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '45a643b2-4e5b-44c6-882d-090e39f1ce98',
  '03_the_silhouette.webp',
  '03_the_silhouette.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/03_the_silhouette.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  'a8f73a27-4c92-428f-88d1-db253661bd6a',
  '04_craftsmanship_detail.webp',
  '04_craftsmanship_detail.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/04_craftsmanship_detail.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '9a2026f9-e79f-4d5f-8b61-c7c0e0b56bc3',
  '05_movement.webp',
  '05_movement.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/05_movement.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  'fa060e32-1a13-46cb-8f0d-583ab9e7670a',
  '06_tunisian_architecture.webp',
  '06_tunisian_architecture.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/06_tunisian_architecture.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '052f7f2c-79e1-4b99-8957-15f64bb1b942',
  '07_minimal_studio.webp',
  '07_minimal_studio.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/07_minimal_studio.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '96c56f6b-84ce-4910-804b-63cc82d80630',
  '08_mediterranean_street.webp',
  '08_mediterranean_street.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/08_mediterranean_street.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '40d2d7b0-c074-4b7c-8a01-6886dca0d87b',
  '09_ailys_still_life.webp',
  '09_ailys_still_life.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/09_ailys_still_life.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '209fd0f5-3016-42bb-88e4-64eabbdaa9b5',
  '10_the_close_up.webp',
  '10_the_close_up.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/10_the_close_up.webp',
  'media',
  '{"zoom":1,"rotate":0,"focalPoint":{"x":60,"y":28},"objectPosition":"60% 28%","aspectRatio":"16:9","desktop":{"zoom":1,"rotate":0,"focalPoint":{"x":60,"y":28},"objectPosition":"60% 28%","aspectRatio":"16:9"},"mobile":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"3:4"}}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  'bd639bd2-ec79-4db9-8113-a5d5e4ee19c5',
  '11_ailys_atmosphere.webp',
  '11_ailys_atmosphere.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/11_ailys_atmosphere.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '81039c63-ffa0-4e33-81cb-e23a6492129b',
  '12_the_finale_cta.webp',
  '12_the_finale_cta.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/12_the_finale_cta.webp',
  'media',
  '{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"16:9","desktop":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"16:9"},"mobile":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"3:4"}}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  'f53454ea-87bd-466e-8572-17c1c12fc1ac',
  'man-collection.webp',
  'man-collection.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/man-collection.webp',
  'media',
  '{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"16:9","desktop":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"16:9"},"mobile":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"3:4"}}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '4120e80d-27b4-4c74-81ca-8992e8079dd5',
  'children-collection.webp',
  'children-collection.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/editorial/children-collection.webp',
  'media',
  '{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":15},"objectPosition":"50% 15%","aspectRatio":"16:9","desktop":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":15},"objectPosition":"50% 15%","aspectRatio":"16:9"},"mobile":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"3:4"}}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '59409dbe-c166-4a98-87ea-1ea34d1c2a41',
  'logo.svg',
  'logo.svg',
  'image/svg+xml',
  102400,
  1920,
  1080,
  '/logo.svg',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '314cf645-89a5-4dc5-82eb-68b892e662fd',
  '07231523250-A20M.webp',
  '07231523250-A20M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07231523250-A20M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '0b779a1b-2681-4f3b-8e8d-be43dc0f28a8',
  '07231523250-A2M.webp',
  '07231523250-A2M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07231523250-A2M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '8f3a85fb-8fb8-4278-8463-f36728c72163',
  '07231523250-A6M.webp',
  '07231523250-A6M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07231523250-A6M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '38020b7f-5f97-4d1b-8c57-82f701480cf5',
  '07231523250-A7M.webp',
  '07231523250-A7M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07231523250-A7M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  'e277fda6-1165-428d-8c6a-7165f6dc5cf4',
  '07460319401-A20M.webp',
  '07460319401-A20M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07460319401-A20M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '2b1c15b7-b458-4b16-8467-1f1eca0fc9d9',
  '07460319401-A2M.webp',
  '07460319401-A2M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07460319401-A2M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  'bd4693fe-d8b4-4ecb-8c35-d7621356a6cd',
  '07460319401-A6M.webp',
  '07460319401-A6M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07460319401-A6M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  'e7a63b94-cc56-47e4-85ba-2bbcde978c56',
  '07460319401-A7M.webp',
  '07460319401-A7M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07460319401-A7M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '919d981b-2208-455a-8c4d-0f5cfaa687bd',
  '07460319700-A20M.webp',
  '07460319700-A20M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07460319700-A20M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '5fea74bc-dc2c-457e-8794-70d94749b86c',
  '07460319700-A2M.webp',
  '07460319700-A2M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07460319700-A2M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  'a40d94b2-b615-4421-867c-302e50680bae',
  '07460319700-A6M.webp',
  '07460319700-A6M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07460319700-A6M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '06651230-649a-4ed4-85d3-79451272671a',
  '07460319700-A7M.webp',
  '07460319700-A7M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07460319700-A7M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '9faaad2f-58b0-4c42-80ad-2f0788a90931',
  '07670434700-A2M.webp',
  '07670434700-A2M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07670434700-A2M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '31ad4cd8-d102-4d2e-8e5a-8fcb4ee2b8db',
  '07670434700-A6M.webp',
  '07670434700-A6M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07670434700-A6M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '1dd63279-9ab4-4c18-8b77-7f4c7094a082',
  '07670434700-M.webp',
  '07670434700-M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07670434700-M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  'cd0bd0b7-d57d-45f6-8a58-4765d97e661a',
  '07721518800-A4M.webp',
  '07721518800-A4M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721518800-A4M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '0097c699-2a4c-43fa-8bd9-dcd3391cf17b',
  '07721518800-M.webp',
  '07721518800-M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721518800-M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '606c14d3-6bab-4bab-8f67-ff99e305fb8d',
  '07721522800-A20M.webp',
  '07721522800-A20M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721522800-A20M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '40cee3a5-7af6-4be3-8323-c684d1246857',
  '07721522800-A6M.webp',
  '07721522800-A6M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721522800-A6M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '6c46c29f-72bc-4ca5-8322-07e0d5e9d980',
  '07721522800-A8M.webp',
  '07721522800-A8M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721522800-A8M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  'b1449f8c-045e-413b-87cc-3f79c6556143',
  '07721918700-A20M.webp',
  '07721918700-A20M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721918700-A20M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  'a5840f66-f26d-46ee-86c9-ae7db4c600d2',
  '07721918700-A2M.webp',
  '07721918700-A2M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721918700-A2M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '484a8b85-c26b-4c2f-89e3-e8edd77d2f92',
  '07721918700-A6M.webp',
  '07721918700-A6M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721918700-A6M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '09181692-49de-42c9-8ee0-bedfd93aec9a',
  '07721918700-A8M.webp',
  '07721918700-A8M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721918700-A8M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '39065cd5-2ab4-46c9-8b56-4bdc2194ce79',
  '07721918700-M.webp',
  '07721918700-M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721918700-M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '28f46ce8-08dc-4393-84ad-4fb9e7cdb0a7',
  '07721918803-A20M.webp',
  '07721918803-A20M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721918803-A20M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  'ba1aba4a-e330-45c7-8de4-8fdc0804ed47',
  '07721918803-A5M.webp',
  '07721918803-A5M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721918803-A5M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '537eb1f2-1872-4def-8135-b63203273bc7',
  '07721918803-A6M.webp',
  '07721918803-A6M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721918803-A6M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO public.media (id, filename, original_name, mime_type, size_bytes, width, height, public_url, bucket_name, transform_metadata)
VALUES (
  '4b3a7a0b-435a-4d7d-8b2e-a3dfacc02cc5',
  '07721918803-M.webp',
  '07721918803-M.webp',
  'image/webp',
  102400,
  1920,
  1080,
  '/images/products/07721918803-M.webp',
  'media',
  '{}'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- 4. HOMEPAGE SECTIONS & CONTENT

INSERT INTO public.homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
VALUES (
  '3838f26b-004f-49a7-8d5a-1547c0550c78',
  'hero',
  'L''Élégance Contemporaine au Quotidien',
  'Silhouettes sport-chic façonnées par la lumière tunisienne',
  1,
  true
)
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  display_order = EXCLUDED.display_order,
  is_enabled = EXCLUDED.is_enabled;


INSERT INTO public.homepage_content (
  section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  '3838f26b-004f-49a7-8d5a-1547c0550c78',
  'main_content',
  'Des coupes épurées et confortables pensées pour accompagner le rythme de la femme moderne avec assurance et simplicité.',
  '/images/editorial/01_ailys_hero.webp',
  '/images/editorial/02_ailys_portrait.webp',
  '{"badge":"Nouvelle Collection","ctaText":"DÉCOUVRIR AÏLYS","ctaLink":"#nouvelle-collection","secondaryCtaText":"","secondaryCtaLink":"","desktopImageTransform":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":40},"objectPosition":"50% 40%","aspectRatio":"16:9","desktop":{"zoom":1,"focalPoint":{"x":50,"y":40}},"mobile":{"zoom":1.1,"focalPoint":{"x":50,"y":35}}},"mobileImageTransform":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":35},"objectPosition":"50% 35%","aspectRatio":"3:4"}}'::jsonb
)
ON CONFLICT (section_id, content_key) DO UPDATE SET
  content_value = EXCLUDED.content_value,
  desktop_image_url = EXCLUDED.desktop_image_url,
  mobile_image_url = EXCLUDED.mobile_image_url,
  metadata = EXCLUDED.metadata;


INSERT INTO public.homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
VALUES (
  'fcf72901-6eb7-479e-8aa9-d8f391e3e625',
  'new_collection',
  'Nouvelle Collection',
  'Matières douces, coupes nettes et confort contemporain',
  2,
  true
)
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  display_order = EXCLUDED.display_order,
  is_enabled = EXCLUDED.is_enabled;


INSERT INTO public.homepage_content (
  section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  'fcf72901-6eb7-479e-8aa9-d8f391e3e625',
  'main_content',
  'Des pièces faciles à vivre au tombé impeccable, où la pureté des lignes rencontre le confort des matières naturelles.',
  '/images/editorial/03_the_silhouette.webp',
  '/images/editorial/03_the_silhouette.webp',
  '{"badge":"Nouvelle Collection","ctaText":"Découvrir les collections","ctaLink":"/collections","desktopImageTransform":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":35},"objectPosition":"50% 35%","aspectRatio":"3:4"},"mobileImageTransform":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":35},"objectPosition":"50% 35%","aspectRatio":"3:4"},"selectedProductSlugs":["veste-boxy-denim-indigo-brut","blouson-nappa-noir-silhouette","veste-boxy-serge-kaki-ombre","veste-zippee-scuba-noir-onyx"]}'::jsonb
)
ON CONFLICT (section_id, content_key) DO UPDATE SET
  content_value = EXCLUDED.content_value,
  desktop_image_url = EXCLUDED.desktop_image_url,
  mobile_image_url = EXCLUDED.mobile_image_url,
  metadata = EXCLUDED.metadata;


INSERT INTO public.homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
VALUES (
  'dde1d97a-7dd4-4bd0-8467-4a4a163d95ac',
  'philosophy',
  'L''Allure AÏLYS',
  '« Quiet confidence, shaped by Tunisian light. »',
  3,
  true
)
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  display_order = EXCLUDED.display_order,
  is_enabled = EXCLUDED.is_enabled;


INSERT INTO public.homepage_content (
  section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  'dde1d97a-7dd4-4bd0-8467-4a4a163d95ac',
  'main_content',
  'Une élégance sans artifice. Des volumes équilibrés et des matières agréables à porter pour traverser les journées actives avec aisance.',
  '/images/editorial/06_tunisian_architecture.webp',
  '/images/editorial/06_tunisian_architecture.webp',
  '{"badge":"La Philosophie","ctaText":"L''Esprit AÏLYS","ctaLink":"/a-propos","desktopImageTransform":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"original"},"mobileImageTransform":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"original"}}'::jsonb
)
ON CONFLICT (section_id, content_key) DO UPDATE SET
  content_value = EXCLUDED.content_value,
  desktop_image_url = EXCLUDED.desktop_image_url,
  mobile_image_url = EXCLUDED.mobile_image_url,
  metadata = EXCLUDED.metadata;


INSERT INTO public.homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
VALUES (
  '33014feb-9b4a-4786-8eba-c4312a5e10e3',
  'craftsmanship',
  'Confection & Matières',
  'Matières sélectionnées, coupes précises et finitions soignées',
  4,
  true
)
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  display_order = EXCLUDED.display_order,
  is_enabled = EXCLUDED.is_enabled;


INSERT INTO public.homepage_content (
  section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  '33014feb-9b4a-4786-8eba-c4312a5e10e3',
  'main_content',
  'Chaque silhouette AÏLYS est confectionnée en Tunisie avec un souci constant du détail, de la qualité des coutures et du confort d''usage.',
  '/images/editorial/04_craftsmanship_detail.webp',
  '/images/editorial/04_craftsmanship_detail.webp',
  '{"badge":"Confection & Matières","ctaText":"En savoir plus","ctaLink":"/a-propos","desktopImageTransform":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"1:1"},"mobileImageTransform":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"1:1"}}'::jsonb
)
ON CONFLICT (section_id, content_key) DO UPDATE SET
  content_value = EXCLUDED.content_value,
  desktop_image_url = EXCLUDED.desktop_image_url,
  mobile_image_url = EXCLUDED.mobile_image_url,
  metadata = EXCLUDED.metadata;


INSERT INTO public.homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
VALUES (
  'dbb3fa41-ef8c-4cbc-83ad-63cf61d63693',
  'about',
  'Aïcha & la Fleur de Lys',
  'L''union du prénom et de la fleur',
  5,
  true
)
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  display_order = EXCLUDED.display_order,
  is_enabled = EXCLUDED.is_enabled;


INSERT INTO public.homepage_content (
  section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  'dbb3fa41-ef8c-4cbc-83ad-63cf61d63693',
  'main_content',
  'Le nom AÏLYS réunit Aïcha, la fille de la fondatrice, et la fleur de lys, sa fleur de prédilection. Une histoire de transmission et d''élégance naturelle.',
  '/images/editorial/07_minimal_studio.webp',
  '/images/editorial/07_minimal_studio.webp',
  '{"badge":"Origine du Nom","ctaText":"Découvrir l''histoire","ctaLink":"/a-propos","desktopImageTransform":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":35},"objectPosition":"50% 35%","aspectRatio":"3:4"},"mobileImageTransform":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":35},"objectPosition":"50% 35%","aspectRatio":"3:4"}}'::jsonb
)
ON CONFLICT (section_id, content_key) DO UPDATE SET
  content_value = EXCLUDED.content_value,
  desktop_image_url = EXCLUDED.desktop_image_url,
  mobile_image_url = EXCLUDED.mobile_image_url,
  metadata = EXCLUDED.metadata;


INSERT INTO public.homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
VALUES (
  'cf844a13-1e7d-439c-88b7-23696d5a1a25',
  'final_cta',
  'Découvrir la Collection',
  'Une allure contemporaine pensée pour le quotidien',
  6,
  true
)
ON CONFLICT (section_key) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  display_order = EXCLUDED.display_order,
  is_enabled = EXCLUDED.is_enabled;


INSERT INTO public.homepage_content (
  section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  'cf844a13-1e7d-439c-88b7-23696d5a1a25',
  'main_content',
  'Explorez notre sélection de pièces pour Femme, Homme et Enfant, alliant confort et élégance sobre.',
  '/images/editorial/12_the_finale_cta.webp',
  '/images/editorial/12_the_finale_cta.webp',
  '{"badge":"L''Univers AÏLYS","ctaText":"Découvrir la boutique","ctaLink":"/shop","desktopImageTransform":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"16:9"},"mobileImageTransform":{"zoom":1,"rotate":0,"focalPoint":{"x":50,"y":50},"objectPosition":"50% 50%","aspectRatio":"3:4"}}'::jsonb
)
ON CONFLICT (section_id, content_key) DO UPDATE SET
  content_value = EXCLUDED.content_value,
  desktop_image_url = EXCLUDED.desktop_image_url,
  mobile_image_url = EXCLUDED.mobile_image_url,
  metadata = EXCLUDED.metadata;


-- 5. SIZE GUIDES
INSERT INTO public.size_guides (id, category_id, title, description, how_to_measure)
SELECT 
  '5101fb1a-dd96-40e5-8db2-e794364001a9',
  c.id,
  'Guide des Tailles AÏLYS — Silhouette Femme',
  'Nos silhouettes sont calibrées selon les standards de confection méditerranéens.',
  'Mesurez au point le plus fort de la poitrine, le creux de la taille et le point le plus large des hanches.'
FROM public.categories c
WHERE c.slug = 'femme'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.size_guide_rows (size_guide_id, size_code, chest_min_cm, chest_max_cm, waist_min_cm, waist_max_cm, hips_min_cm, hips_max_cm, display_order)
VALUES
  ('5101fb1a-dd96-40e5-8db2-e794364001a9', '36 (XS)', 82.0, 86.0, 62.0, 66.0, 88.0, 92.0, 1),
  ('5101fb1a-dd96-40e5-8db2-e794364001a9', '38 (S)', 86.0, 90.0, 66.0, 70.0, 92.0, 96.0, 2),
  ('5101fb1a-dd96-40e5-8db2-e794364001a9', '40 (M)', 90.0, 94.0, 70.0, 74.0, 96.0, 100.0, 3),
  ('5101fb1a-dd96-40e5-8db2-e794364001a9', '42 (L)', 94.0, 98.0, 74.0, 78.0, 100.0, 104.0, 4),
  ('5101fb1a-dd96-40e5-8db2-e794364001a9', '44 (XL)', 98.0, 104.0, 78.0, 84.0, 104.0, 110.0, 5)
ON CONFLICT DO NOTHING;
