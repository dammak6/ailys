-- =============================================================================
-- AÏLYS E-COMMERCE & ADMINISTRATION PLATFORM
-- PRODUCTION SEED DATA
-- =============================================================================

-- 1. TAXONOMY: CATEGORIES
INSERT INTO categories (id, slug, name, gender, tagline, description, hero_image_url, display_order)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'femme', 'Femme', 'femme', 'L''allure sport-chic au féminin', 'Des tailleurs déstructurés en lin lavé aux robes fluides coupées pour la liberté de mouvement.', '/images/campaign/hero-editorial-woman.jpg', 1),
    ('c2222222-2222-2222-2222-222222222222', 'homme', 'Homme', 'homme', 'Coupes épurées & matières nobles', 'L''équilibre précis entre confection tailleur et aisance sportive.', '/images/campaign/man-sport-chic.jpg', 2),
    ('c3333333-3333-3333-3333-333333333333', 'enfant', 'Enfant', 'enfant', 'L''élégance familiale partagée', 'Conçus avec les mêmes étoffes nobles et finitions artisanales que les pièces adultes.', '/images/campaign/girl-sport-chic.jpg', 3)
ON CONFLICT (id) DO NOTHING;

-- 2. SIZES
INSERT INTO sizes (id, name, code, gender, display_order)
VALUES
    ('s0111111-1111-1111-1111-111111111111', '36 (XS)', 'F-36', 'femme', 1),
    ('s0222222-2222-2222-2222-222222222222', '38 (S)', 'F-38', 'femme', 2),
    ('s0333333-3333-3333-3333-333333333333', '40 (M)', 'F-40', 'femme', 3),
    ('s0444444-4444-4444-4444-444444444444', '42 (L)', 'F-42', 'femme', 4),
    ('s0555555-5555-5555-5555-555555555555', '44 (XL)', 'F-44', 'femme', 5),
    ('s0666666-6666-6666-6666-666666666666', 'S', 'H-S', 'homme', 6),
    ('s0777777-7777-7777-7777-777777777777', 'M', 'H-M', 'homme', 7),
    ('s0888888-8888-8888-8888-888888888888', 'L', 'H-L', 'homme', 8),
    ('s0999999-9999-9999-9999-999999999999', 'XL', 'H-XL', 'homme', 9),
    ('s1000000-0000-0000-0000-000000000000', 'XXL', 'H-XXL', 'homme', 10),
    ('s1100000-0000-0000-0000-000000000000', '4 ans', 'E-4A', 'enfant', 11),
    ('s1200000-0000-0000-0000-000000000000', '6 ans', 'E-6A', 'enfant', 12),
    ('s1300000-0000-0000-0000-000000000000', '8 ans', 'E-8A', 'enfant', 13),
    ('s1400000-0000-0000-0000-000000000000', '10 ans', 'E-10A', 'enfant', 14),
    ('s1500000-0000-0000-0000-000000000000', '12 ans', 'E-12A', 'enfant', 15)
ON CONFLICT (id) DO NOTHING;

-- 3. COLORS
INSERT INTO colors (id, name, hex, display_order)
VALUES
    ('col00001-0000-0000-0000-000000000000', 'Blanc Os', '#F5F3EC', 1),
    ('col00002-0000-0000-0000-000000000000', 'Noir Ébène', '#0B0B0B', 2),
    ('col00003-0000-0000-0000-000000000000', 'Or AÏLYS', '#B79A5B', 3),
    ('col00004-0000-0000-0000-000000000000', 'Bleu Nuit', '#1A2536', 4),
    ('col00005-0000-0000-0000-000000000000', 'Vert Kaki', '#555A48', 5),
    ('col00006-0000-0000-0000-000000000000', 'Blanc Craie', '#ECE8DF', 6)
ON CONFLICT (id) DO NOTHING;

-- 4. COLLECTIONS
INSERT INTO collections (id, slug, title, subtitle, description, story, hero_desktop_image, hero_mobile_image, is_capsule, is_published, display_order)
VALUES
    (
        'b1111111-1111-1111-1111-111111111111',
        'lumiere-d-ete',
        'Lumière d''Été',
        'Collection Printemps / Été 2026',
        'Inspirée par les reflets dorés du golfe de Tunis et la douceur minérale de Sidi Bou Saïd.',
        'La collection Lumière d''Été capture cette heure suspendue où le soleil méditerranéen adoucit les contours de la pierre blanche. Confectionnées dans des lins purs et des cotons respirants tissés localement, ces pièces incarnent une décontraction aristocratique et naturelle.',
        '/images/campaign/hero-editorial-woman.jpg',
        '/images/campaign/hero-portrait-woman.jpg',
        false,
        true,
        1
    ),
    (
        'b2222222-2222-2222-2222-222222222222',
        'capsule-sport-chic-nocturne',
        'Capsule Sport-Chic Nocturne',
        'Édition Limitée Atelier',
        'La rigueur du noir profond relevée par l''éclat satiné de l''or AÏLYS et des zips joaillerie.',
        'Pensée pour les soirées douces et les voyages, cette capsule explore le contraste entre coupes athlétiques et broderies d''or artisanales. Chaque pièce arbore discrètement l''emblème botanique AÏLYS brodé au fil d''or mat.',
        '/images/campaign/man-back-embroidery.jpg',
        '/images/campaign/man-sport-chic.jpg',
        true,
        true,
        2
    )
ON CONFLICT (id) DO NOTHING;

-- 5. PRODUCTS
INSERT INTO products (
    id, slug, name, subtitle, description, price, sale_price, category_id, primary_collection_id, sub_category, materials, care, fit, is_published, is_featured, is_new, is_capsule, is_sold_out
)
VALUES
    (
        'p1111111-1111-1111-1111-111111111111',
        'ensemble-tailleur-lin-ivoire',
        'Ensemble Tailleur Veste & Pantalon',
        'Lin lavé naturel avec boutons corne gravés',
        'Une silhouette maîtresse de la maison AÏLYS. Ce tailleur deux pièces en lin lavé méditerranéen offre un tombé souple et impeccable. Veste à double boutonnage épuré et pantalon droit à taille élastiquée au dos pour un confort absolu du matin au soir.',
        289.00,
        NULL,
        'c1111111-1111-1111-1111-111111111111',
        'b1111111-1111-1111-1111-111111111111',
        'Tailleurs & Ensembles',
        '100% Lin lavé de première qualité, doublure intérieure 100% coton respirant.',
        'Nettoyage à sec doux ou lavage délicat à la main à 30°C. Repassage sur l''envers à fer doux.',
        'Coupe droite décontractée. Prenez votre taille habituelle pour une allure fluide.',
        true, true, true, false, false
    ),
    (
        'p2222222-2222-2222-2222-222222222222',
        'robe-ceinturee-noire',
        'Robe Midi Ceinturée Soie & Coton',
        'Encolure en V délicate et manches trois-quarts',
        'La petite robe noire réinventée dans l''esprit AÏLYS. Une coupe midi fluide ceinturée d''un lien en tissu ton sur ton avec embouts métalliques or pâle.',
        189.00,
        NULL,
        'c1111111-1111-1111-1111-111111111111',
        'b1111111-1111-1111-1111-111111111111',
        'Robes & Combinaisons',
        '70% Coton peigné, 30% Soie naturelle douce.',
        'Lavage en machine cycle délicat à 30°C. Ne pas utiliser d''eau de javel.',
        'Ajustée au buste et évasée à partir de la taille. Longueur sous le genou.',
        true, true, true, false, false
    ),
    (
        'p3333333-3333-3333-3333-333333333333',
        'polo-piquet-ivoire',
        'Polo Piqué Signature Homme',
        'Col côtelé et emblème brodé sur la manche',
        'L''essentiel du vestiaire masculin sport-chic. Tricoté en piqué de coton peigné longue fibre pour une tenue irréprochable au fil des lavages.',
        95.00,
        NULL,
        'c2222222-2222-2222-2222-222222222222',
        'b1111111-1111-1111-1111-111111111111',
        'Polos & Mailles',
        '100% Coton piqué peigné biologique.',
        'Lavage en machine à 30°C avec couleurs similaires.',
        'Coupe classique moderne, ni trop ajustée ni ample.',
        true, true, false, false, false
    ),
    (
        'p4444444-4444-4444-4444-444444444444',
        'veste-zippee-sport-chic-noire',
        'Veste Zippée Atelier Broderie Or',
        'Zip or mat et tirette emblème botanique',
        'Pièce emblématique de notre capsule. Alliant la structure d''une veste de ville à la décontraction d''un blouson d''échauffement sport-chic. Fermeture éclair en laiton doré brossé.',
        210.00,
        NULL,
        'c2222222-2222-2222-2222-222222222222',
        'b2222222-2222-2222-2222-222222222222',
        'Vestes Sport-Chic',
        '85% Coton double retors, 15% Élasthanne technique.',
        'Lavage délicat à l''envers à 30°C. Fermer le zip avant lavage.',
        'Coupe athlétique droite. Poignets et bas côtelés souples.',
        true, true, false, true, false
    ),
    (
        'p5555555-5555-5555-5555-555555555555',
        'robe-volants-enfant-fleurie',
        'Robe Volants Enfant en Voile de Coton',
        'Détails plissés artisanaux et doublure douce',
        'Une robe aérienne pensée pour les fêtes de famille et les journées ensoleillées. Voile de coton doux hypoallergénique.',
        79.00,
        NULL,
        'c3333333-3333-3333-3333-333333333333',
        'b1111111-1111-1111-1111-111111111111',
        'Ensembles Fille',
        '100% Coton biologique certifié OEKO-TEX.',
        'Lavage machine à 30°C. Repassage doux.',
        'Coupe trapèze confortable.',
        true, false, true, false, false
    ),
    (
        'p6666666-6666-6666-6666-666666666666',
        'ensemble-confort-enfant-ivoire',
        'Ensemble Veste & Jogger Enfant Sport-Chic',
        'Broderie dorée et passepoil contrasté',
        'L''élégance sport-chic pour les plus jeunes, directement coordonnée aux pièces adultes de la collection.',
        135.00,
        NULL,
        'c3333333-3333-3333-3333-333333333333',
        'b1111111-1111-1111-1111-111111111111',
        'Capsules Famille',
        '100% Coton éponge velours.',
        'Lavage en machine à 30°C.',
        'Coupe confort sportive.',
        true, false, false, false, true
    )
ON CONFLICT (id) DO NOTHING;

-- 6. COLLECTION PRODUCTS
INSERT INTO collection_products (collection_id, product_id, display_order)
VALUES
    ('b1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 1),
    ('b1111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222', 2),
    ('b1111111-1111-1111-1111-111111111111', 'p3333333-3333-3333-3333-333333333333', 3),
    ('b1111111-1111-1111-1111-111111111111', 'p5555555-5555-5555-5555-555555555555', 4),
    ('b2222222-2222-2222-2222-222222222222', 'p4444444-4444-4444-4444-444444444444', 1)
ON CONFLICT (collection_id, product_id) DO NOTHING;

-- 7. PRODUCT IMAGES
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order)
VALUES
    ('p1111111-1111-1111-1111-111111111111', '/images/products/ensemble-tailleur.jpg', 'Ensemble Tailleur Veste & Pantalon', true, 1),
    ('p1111111-1111-1111-1111-111111111111', '/images/campaign/hero-portrait-woman.jpg', 'Ensemble Tailleur - Vue Portée', false, 2),
    ('p1111111-1111-1111-1111-111111111111', '/images/craftsmanship/woven-label.jpg', 'Étiquette Tissée AÏLYS', false, 3),

    ('p2222222-2222-2222-2222-222222222222', '/images/products/robe-ceinturee.jpg', 'Robe Midi Ceinturée Noire', true, 1),
    ('p2222222-2222-2222-2222-222222222222', '/images/campaign/editorial-portrait-tunisian-light.jpg', 'Robe Noire Vue Éditoriale', false, 2),

    ('p3333333-3333-3333-3333-333333333333', '/images/products/polo-homme.jpg', 'Polo Piqué Signature Homme', true, 1),
    ('p3333333-3333-3333-3333-333333333333', '/images/campaign/man-sport-chic.jpg', 'Polo Homme Silhouette Portée', false, 2),

    ('p4444444-4444-4444-4444-444444444444', '/images/campaign/man-sport-chic.jpg', 'Veste Zippée Atelier Broderie Or', true, 1),
    ('p4444444-4444-4444-4444-444444444444', '/images/craftsmanship/gold-zipper-detail.jpg', 'Détail Fermoir Or et Tirette Emblème', false, 2),

    ('p5555555-5555-5555-5555-555555555555', '/images/products/robe-fille.jpg', 'Robe Volants Enfant', true, 1),
    ('p5555555-5555-5555-5555-555555555555', '/images/campaign/girl-sport-chic.jpg', 'Robe Enfant Vue Campagne', false, 2),

    ('p6666666-6666-6666-6666-666666666666', '/images/campaign/girl-sport-chic.jpg', 'Ensemble Enfant Sport-Chic', true, 1),
    ('p6666666-6666-6666-6666-666666666666', '/images/campaign/boy-sport-chic.jpg', 'Ensemble Jogger Garçon', false, 2)
ON CONFLICT (id) DO NOTHING;

-- 8. HOMEPAGE SECTIONS
INSERT INTO homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
VALUES
    ('h1111111-1111-1111-1111-111111111111', 'hero', 'L''élégance au quotidien', 'Nouvelle Collection • 2026', 1, true),
    ('h2222222-2222-2222-2222-222222222222', 'new_collection', 'Lumière d''Été', 'Collection Maîtresse', 2, true),
    ('h3333333-3333-3333-3333-333333333333', 'philosophy', 'Quiet confidence, shaped by Tunisian light.', 'Philosophie de la Maison', 3, true),
    ('h4444444-4444-4444-4444-444444444444', 'craftsmanship', 'L''art du détail et de la confection', 'Savoir-Faire & Finitions', 4, true),
    ('h5555555-5555-5555-5555-555555555555', 'about', 'Une histoire de transmission, entre mère et fille.', 'L''Origine de la Maison', 5, true),
    ('h6666666-6666-6666-6666-666666666666', 'final_cta', 'Plongez dans l''univers AÏLYS', 'Maison de Confection Tunisienne', 6, true)
ON CONFLICT (id) DO NOTHING;

-- 9. PROMOTIONS
INSERT INTO promotions (id, code, name, discount_type, discount_value, applies_to, is_active, banner_label)
VALUES
    ('pr111111-1111-1111-1111-111111111111', 'BIENVENUE10', 'Bienvenue AÏLYS', 'percentage', 10.00, 'all', true, '10% offert sur votre première commande')
ON CONFLICT (id) DO NOTHING;

-- 10. SAMPLE ORDERS (COD only)
INSERT INTO orders (
    id, order_code, customer_name, customer_email, customer_phone, governorate, city, address, subtotal, shipping_fee, total, payment_method, status
)
VALUES
    (
        'o1111111-1111-1111-1111-111111111111',
        'AILYS-2609-4182',
        'Yasmine Ben Salem',
        'yasmine@domaine.tn',
        '98123456',
        'Tunis',
        'La Marsa',
        '14 Rue des Jasmins',
        478.00,
        0.00,
        478.00,
        'COD',
        'livre'
    ),
    (
        'o2222222-2222-2222-2222-222222222222',
        'AILYS-2609-9051',
        'Mehdi Trabelsi',
        'mehdi@domaine.tn',
        '22987654',
        'Sousse',
        'Sousse Ville',
        'Résidence Kantaoui, Appt 4',
        305.00,
        0.00,
        305.00,
        'COD',
        'en_livraison'
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO order_items (order_id, product_id, product_name, size, color, unit_price, quantity, total_price, image_url)
VALUES
    ('o1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'Ensemble Tailleur Veste & Pantalon', '38', 'Blanc Os', 289.00, 1, 289.00, '/images/products/ensemble-tailleur.jpg'),
    ('o1111111-1111-1111-1111-111111111111', 'p2222222-2222-2222-2222-222222222222', 'Robe Midi Ceinturée Soie & Coton', '38', 'Noir Profond', 189.00, 1, 189.00, '/images/products/robe-ceinturee.jpg'),
    ('o2222222-2222-2222-2222-222222222222', 'p4444444-4444-4444-4444-444444444444', 'Veste Zippée Atelier Broderie Or', 'L', 'Noir Profond', 210.00, 1, 210.00, '/images/campaign/man-sport-chic.jpg'),
    ('o2222222-2222-2222-2222-222222222222', 'p3333333-3333-3333-3333-333333333333', 'Polo Piqué Signature Homme', 'L', 'Blanc Os', 95.00, 1, 95.00, '/images/products/polo-homme.jpg')
ON CONFLICT (id) DO NOTHING;
