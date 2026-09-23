-- =============================================================================
-- AÏLYS PRODUCTION MIGRATION: 07 - REAL CMS & MEDIA SEED
-- =============================================================================

-- 1. MEDIA ASSETS

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


-- 2. HOMEPAGE SECTIONS & CONTENT

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
