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



-- 5. HOMEPAGE SECTIONS
INSERT INTO homepage_sections (id, section_key, title, subtitle, display_order, is_enabled)
VALUES
    ('h1111111-1111-1111-1111-111111111111', 'hero', 'L''élégance au quotidien', 'Nouvelle Collection • 2026', 1, true),
    ('h2222222-2222-2222-2222-222222222222', 'new_collection', 'Lumière d''Été', 'Collection Maîtresse', 2, true),
    ('h3333333-3333-3333-3333-333333333333', 'philosophy', 'Quiet confidence, shaped by Tunisian light.', 'Philosophie de la Maison', 3, true),
    ('h4444444-4444-4444-4444-444444444444', 'craftsmanship', 'L''art du détail et de la confection', 'Savoir-Faire & Finitions', 4, true),
    ('h5555555-5555-5555-5555-555555555555', 'about', 'Une histoire de transmission, entre mère et fille.', 'L''Origine de la Maison', 5, true),
    ('h6666666-6666-6666-6666-666666666666', 'final_cta', 'Plongez dans l''univers AÏLYS', 'Maison de Confection Tunisienne', 6, true)
ON CONFLICT (id) DO NOTHING;

