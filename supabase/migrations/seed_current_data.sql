-- =============================================================================
-- AÏLYS SEED DATA GENERATED FROM local admin-data.json
-- Generated at: 2026-09-22T23:35:48.743Z
-- =============================================================================

-- 1. INITIAL SUPER ADMIN USER

INSERT INTO admin_users (id, email, password_hash, full_name, role_id, is_active)
SELECT 
  '32c65c46-f6fc-4f92-810d-d76c2b093cf2',
  'direction@ailys.tn',
  'bf190942467c02dcb11293b4aeba8879347b794538030ff86a00de2ce8c178c8',
  'Direction AÏLYS',
  r.id,
  true
FROM roles r
WHERE r.name = 'SUPER_ADMIN'
ON CONFLICT (email) DO NOTHING;

-- 2. TAXONOMY: CATEGORIES

INSERT INTO categories (id, slug, name, gender, tagline, description, hero_image_url, display_order)
VALUES ('9eff9546-53c7-4b9e-826c-6a3965bcc869', 'femme', 'Femme', 'femme', 'L''allure sport-chic au féminin', 'Des tailleurs déstructurés en lin lavé aux robes fluides coupées pour la liberté de mouvement.', '/images/campaign/hero-editorial-woman.jpg', 1)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, description = EXCLUDED.description;


INSERT INTO categories (id, slug, name, gender, tagline, description, hero_image_url, display_order)
VALUES ('44d8f840-3661-4788-8884-90dc8b3bfd9b', 'homme', 'Homme', 'homme', 'Coupes épurées & matières nobles', 'L''équilibre précis entre confection tailleur et aisance sportive.', '/images/campaign/man-sport-chic.jpg', 2)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, description = EXCLUDED.description;


INSERT INTO categories (id, slug, name, gender, tagline, description, hero_image_url, display_order)
VALUES ('3884c33a-7d84-48ae-8a7e-cbb5de8b8d0d', 'enfant', 'Enfant', 'enfant', 'L''élégance familiale partagée', 'Conçus avec les mêmes étoffes nobles et finitions artisanales que les pièces adultes.', '/images/campaign/girl-sport-chic.jpg', 3)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, description = EXCLUDED.description;

-- 3. TAXONOMY: SIZES

INSERT INTO sizes (id, name, code, gender, display_order)
VALUES ('4fd47fd2-d240-4f91-8a5c-dd31eced0c74', '36 (XS)', 'F-36', 'femme', 1)
ON CONFLICT (code) DO NOTHING;


INSERT INTO sizes (id, name, code, gender, display_order)
VALUES ('15b88638-3622-4827-84ca-7d732dc2e455', '38 (S)', 'F-38', 'femme', 2)
ON CONFLICT (code) DO NOTHING;


INSERT INTO sizes (id, name, code, gender, display_order)
VALUES ('cba014ba-3f9a-4731-8422-999c580c2a7d', '40 (M)', 'F-40', 'femme', 3)
ON CONFLICT (code) DO NOTHING;


INSERT INTO sizes (id, name, code, gender, display_order)
VALUES ('36a38839-85b3-4eb3-8321-1fe87c113007', '42 (L)', 'F-42', 'femme', 4)
ON CONFLICT (code) DO NOTHING;


INSERT INTO sizes (id, name, code, gender, display_order)
VALUES ('fcb25891-f3d7-4b40-8632-aa9c0e4c1972', '44 (XL)', 'F-44', 'femme', 5)
ON CONFLICT (code) DO NOTHING;


INSERT INTO sizes (id, name, code, gender, display_order)
VALUES ('5426177f-f8ea-4d41-84bb-5d122624c15c', 'S', 'H-S', 'homme', 6)
ON CONFLICT (code) DO NOTHING;


INSERT INTO sizes (id, name, code, gender, display_order)
VALUES ('87eb5a2d-5178-4c93-8701-77b491d8147b', 'M', 'H-M', 'homme', 7)
ON CONFLICT (code) DO NOTHING;


INSERT INTO sizes (id, name, code, gender, display_order)
VALUES ('cb9dc36a-ef4f-43f8-8a16-27d124b0ab3d', 'L', 'H-L', 'homme', 8)
ON CONFLICT (code) DO NOTHING;


INSERT INTO sizes (id, name, code, gender, display_order)
VALUES ('68ea88c5-a8cd-4734-8a0b-ce8a8e57ee48', 'XL', 'H-XL', 'homme', 9)
ON CONFLICT (code) DO NOTHING;


INSERT INTO sizes (id, name, code, gender, display_order)
VALUES ('d2a5c4f7-c42b-4654-80c0-3da9c3ef98ba', 'XXL', 'H-XXL', 'homme', 10)
ON CONFLICT (code) DO NOTHING;

-- 4. TAXONOMY: COLORS

INSERT INTO colors (id, name, hex, display_order)
VALUES ('60ec5893-a990-4e77-808a-c8665c6b30d9', 'Indigo Brut', '#1C2833', 1)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;


INSERT INTO colors (id, name, hex, display_order)
VALUES ('c8cdbb76-687d-440e-8fe6-01f8b69b7334', 'Noir Nappa', '#111111', 2)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;


INSERT INTO colors (id, name, hex, display_order)
VALUES ('7a6c248d-5a1b-4ddb-8097-072218606516', 'Kaki Ombre', '#5C5645', 3)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;


INSERT INTO colors (id, name, hex, display_order)
VALUES ('e5913e48-1cff-48a4-8e4f-0accc0e37d83', 'Noir Onyx', '#0E0E10', 4)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;


INSERT INTO colors (id, name, hex, display_order)
VALUES ('5f125ae1-f18e-4635-830c-e6cb6b2ced09', 'Grenat Profond', '#38171E', 5)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;


INSERT INTO colors (id, name, hex, display_order)
VALUES ('be5ec721-882c-470e-86dc-a5e49f9bdad6', 'Gris Chiné', '#A8A8AA', 6)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;


INSERT INTO colors (id, name, hex, display_order)
VALUES ('0050f3b6-3514-4e1a-82f8-29aab61859e0', 'Blanc Craie', '#F7F6F2', 7)
ON CONFLICT (name) DO UPDATE SET hex = EXCLUDED.hex;

-- 5. COLLECTIONS

INSERT INTO collections (id, slug, title, subtitle, description, story, hero_desktop_image, hero_mobile_image, is_capsule, is_published, display_order)
VALUES (
  'aa9f95b6-453a-45fd-81cd-be14e1287ca2',
  'atelier-urbain',
  'L''Atelier Urbain',
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

-- 6. PRODUCTS & ASSOCIATED TABLES

INSERT INTO products (
  id, slug, name, subtitle, description, price, sale_price, category_id, primary_collection_id,
  sub_category, materials, care, fit, is_published, is_featured, is_new, is_sold_out
) VALUES (
  '93820d0f-cccd-43fb-84e4-b7f52db6748e',
  'veste-boxy-denim-indigo-brut',
  'Veste Boxy Denim Indigo Brut',
  'Coupe courte architecturale en denim selvedge d''atelier',
  'Veste courte à la coupe boxy affirmée, confectionnée en denim de coton brut indigo profond. Découpes structurées inspirées du vestiaire utilitaire d''atelier, boutons métalliques argentés et poches plaquées amples.',
  280,
  NULL,
  '9eff9546-53c7-4b9e-826c-6a3965bcc869',
  'aa9f95b6-453a-45fd-81cd-be14e1287ca2',
  'Vestes & Manteaux',
  '100% Coton denim brut selvedge 12.5 oz de haute tenue',
  'Lavage à froid sur l''envers. Séchage à plat.',
  'Coupe boxy contemporaine légèrement cropped.',
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
  is_featured = EXCLUDED.is_featured,
  is_sold_out = EXCLUDED.is_sold_out;


INSERT INTO collection_products (collection_id, product_id, display_order)
VALUES ('aa9f95b6-453a-45fd-81cd-be14e1287ca2', '93820d0f-cccd-43fb-84e4-b7f52db6748e', 1)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('40636841-735e-4345-8639-cdd6d713783f', '93820d0f-cccd-43fb-84e4-b7f52db6748e', '/images/products/07460319401-A7M.webp', 'Veste Boxy Denim Indigo Brut', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('4b379f7c-f7bc-4d04-8664-6102a92899a3', '93820d0f-cccd-43fb-84e4-b7f52db6748e', '/images/products/07460319401-A6M.webp', 'Veste Boxy Denim Indigo Brut', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('71598437-595c-4aa0-81d8-9b0fafb1736a', '93820d0f-cccd-43fb-84e4-b7f52db6748e', '/images/products/07460319401-A2M.webp', 'Veste Boxy Denim Indigo Brut', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9acf5b36-7b91-4e7a-8951-f886f9747b51', '93820d0f-cccd-43fb-84e4-b7f52db6748e', '/images/products/07460319401-A20M.webp', 'Veste Boxy Denim Indigo Brut', false, 4)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('93820d0f-cccd-43fb-84e4-b7f52db6748e', '4fd47fd2-d240-4f91-8a5c-dd31eced0c74', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('183a6958-5aea-4e7f-8f11-2ca394399ea8', '93820d0f-cccd-43fb-84e4-b7f52db6748e', '4fd47fd2-d240-4f91-8a5c-dd31eced0c74', '60ec5893-a990-4e77-808a-c8665c6b30d9', 'AILYS-VESTE-BOXY-36-IND', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('93820d0f-cccd-43fb-84e4-b7f52db6748e', '15b88638-3622-4827-84ca-7d732dc2e455', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('12f55c3c-04f0-4d2d-87d4-280ad36e4d5a', '93820d0f-cccd-43fb-84e4-b7f52db6748e', '15b88638-3622-4827-84ca-7d732dc2e455', '60ec5893-a990-4e77-808a-c8665c6b30d9', 'AILYS-VESTE-BOXY-38-IND', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('93820d0f-cccd-43fb-84e4-b7f52db6748e', 'cba014ba-3f9a-4731-8422-999c580c2a7d', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('6f7a6368-a934-4c13-8348-3dffb27cc325', '93820d0f-cccd-43fb-84e4-b7f52db6748e', 'cba014ba-3f9a-4731-8422-999c580c2a7d', '60ec5893-a990-4e77-808a-c8665c6b30d9', 'AILYS-VESTE-BOXY-40-IND', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('93820d0f-cccd-43fb-84e4-b7f52db6748e', '36a38839-85b3-4eb3-8321-1fe87c113007', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('3bead850-4916-4bd8-8b81-ce1796e84b5f', '93820d0f-cccd-43fb-84e4-b7f52db6748e', '36a38839-85b3-4eb3-8321-1fe87c113007', '60ec5893-a990-4e77-808a-c8665c6b30d9', 'AILYS-VESTE-BOXY-42-IND', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO products (
  id, slug, name, subtitle, description, price, sale_price, category_id, primary_collection_id,
  sub_category, materials, care, fit, is_published, is_featured, is_new, is_sold_out
) VALUES (
  'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec',
  'blouson-nappa-noir-silhouette',
  'Blouson Nappa Noir Silhouette',
  'Esprit aviateur contemporain en cuir nappa ultra souple',
  'Blouson zippé en cuir nappa ultra souple au grain lisse velouté. Col chemise franc, poignets et ourlet bas élastiqués pour un effet blousant très chic. Pièce maîtresse de la saison.',
  395,
  NULL,
  '9eff9546-53c7-4b9e-826c-6a3965bcc869',
  'aa9f95b6-453a-45fd-81cd-be14e1287ca2',
  'Vestes & Manteaux',
  'Cuir nappa végan souple premium, doublure 100% viscose respirante',
  'Nettoyage délicat avec un chiffon doux légèrement humide. Ne pas repasser.',
  'Coupe blousante décontractée avec taille resserrée par élastique.',
  true,
  true,
  false,
  false
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  is_published = EXCLUDED.is_published,
  is_featured = EXCLUDED.is_featured,
  is_sold_out = EXCLUDED.is_sold_out;


INSERT INTO collection_products (collection_id, product_id, display_order)
VALUES ('aa9f95b6-453a-45fd-81cd-be14e1287ca2', 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', 1)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('1281b0a2-20c5-4aca-84a7-2321ac928de2', 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', '/images/products/07670434700-M.webp', 'Blouson Nappa Noir Silhouette', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('898f695b-6f37-4eef-876f-d8b6c89afa2b', 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', '/images/products/07670434700-A6M.webp', 'Blouson Nappa Noir Silhouette', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('3236eeda-eb8b-440a-8a00-49d849561267', 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', '/images/products/07670434700-A2M.webp', 'Blouson Nappa Noir Silhouette', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', '4fd47fd2-d240-4f91-8a5c-dd31eced0c74', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('d880f552-b787-4d69-8114-4680260f5e33', 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', '4fd47fd2-d240-4f91-8a5c-dd31eced0c74', 'c8cdbb76-687d-440e-8fe6-01f8b69b7334', 'AILYS-BLOUSON-NA-36-NOI', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', '15b88638-3622-4827-84ca-7d732dc2e455', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('3cbbba73-c555-43f1-8b5d-234d96e1f281', 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', '15b88638-3622-4827-84ca-7d732dc2e455', 'c8cdbb76-687d-440e-8fe6-01f8b69b7334', 'AILYS-BLOUSON-NA-38-NOI', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', 'cba014ba-3f9a-4731-8422-999c580c2a7d', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('d39f0b54-27d7-4bc1-8aaa-235e8bc0694a', 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', 'cba014ba-3f9a-4731-8422-999c580c2a7d', 'c8cdbb76-687d-440e-8fe6-01f8b69b7334', 'AILYS-BLOUSON-NA-40-NOI', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', '36a38839-85b3-4eb3-8321-1fe87c113007', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('fc8d48b9-5891-40d4-84f1-253759a0b1ee', 'fb2b80a1-262c-4a86-8ed5-0a18d15d1dec', '36a38839-85b3-4eb3-8321-1fe87c113007', 'c8cdbb76-687d-440e-8fe6-01f8b69b7334', 'AILYS-BLOUSON-NA-42-NOI', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO products (
  id, slug, name, subtitle, description, price, sale_price, category_id, primary_collection_id,
  sub_category, materials, care, fit, is_published, is_featured, is_new, is_sold_out
) VALUES (
  '80df78d1-69ea-4fa0-8a85-52965c359e30',
  'veste-boxy-serge-kaki-ombre',
  'Veste Boxy Sergé Kaki Ombre',
  'Sergé de coton teinté en pièce, nuance terre d''ombre',
  'Veste courte en toile sergée de coton lourd lavé. Teinte minérale subtile entre kaki patiné et terre d''ombre. Fermeture à boutons métalliques et coupe structurée confortable.',
  265,
  NULL,
  '9eff9546-53c7-4b9e-826c-6a3965bcc869',
  'aa9f95b6-453a-45fd-81cd-be14e1287ca2',
  'Vestes & Manteaux',
  '100% Coton sergé lourd délavé aux enzymes',
  'Lavage en machine à 30°C. Séchage sur cintre.',
  'Coupe droite déstructurée.',
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
  is_featured = EXCLUDED.is_featured,
  is_sold_out = EXCLUDED.is_sold_out;


INSERT INTO collection_products (collection_id, product_id, display_order)
VALUES ('aa9f95b6-453a-45fd-81cd-be14e1287ca2', '80df78d1-69ea-4fa0-8a85-52965c359e30', 1)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0a19d7db-a26c-4099-8a9e-9b47f23ed965', '80df78d1-69ea-4fa0-8a85-52965c359e30', '/images/products/07460319700-A7M.webp', 'Veste Boxy Sergé Kaki Ombre', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('25b8b824-5203-441e-8283-fd3bb5a4fedc', '80df78d1-69ea-4fa0-8a85-52965c359e30', '/images/products/07460319700-A6M.webp', 'Veste Boxy Sergé Kaki Ombre', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a6973561-94e4-4ac5-820c-49e45553a0f7', '80df78d1-69ea-4fa0-8a85-52965c359e30', '/images/products/07460319700-A2M.webp', 'Veste Boxy Sergé Kaki Ombre', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('9ffd608c-e715-4496-8fdb-3c3326b2fa67', '80df78d1-69ea-4fa0-8a85-52965c359e30', '/images/products/07460319700-A20M.webp', 'Veste Boxy Sergé Kaki Ombre', false, 4)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('80df78d1-69ea-4fa0-8a85-52965c359e30', '4fd47fd2-d240-4f91-8a5c-dd31eced0c74', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('31c8fe56-cfd4-4e1b-811d-d6170ed9d87c', '80df78d1-69ea-4fa0-8a85-52965c359e30', '4fd47fd2-d240-4f91-8a5c-dd31eced0c74', '7a6c248d-5a1b-4ddb-8097-072218606516', 'AILYS-VESTE-BOXY-36-KAK', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('80df78d1-69ea-4fa0-8a85-52965c359e30', '15b88638-3622-4827-84ca-7d732dc2e455', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('2119a391-2655-468e-8344-58e2049c4d10', '80df78d1-69ea-4fa0-8a85-52965c359e30', '15b88638-3622-4827-84ca-7d732dc2e455', '7a6c248d-5a1b-4ddb-8097-072218606516', 'AILYS-VESTE-BOXY-38-KAK', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('80df78d1-69ea-4fa0-8a85-52965c359e30', 'cba014ba-3f9a-4731-8422-999c580c2a7d', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('f8e94120-9179-4711-82d5-9cb1adbd5d54', '80df78d1-69ea-4fa0-8a85-52965c359e30', 'cba014ba-3f9a-4731-8422-999c580c2a7d', '7a6c248d-5a1b-4ddb-8097-072218606516', 'AILYS-VESTE-BOXY-40-KAK', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('80df78d1-69ea-4fa0-8a85-52965c359e30', '36a38839-85b3-4eb3-8321-1fe87c113007', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('aeee2649-e6c3-470e-8b9d-8c7c28907383', '80df78d1-69ea-4fa0-8a85-52965c359e30', '36a38839-85b3-4eb3-8321-1fe87c113007', '7a6c248d-5a1b-4ddb-8097-072218606516', 'AILYS-VESTE-BOXY-42-KAK', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO products (
  id, slug, name, subtitle, description, price, sale_price, category_id, primary_collection_id,
  sub_category, materials, care, fit, is_published, is_featured, is_new, is_sold_out
) VALUES (
  '53d57dbd-e234-45b6-8298-5a92054c3346',
  'veste-zippee-scuba-noir-onyx',
  'Veste Zippée Scuba Noir Onyx',
  'Maille technique interlock haute densité à col montant',
  'Veste sport-chic technique en jersey scuba double face. Tombé sculptural sans pli, col montant ajusté, zip en métal argenté et poches italiennes discrètes. La parfaite veste mi-saison urbaine.',
  245,
  NULL,
  '44d8f840-3661-4788-8884-90dc8b3bfd9b',
  'aa9f95b6-453a-45fd-81cd-be14e1287ca2',
  'Vestes Sport-Chic',
  '75% Coton peigné, 20% Polyester technique, 5% Élasthanne (320 g/m²)',
  'Lavage en machine à 30°C sur l''envers. Repassage doux à la vapeur si nécessaire.',
  'Coupe régulière sportive.',
  true,
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
  is_featured = EXCLUDED.is_featured,
  is_sold_out = EXCLUDED.is_sold_out;


INSERT INTO collection_products (collection_id, product_id, display_order)
VALUES ('aa9f95b6-453a-45fd-81cd-be14e1287ca2', '53d57dbd-e234-45b6-8298-5a92054c3346', 1)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('2bd2d6b8-078a-40e3-8152-fb109534d23d', '53d57dbd-e234-45b6-8298-5a92054c3346', '/images/products/07721518800-M.webp', 'Veste Zippée Scuba Noir Onyx', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0ed24251-3204-4eee-8209-ec5be6b8ab34', '53d57dbd-e234-45b6-8298-5a92054c3346', '/images/products/07721522800-A6M.webp', 'Veste Zippée Scuba Noir Onyx', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('92060d7d-0326-437a-81c4-e07a5ce79483', '53d57dbd-e234-45b6-8298-5a92054c3346', '/images/products/07721518800-A4M.webp', 'Veste Zippée Scuba Noir Onyx', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('368cd363-44af-4adf-8d9c-129b32a5f34b', '53d57dbd-e234-45b6-8298-5a92054c3346', '/images/products/07721522800-A8M.webp', 'Veste Zippée Scuba Noir Onyx', false, 4)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('55a9dbcc-613d-470c-817e-378e074d9917', '53d57dbd-e234-45b6-8298-5a92054c3346', '/images/products/07721522800-A20M.webp', 'Veste Zippée Scuba Noir Onyx', false, 5)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('53d57dbd-e234-45b6-8298-5a92054c3346', 'c97dd004-72b1-4e12-8d85-5aa513d9eeff', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('5b662e77-dde3-485b-8dc1-3f53bea3d148', '53d57dbd-e234-45b6-8298-5a92054c3346', 'c97dd004-72b1-4e12-8d85-5aa513d9eeff', 'e5913e48-1cff-48a4-8e4f-0accc0e37d83', 'AILYS-VESTE-ZIPP-S-NOI', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('53d57dbd-e234-45b6-8298-5a92054c3346', '18fd4031-249a-416b-8e1c-f480ec7425c1', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('5ed5f076-91c4-4240-8b56-b8e705cab259', '53d57dbd-e234-45b6-8298-5a92054c3346', '18fd4031-249a-416b-8e1c-f480ec7425c1', 'e5913e48-1cff-48a4-8e4f-0accc0e37d83', 'AILYS-VESTE-ZIPP-M-NOI', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('53d57dbd-e234-45b6-8298-5a92054c3346', '7d84422d-677a-4598-8f37-09acd7627ae4', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('d584bbf4-4619-4f0d-81db-97c6930405bf', '53d57dbd-e234-45b6-8298-5a92054c3346', '7d84422d-677a-4598-8f37-09acd7627ae4', 'e5913e48-1cff-48a4-8e4f-0accc0e37d83', 'AILYS-VESTE-ZIPP-L-NOI', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('53d57dbd-e234-45b6-8298-5a92054c3346', '703cd1af-d562-4f55-81a3-c78accfea1eb', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('f06bfdd2-5a2f-4d75-8a24-688963217b9d', '53d57dbd-e234-45b6-8298-5a92054c3346', '703cd1af-d562-4f55-81a3-c78accfea1eb', 'e5913e48-1cff-48a4-8e4f-0accc0e37d83', 'AILYS-VESTE-ZIPP-XL-NOI', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO products (
  id, slug, name, subtitle, description, price, sale_price, category_id, primary_collection_id,
  sub_category, materials, care, fit, is_published, is_featured, is_new, is_sold_out
) VALUES (
  'cd671668-16f4-4dc6-82c0-baa3d21aad30',
  'veste-zippee-scuba-grenat',
  'Veste Zippée Scuba Grenat',
  'Teinte bordeaux profond noble sur maille scuba double face',
  'Déclinaison dans un rouge grenat sombre et raffiné de notre veste zippée en scuba technique. Apporte une touche de couleur chaude et feutrée au vestiaire masculin.',
  245,
  NULL,
  '44d8f840-3661-4788-8884-90dc8b3bfd9b',
  'aa9f95b6-453a-45fd-81cd-be14e1287ca2',
  'Vestes Sport-Chic',
  '75% Coton peigné, 20% Polyester technique, 5% Élasthanne',
  'Lavage délicat à 30°C.',
  'Coupe athlétique contemporaine.',
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
  is_featured = EXCLUDED.is_featured,
  is_sold_out = EXCLUDED.is_sold_out;


INSERT INTO collection_products (collection_id, product_id, display_order)
VALUES ('aa9f95b6-453a-45fd-81cd-be14e1287ca2', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', 1)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('8eaab0d2-ce9b-4572-8598-7fe8d9634685', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', '/images/products/07721918700-M.webp', 'Veste Zippée Scuba Grenat', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('91cdd383-fc6b-4be1-81ab-95aecec94a45', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', '/images/products/07721918700-A6M.webp', 'Veste Zippée Scuba Grenat', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('4d34e474-32e1-45bb-85d0-d7e469c6e319', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', '/images/products/07721918700-A2M.webp', 'Veste Zippée Scuba Grenat', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ebfe27e3-09f4-4562-8312-04f6f8b1d1ce', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', '/images/products/07721918700-A8M.webp', 'Veste Zippée Scuba Grenat', false, 4)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('66341d06-d269-4c9e-8763-19fa32bea9c0', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', '/images/products/07721918700-A20M.webp', 'Veste Zippée Scuba Grenat', false, 5)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('cd671668-16f4-4dc6-82c0-baa3d21aad30', 'c97dd004-72b1-4e12-8d85-5aa513d9eeff', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('46721265-0427-434d-8527-17b6e9e2493d', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', 'c97dd004-72b1-4e12-8d85-5aa513d9eeff', '5f125ae1-f18e-4635-830c-e6cb6b2ced09', 'AILYS-VESTE-ZIPP-S-GRE', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('cd671668-16f4-4dc6-82c0-baa3d21aad30', '18fd4031-249a-416b-8e1c-f480ec7425c1', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('8b8129cc-7b41-4667-8451-8e33b7b864ed', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', '18fd4031-249a-416b-8e1c-f480ec7425c1', '5f125ae1-f18e-4635-830c-e6cb6b2ced09', 'AILYS-VESTE-ZIPP-M-GRE', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('cd671668-16f4-4dc6-82c0-baa3d21aad30', '7d84422d-677a-4598-8f37-09acd7627ae4', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('4ec39002-0d18-47c6-87ba-890829478bae', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', '7d84422d-677a-4598-8f37-09acd7627ae4', '5f125ae1-f18e-4635-830c-e6cb6b2ced09', 'AILYS-VESTE-ZIPP-L-GRE', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('cd671668-16f4-4dc6-82c0-baa3d21aad30', '703cd1af-d562-4f55-81a3-c78accfea1eb', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('8c203195-8f1b-443b-8ea8-948519bfca05', 'cd671668-16f4-4dc6-82c0-baa3d21aad30', '703cd1af-d562-4f55-81a3-c78accfea1eb', '5f125ae1-f18e-4635-830c-e6cb6b2ced09', 'AILYS-VESTE-ZIPP-XL-GRE', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO products (
  id, slug, name, subtitle, description, price, sale_price, category_id, primary_collection_id,
  sub_category, materials, care, fit, is_published, is_featured, is_new, is_sold_out
) VALUES (
  '747dc74e-00cb-433b-8810-939a506408b4',
  'veste-zippee-scuba-gris-chine',
  'Veste Zippée Scuba Gris Chiné',
  'Maille scuba chinée douce au tombé net et structuré',
  'Veste zippée polyvalente en scuba chiné gris perle. Idéale superposée sur une chemise ou un t-shirt pour une allure sport-chic décontractée.',
  245,
  NULL,
  '44d8f840-3661-4788-8884-90dc8b3bfd9b',
  'aa9f95b6-453a-45fd-81cd-be14e1287ca2',
  'Vestes Sport-Chic',
  '70% Coton, 25% Polyester, 5% Élasthanne',
  'Lavage en machine à 30°C.',
  'Coupe décontractée urbaine.',
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
  is_featured = EXCLUDED.is_featured,
  is_sold_out = EXCLUDED.is_sold_out;


INSERT INTO collection_products (collection_id, product_id, display_order)
VALUES ('aa9f95b6-453a-45fd-81cd-be14e1287ca2', '747dc74e-00cb-433b-8810-939a506408b4', 1)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('fd8db672-25e6-4671-8c07-09c2de0456fb', '747dc74e-00cb-433b-8810-939a506408b4', '/images/products/07721918803-M.webp', 'Veste Zippée Scuba Gris Chiné', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('bfe8cfbe-b01c-4c07-89e2-caa21decb49d', '747dc74e-00cb-433b-8810-939a506408b4', '/images/products/07721918803-A6M.webp', 'Veste Zippée Scuba Gris Chiné', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('ac011f8c-0629-4e1f-85bd-f8d10585cf58', '747dc74e-00cb-433b-8810-939a506408b4', '/images/products/07721918803-A5M.webp', 'Veste Zippée Scuba Gris Chiné', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('92d43366-e40e-42fc-81f0-9cff26f4e9a1', '747dc74e-00cb-433b-8810-939a506408b4', '/images/products/07721918803-A20M.webp', 'Veste Zippée Scuba Gris Chiné', false, 4)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('747dc74e-00cb-433b-8810-939a506408b4', 'c97dd004-72b1-4e12-8d85-5aa513d9eeff', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('2932f14b-bbd3-48c2-8515-da1b3d41ec0f', '747dc74e-00cb-433b-8810-939a506408b4', 'c97dd004-72b1-4e12-8d85-5aa513d9eeff', 'be5ec721-882c-470e-86dc-a5e49f9bdad6', 'AILYS-VESTE-ZIPP-S-GRI', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('747dc74e-00cb-433b-8810-939a506408b4', '18fd4031-249a-416b-8e1c-f480ec7425c1', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('0a7f5eb0-4213-4cdd-8375-bcd01e9f7569', '747dc74e-00cb-433b-8810-939a506408b4', '18fd4031-249a-416b-8e1c-f480ec7425c1', 'be5ec721-882c-470e-86dc-a5e49f9bdad6', 'AILYS-VESTE-ZIPP-M-GRI', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('747dc74e-00cb-433b-8810-939a506408b4', '7d84422d-677a-4598-8f37-09acd7627ae4', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('d857bc09-60dd-40fc-88a9-736a73d7825f', '747dc74e-00cb-433b-8810-939a506408b4', '7d84422d-677a-4598-8f37-09acd7627ae4', 'be5ec721-882c-470e-86dc-a5e49f9bdad6', 'AILYS-VESTE-ZIPP-L-GRI', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('747dc74e-00cb-433b-8810-939a506408b4', '703cd1af-d562-4f55-81a3-c78accfea1eb', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('b8878da6-58ea-4387-802d-7463e9a33d98', '747dc74e-00cb-433b-8810-939a506408b4', '703cd1af-d562-4f55-81a3-c78accfea1eb', 'be5ec721-882c-470e-86dc-a5e49f9bdad6', 'AILYS-VESTE-ZIPP-XL-GRI', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO products (
  id, slug, name, subtitle, description, price, sale_price, category_id, primary_collection_id,
  sub_category, materials, care, fit, is_published, is_featured, is_new, is_sold_out
) VALUES (
  'd5423939-ad39-4de5-8110-5513d7489e13',
  't-shirt-oversize-atelier-sfax',
  'T-Shirt Oversize Atelier Sfax',
  'Jersey de coton lourd 260g, typographie atelier discrète',
  'T-shirt à la coupe ample et tombé lourd, confectionné en jersey de coton dense 260g. Col ras-du-cou robuste et micro-typographie inspirée des inscriptions de patronnage d''atelier.',
  125,
  NULL,
  '44d8f840-3661-4788-8884-90dc8b3bfd9b',
  'aa9f95b6-453a-45fd-81cd-be14e1287ca2',
  'Polos & Mailles',
  '100% Coton peigné cardé lourd (260 g/m²)',
  'Lavage en machine à 30°C sur l''envers. Repasser à température moyenne.',
  'Coupe oversize contemporaine aux épaules tombantes.',
  true,
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
  is_featured = EXCLUDED.is_featured,
  is_sold_out = EXCLUDED.is_sold_out;


INSERT INTO collection_products (collection_id, product_id, display_order)
VALUES ('aa9f95b6-453a-45fd-81cd-be14e1287ca2', 'd5423939-ad39-4de5-8110-5513d7489e13', 1)
ON CONFLICT (collection_id, product_id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('6ae24f19-7ba4-4304-846f-7f47e512136e', 'd5423939-ad39-4de5-8110-5513d7489e13', '/images/products/07231523250-A7M.webp', 'T-Shirt Oversize Atelier Sfax', true, 1)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('0f99dddc-86c0-425d-8080-6d8186425d50', 'd5423939-ad39-4de5-8110-5513d7489e13', '/images/products/07231523250-A6M.webp', 'T-Shirt Oversize Atelier Sfax', false, 2)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('a5011696-4efc-489c-8c38-5bb8a9037199', 'd5423939-ad39-4de5-8110-5513d7489e13', '/images/products/07231523250-A2M.webp', 'T-Shirt Oversize Atelier Sfax', false, 3)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_images (id, product_id, image_url, alt_text, is_primary, display_order)
VALUES ('348ac1a1-bc00-49fd-85dc-30cad820bc8d', 'd5423939-ad39-4de5-8110-5513d7489e13', '/images/products/07231523250-A20M.webp', 'T-Shirt Oversize Atelier Sfax', false, 4)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('d5423939-ad39-4de5-8110-5513d7489e13', 'c97dd004-72b1-4e12-8d85-5aa513d9eeff', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('6fa62266-022f-4afa-8646-b41f06f336cd', 'd5423939-ad39-4de5-8110-5513d7489e13', 'c97dd004-72b1-4e12-8d85-5aa513d9eeff', '0050f3b6-3514-4e1a-82f8-29aab61859e0', 'AILYS-T-SHIRT-OV-S-BLA', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('d5423939-ad39-4de5-8110-5513d7489e13', '18fd4031-249a-416b-8e1c-f480ec7425c1', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('c9936f68-019e-4606-8ced-efbf5113f8de', 'd5423939-ad39-4de5-8110-5513d7489e13', '18fd4031-249a-416b-8e1c-f480ec7425c1', '0050f3b6-3514-4e1a-82f8-29aab61859e0', 'AILYS-T-SHIRT-OV-M-BLA', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('d5423939-ad39-4de5-8110-5513d7489e13', '7d84422d-677a-4598-8f37-09acd7627ae4', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('c8e970f4-0c1c-419f-8b2b-50aa14d814ca', 'd5423939-ad39-4de5-8110-5513d7489e13', '7d84422d-677a-4598-8f37-09acd7627ae4', '0050f3b6-3514-4e1a-82f8-29aab61859e0', 'AILYS-T-SHIRT-OV-L-BLA', 15, true)
ON CONFLICT (id) DO NOTHING;


INSERT INTO product_sizes (product_id, size_id, is_available)
VALUES ('d5423939-ad39-4de5-8110-5513d7489e13', '703cd1af-d562-4f55-81a3-c78accfea1eb', true)
ON CONFLICT (product_id, size_id) DO NOTHING;


INSERT INTO product_variants (id, product_id, size_id, color_id, sku, stock_quantity, is_available)
VALUES ('8a9f66b7-b2a8-4e9b-8af8-4c07e9424762', 'd5423939-ad39-4de5-8110-5513d7489e13', '703cd1af-d562-4f55-81a3-c78accfea1eb', '0050f3b6-3514-4e1a-82f8-29aab61859e0', 'AILYS-T-SHIRT-OV-XL-BLA', 15, true)
ON CONFLICT (id) DO NOTHING;

-- 7. CUSTOMERS, ADDRESSES & ORDERS

INSERT INTO customers (id, email, phone, first_name, last_name, total_orders_count, total_spent)
VALUES (
  '4a9bd74d-bf78-46ab-8773-e1dd7229c0ab',
  NULL,
  '+21622291666',
  'Mahmoud',
  'Dammak',
  1,
  280
)
ON CONFLICT (phone) DO UPDATE SET
  total_orders_count = customers.total_orders_count + 1,
  total_spent = customers.total_spent + EXCLUDED.total_spent;


INSERT INTO customer_addresses (id, customer_id, governorate, city, address, is_default)
VALUES (
  'ebf0e202-cdf6-42bf-846d-3bed2b1f6557',
  '4a9bd74d-bf78-46ab-8773-e1dd7229c0ab',
  'Tunis',
  'Sfax',
  'Rte lafrane klm 6',
  true
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO orders (
  id, order_code, customer_id, customer_name, customer_email, customer_phone, alt_phone,
  governorate, city, address, notes, subtotal, shipping_fee, total, payment_method, status, created_at
) VALUES (
  '0398df6e-c02e-4825-8aae-2aa4649ff26a',
  'AILYS-2609-2349',
  '4a9bd74d-bf78-46ab-8773-e1dd7229c0ab',
  'Mahmoud Dammak',
  NULL,
  '+21622291666',
  NULL,
  'Tunis',
  'Sfax',
  'Rte lafrane klm 6',
  NULL,
  280,
  0,
  280,
  'COD',
  'nouveau',
  '2026-09-18T19:31:11.128Z'
)
ON CONFLICT (order_code) DO NOTHING;


INSERT INTO order_items (
  id, order_id, product_name, size, color, unit_price, quantity, total_price, image_url
) VALUES (
  '3c68c57d-1fc6-43de-82c9-7b51f6f6e203',
  '0398df6e-c02e-4825-8aae-2aa4649ff26a',
  'Veste Boxy Denim Indigo Brut',
  '36',
  'Indigo Brut',
  280,
  1,
  280,
  '/images/products/07460319401-A7M.webp'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO customers (id, email, phone, first_name, last_name, total_orders_count, total_spent)
VALUES (
  '4a9bd74d-bf78-46ab-8773-e1dd7229c0ab',
  NULL,
  '+21622291666',
  'Mahmoud',
  'Dammak',
  1,
  265
)
ON CONFLICT (phone) DO UPDATE SET
  total_orders_count = customers.total_orders_count + 1,
  total_spent = customers.total_spent + EXCLUDED.total_spent;


INSERT INTO customer_addresses (id, customer_id, governorate, city, address, is_default)
VALUES (
  'ebf0e202-cdf6-42bf-846d-3bed2b1f6557',
  '4a9bd74d-bf78-46ab-8773-e1dd7229c0ab',
  'Tunis',
  'Sfax',
  'Rte lafrane klm 6',
  true
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO orders (
  id, order_code, customer_id, customer_name, customer_email, customer_phone, alt_phone,
  governorate, city, address, notes, subtotal, shipping_fee, total, payment_method, status, created_at
) VALUES (
  'aeea476c-8687-4e22-82e0-7178b060e146',
  'AILYS-2609-6208',
  '4a9bd74d-bf78-46ab-8773-e1dd7229c0ab',
  'Mahmoud Dammak',
  NULL,
  '+21622291666',
  NULL,
  'Tunis',
  'Sfax',
  'Rte lafrane klm 6',
  NULL,
  265,
  0,
  265,
  'COD',
  'livre',
  '2026-09-18T01:00:06.662Z'
)
ON CONFLICT (order_code) DO NOTHING;


INSERT INTO order_items (
  id, order_id, product_name, size, color, unit_price, quantity, total_price, image_url
) VALUES (
  '1b10fad3-13f6-4030-85f9-e6643e76ff98',
  'aeea476c-8687-4e22-82e0-7178b060e146',
  'Veste Boxy Sergé Kaki Ombre',
  '36',
  'Kaki Ombre',
  265,
  1,
  265,
  '/images/products/07460319700-A7M.webp'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO customers (id, email, phone, first_name, last_name, total_orders_count, total_spent)
VALUES (
  '990c965b-50d6-4b40-8595-b6251987c2b0',
  'amira.bensalem@test.tn',
  '98123456',
  'Amira',
  'Ben Salem',
  1,
  280
)
ON CONFLICT (phone) DO UPDATE SET
  total_orders_count = customers.total_orders_count + 1,
  total_spent = customers.total_spent + EXCLUDED.total_spent;


INSERT INTO customer_addresses (id, customer_id, governorate, city, address, is_default)
VALUES (
  'bc22af17-b4e9-4152-8034-c3e7777b3c80',
  '990c965b-50d6-4b40-8595-b6251987c2b0',
  'Sfax',
  'Sfax Ville',
  'Route de Téniour Km 2, Résidence El Hana',
  true
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO orders (
  id, order_code, customer_id, customer_name, customer_email, customer_phone, alt_phone,
  governorate, city, address, notes, subtotal, shipping_fee, total, payment_method, status, created_at
) VALUES (
  '2dbd44d1-5c87-4a2c-846f-221c89b9ff7a',
  'AILYS-2609-5783',
  '990c965b-50d6-4b40-8595-b6251987c2b0',
  'Amira Ben Salem',
  'amira.bensalem@test.tn',
  '98123456',
  '21987654',
  'Sfax',
  'Sfax Ville',
  'Route de Téniour Km 2, Résidence El Hana',
  'Appeler avant la livraison svp',
  280,
  0,
  280,
  'COD',
  'nouveau',
  '2026-09-18T00:56:15.022Z'
)
ON CONFLICT (order_code) DO NOTHING;


INSERT INTO order_items (
  id, order_id, product_name, size, color, unit_price, quantity, total_price, image_url
) VALUES (
  'bc21c3e5-c1fa-46f5-818e-80fe3f658e70',
  '2dbd44d1-5c87-4a2c-846f-221c89b9ff7a',
  'Veste Boxy Denim Indigo Brut',
  '38',
  'Indigo Brut',
  280,
  1,
  280,
  '/images/products/07460319401-A7M.webp'
)
ON CONFLICT (id) DO NOTHING;

-- 8. MEDIA ASSETS

INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '361813eb-c378-466f-81b0-c6ae017350a9',
  '01_ailys_hero.webp',
  '01_ailys_hero.webp',
  'image/webp',
  126976,
  '/images/editorial/01_ailys_hero.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '4c1283d4-752b-49fa-84c4-35df3dd4c413',
  '02_ailys_portrait.webp',
  '02_ailys_portrait.webp',
  'image/webp',
  172032,
  '/images/editorial/02_ailys_portrait.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '406d0326-7456-4e42-85ed-e5638836d7bc',
  '03_the_silhouette.webp',
  '03_the_silhouette.webp',
  'image/webp',
  292864,
  '/images/editorial/03_the_silhouette.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'f5a9de34-0d5c-49b5-837f-637ec55806da',
  '04_craftsmanship_detail.webp',
  '04_craftsmanship_detail.webp',
  'image/webp',
  525312,
  '/images/editorial/04_craftsmanship_detail.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '89fb8b14-9c38-4ab5-847f-c0f2a0cd15b5',
  '05_movement.webp',
  '05_movement.webp',
  'image/webp',
  279552,
  '/images/editorial/05_movement.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '16bd3b55-a48c-43b8-884a-7d98df0523e4',
  '06_tunisian_architecture.webp',
  '06_tunisian_architecture.webp',
  'image/webp',
  287744,
  '/images/editorial/06_tunisian_architecture.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '9efcf386-52e6-4869-8050-d9633fcddcca',
  '07_minimal_studio.webp',
  '07_minimal_studio.webp',
  'image/webp',
  192512,
  '/images/editorial/07_minimal_studio.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'ac85d465-51f1-4a7d-8ccd-de2108de8fd7',
  '08_mediterranean_street.webp',
  '08_mediterranean_street.webp',
  'image/webp',
  201728,
  '/images/editorial/08_mediterranean_street.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'eefb847a-6945-4977-8bed-038fd5bcd129',
  '09_ailys_still_life.webp',
  '09_ailys_still_life.webp',
  'image/webp',
  404480,
  '/images/editorial/09_ailys_still_life.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '1f3bbffd-47fb-40dd-8206-ca7b7d8d6d69',
  '10_the_close_up.webp',
  '10_the_close_up.webp',
  'image/webp',
  192512,
  '/images/editorial/10_the_close_up.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'b9556008-0021-4a79-88a1-a34552341ecc',
  '11_ailys_atmosphere.webp',
  '11_ailys_atmosphere.webp',
  'image/webp',
  299008,
  '/images/editorial/11_ailys_atmosphere.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '85a09b5c-581b-4ff5-8635-fc8624d43283',
  '12_the_finale_cta.webp',
  '12_the_finale_cta.webp',
  'image/webp',
  260096,
  '/images/editorial/12_the_finale_cta.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '3dc30f1e-3d70-42ec-84a1-9da539c57efc',
  'man-collection.webp',
  'man-collection.webp',
  'image/webp',
  89088,
  '/images/editorial/man-collection.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'b3fdda4a-75ea-4064-865f-6c64b86ff274',
  'children-collection.webp',
  'children-collection.webp',
  'image/webp',
  73728,
  '/images/editorial/children-collection.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'ce13c18f-267d-44e2-8470-f9387f378731',
  'logo.svg',
  'logo.svg',
  'image/svg+xml',
  5120,
  '/logo.svg',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '8047c8bc-b051-4495-8071-66f8c7fdd8f2',
  '07231523250-A20M.webp',
  '07231523250-A20M.webp',
  'image/webp',
  7168,
  '/images/products/07231523250-A20M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '6fb77788-d644-4826-8bc7-c6d8a8600545',
  '07231523250-A2M.webp',
  '07231523250-A2M.webp',
  'image/webp',
  22528,
  '/images/products/07231523250-A2M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'b2360475-be31-41aa-81c5-0faed3cc9808',
  '07231523250-A6M.webp',
  '07231523250-A6M.webp',
  'image/webp',
  9216,
  '/images/products/07231523250-A6M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'e9c570fe-f084-4c6b-83f8-be30b5f1dcb4',
  '07231523250-A7M.webp',
  '07231523250-A7M.webp',
  'image/webp',
  59392,
  '/images/products/07231523250-A7M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '39b3f3e0-afe9-48e4-8287-dd1f2c511ead',
  '07460319401-A20M.webp',
  '07460319401-A20M.webp',
  'image/webp',
  110592,
  '/images/products/07460319401-A20M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'fd024654-4b09-4715-8d87-3b001be0608b',
  '07460319401-A2M.webp',
  '07460319401-A2M.webp',
  'image/webp',
  98304,
  '/images/products/07460319401-A2M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '9d922014-4de7-4e34-8227-339ed262f16a',
  '07460319401-A6M.webp',
  '07460319401-A6M.webp',
  'image/webp',
  120832,
  '/images/products/07460319401-A6M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'e0f94529-137e-4604-8b70-3de30610933d',
  '07460319401-A7M.webp',
  '07460319401-A7M.webp',
  'image/webp',
  113664,
  '/images/products/07460319401-A7M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '884cd0eb-2e74-47ca-841c-e3e786d11d1a',
  '07460319700-A20M.webp',
  '07460319700-A20M.webp',
  'image/webp',
  70656,
  '/images/products/07460319700-A20M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'c63ae3b9-cdd2-4fd9-8b6a-fc0a78e5d6b8',
  '07460319700-A2M.webp',
  '07460319700-A2M.webp',
  'image/webp',
  111616,
  '/images/products/07460319700-A2M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'e817c8a0-946a-40cc-8258-522e72ccff87',
  '07460319700-A6M.webp',
  '07460319700-A6M.webp',
  'image/webp',
  305152,
  '/images/products/07460319700-A6M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '2952c7cf-dc6c-4144-8efe-672d66a7c39d',
  '07460319700-A7M.webp',
  '07460319700-A7M.webp',
  'image/webp',
  158720,
  '/images/products/07460319700-A7M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '5c2aa9aa-88a4-45dc-88c0-39762d15dbd7',
  '07670434700-A2M.webp',
  '07670434700-A2M.webp',
  'image/webp',
  40960,
  '/images/products/07670434700-A2M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '8a611cf2-6c41-4235-85ff-6f1aa6e69f66',
  '07670434700-A6M.webp',
  '07670434700-A6M.webp',
  'image/webp',
  13312,
  '/images/products/07670434700-A6M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '1920cc5b-79f0-4d2e-8dff-f58755f16853',
  '07670434700-M.webp',
  '07670434700-M.webp',
  'image/webp',
  40960,
  '/images/products/07670434700-M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '34afa029-a718-4c00-82be-f81da9ccb151',
  '07721518800-A4M.webp',
  '07721518800-A4M.webp',
  'image/webp',
  32768,
  '/images/products/07721518800-A4M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'acefa201-2984-43f1-81e5-b400e8ea8ffa',
  '07721518800-M.webp',
  '07721518800-M.webp',
  'image/webp',
  50176,
  '/images/products/07721518800-M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'da885b63-0443-4ffb-808b-96cd18022784',
  '07721522800-A20M.webp',
  '07721522800-A20M.webp',
  'image/webp',
  15360,
  '/images/products/07721522800-A20M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '70f04825-01e9-4a1a-84de-a2f5d8fbeae8',
  '07721522800-A6M.webp',
  '07721522800-A6M.webp',
  'image/webp',
  64512,
  '/images/products/07721522800-A6M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'f3d16058-5440-4e5a-8275-a0afbc5d2ea5',
  '07721522800-A8M.webp',
  '07721522800-A8M.webp',
  'image/webp',
  106496,
  '/images/products/07721522800-A8M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'd71a819d-ce94-46b9-84a1-75017ac87d7b',
  '07721918700-A20M.webp',
  '07721918700-A20M.webp',
  'image/webp',
  15360,
  '/images/products/07721918700-A20M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '5b8df65e-0d39-4454-8011-bf9b17c72fcc',
  '07721918700-A2M.webp',
  '07721918700-A2M.webp',
  'image/webp',
  20480,
  '/images/products/07721918700-A2M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '2fd32d63-7a26-44c8-88b5-c13f63842204',
  '07721918700-A6M.webp',
  '07721918700-A6M.webp',
  'image/webp',
  19456,
  '/images/products/07721918700-A6M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'e3afc218-332a-4b67-8279-3beed05ac546',
  '07721918700-A8M.webp',
  '07721918700-A8M.webp',
  'image/webp',
  214016,
  '/images/products/07721918700-A8M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'fcc8795a-c08e-4d95-897c-41b367d5a52f',
  '07721918700-M.webp',
  '07721918700-M.webp',
  'image/webp',
  28672,
  '/images/products/07721918700-M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'd5314142-8da4-49d3-8fb0-29462dd17acc',
  '07721918803-A20M.webp',
  '07721918803-A20M.webp',
  'image/webp',
  104448,
  '/images/products/07721918803-A20M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  'f226716d-e838-41dc-86ce-0ba156d7e637',
  '07721918803-A5M.webp',
  '07721918803-A5M.webp',
  'image/webp',
  94208,
  '/images/products/07721918803-A5M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '675d4585-342c-40c2-8770-e10a5d0fa70d',
  '07721918803-A6M.webp',
  '07721918803-A6M.webp',
  'image/webp',
  82944,
  '/images/products/07721918803-A6M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;


INSERT INTO media (id, filename, original_name, mime_type, size_bytes, public_url, bucket_name)
VALUES (
  '361402af-2642-485e-81c0-02945be08bbf',
  '07721918803-M.webp',
  '07721918803-M.webp',
  'image/webp',
  64512,
  '/images/products/07721918803-M.webp',
  'media'
)
ON CONFLICT (id) DO NOTHING;

-- 9. HOMEPAGE SECTIONS & CONTENT

INSERT INTO homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
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


INSERT INTO homepage_content (
  id, section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  'a2709545-e8f7-4f5b-831e-b0084742f255',
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


INSERT INTO homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
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


INSERT INTO homepage_content (
  id, section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  '54549f37-5515-44a2-8630-1bd51adb7654',
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


INSERT INTO homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
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


INSERT INTO homepage_content (
  id, section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  'cd8ba376-1ccc-40ec-8003-e0900ef5d8bf',
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


INSERT INTO homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
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


INSERT INTO homepage_content (
  id, section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  'cc2ab73a-dac8-44e5-8899-b5bbb1aba972',
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


INSERT INTO homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
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


INSERT INTO homepage_content (
  id, section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  'de4e61d4-1dbd-43bb-82c6-62525321a283',
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


INSERT INTO homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
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


INSERT INTO homepage_content (
  id, section_id, content_key, content_value, desktop_image_url, mobile_image_url, metadata
) VALUES (
  'e9848c21-36c4-4e18-891b-60b12c3ab822',
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
