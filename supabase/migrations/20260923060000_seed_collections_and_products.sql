-- =============================================================================
-- AÏLYS PRODUCTION MIGRATION: 06 - REAL CATALOG & COLLECTIONS SEED
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


-- 2. PRODUCTS, IMAGES & VARIANTS

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
WHERE code = 'H-S'
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
WHERE s.code = 'H-S' AND c.name = 'Noir Onyx'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '53d57dbd-e234-45b6-8298-5a92054c3346', id, true
FROM public.sizes
WHERE code = 'H-M'
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
WHERE s.code = 'H-M' AND c.name = 'Noir Onyx'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '53d57dbd-e234-45b6-8298-5a92054c3346', id, true
FROM public.sizes
WHERE code = 'H-L'
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
WHERE s.code = 'H-L' AND c.name = 'Noir Onyx'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '53d57dbd-e234-45b6-8298-5a92054c3346', id, true
FROM public.sizes
WHERE code = 'H-XL'
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
WHERE s.code = 'H-XL' AND c.name = 'Noir Onyx'
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
WHERE code = 'H-S'
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
WHERE s.code = 'H-S' AND c.name = 'Grenat Profond'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'cd671668-16f4-4dc6-82c0-baa3d21aad30', id, true
FROM public.sizes
WHERE code = 'H-M'
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
WHERE s.code = 'H-M' AND c.name = 'Grenat Profond'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'cd671668-16f4-4dc6-82c0-baa3d21aad30', id, true
FROM public.sizes
WHERE code = 'H-L'
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
WHERE s.code = 'H-L' AND c.name = 'Grenat Profond'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'cd671668-16f4-4dc6-82c0-baa3d21aad30', id, true
FROM public.sizes
WHERE code = 'H-XL'
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
WHERE s.code = 'H-XL' AND c.name = 'Grenat Profond'
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
WHERE code = 'H-S'
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
WHERE s.code = 'H-S' AND c.name = 'Gris Chiné'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '747dc74e-00cb-433b-8810-939a506408b4', id, true
FROM public.sizes
WHERE code = 'H-M'
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
WHERE s.code = 'H-M' AND c.name = 'Gris Chiné'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '747dc74e-00cb-433b-8810-939a506408b4', id, true
FROM public.sizes
WHERE code = 'H-L'
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
WHERE s.code = 'H-L' AND c.name = 'Gris Chiné'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT '747dc74e-00cb-433b-8810-939a506408b4', id, true
FROM public.sizes
WHERE code = 'H-XL'
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
WHERE s.code = 'H-XL' AND c.name = 'Gris Chiné'
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
WHERE code = 'H-S'
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
WHERE s.code = 'H-S' AND c.name = 'Blanc Craie'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'd5423939-ad39-4de5-8110-5513d7489e13', id, true
FROM public.sizes
WHERE code = 'H-M'
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
WHERE s.code = 'H-M' AND c.name = 'Blanc Craie'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'd5423939-ad39-4de5-8110-5513d7489e13', id, true
FROM public.sizes
WHERE code = 'H-L'
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
WHERE s.code = 'H-L' AND c.name = 'Blanc Craie'
ON CONFLICT (sku) DO NOTHING;


INSERT INTO public.product_sizes (product_id, size_id, is_available)
SELECT 'd5423939-ad39-4de5-8110-5513d7489e13', id, true
FROM public.sizes
WHERE code = 'H-XL'
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
WHERE s.code = 'H-XL' AND c.name = 'Blanc Craie'
ON CONFLICT (sku) DO NOTHING;


-- 3. SIZE GUIDES
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

INSERT INTO public.size_guides (id, category_id, title, description, how_to_measure)
SELECT 
  '10b56799-555a-4ddc-8692-43bd3f9ad7f7',
  c.id,
  'Guide des Tailles AÏLYS — Silhouette Homme',
  'Confection structurée et aisance de mouvement pour les silhouettes masculines.',
  'Mesurez le tour de poitrine bien horizontalement, le tour de taille au niveau du nombril et le tour de hanches.'
FROM public.categories c
WHERE c.slug = 'homme'
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.size_guide_rows (size_guide_id, size_code, chest_min_cm, chest_max_cm, waist_min_cm, waist_max_cm, hips_min_cm, hips_max_cm, display_order)
VALUES
  ('10b56799-555a-4ddc-8692-43bd3f9ad7f7', 'S', 90.0, 95.0, 78.0, 83.0, 92.0, 97.0, 1),
  ('10b56799-555a-4ddc-8692-43bd3f9ad7f7', 'M', 96.0, 101.0, 84.0, 89.0, 98.0, 103.0, 2),
  ('10b56799-555a-4ddc-8692-43bd3f9ad7f7', 'L', 102.0, 107.0, 90.0, 95.0, 104.0, 109.0, 3),
  ('10b56799-555a-4ddc-8692-43bd3f9ad7f7', 'XL', 108.0, 114.0, 96.0, 102.0, 110.0, 116.0, 4)
ON CONFLICT DO NOTHING;
