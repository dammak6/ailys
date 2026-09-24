import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kafyatqatggifedqtctm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZnlhdHFhdGdnaWZlZHF0Y3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTcwNzgsImV4cCI6MjEwNTU3MzA3OH0.Uo7z-jd2-cBVAlndWhTCfuOxRCpapPK2A7dEBBUqWf4';

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function check() {
  console.log('=== 1. CATEGORIES TABLE ===');
  const { data: cats, error: e1 } = await sb.from('categories').select('*');
  console.log('Categories count:', cats?.length, e1 ? `Error: ${e1.message}` : '');
  console.log(cats);

  console.log('\n=== 2. COLLECTIONS TABLE ===');
  const { data: cols, error: e2 } = await sb.from('collections').select('*');
  console.log('Collections count:', cols?.length, e2 ? `Error: ${e2.message}` : '');
  console.log(cols);

  console.log('\n=== 3. COLLECTION_PRODUCTS TABLE (if any) ===');
  const { data: colProds, error: eColProds } = await sb.from('collection_products').select('*');
  console.log('Collection_products count:', colProds?.length, eColProds ? `Error: ${eColProds.message}` : '');

  console.log('\n=== 4. PRODUCTS TABLE ===');
  const { data: prods, error: e3 } = await sb.from('products').select('*');
  console.log('Products count:', prods?.length, e3 ? `Error: ${e3.message}` : '');
  console.log(prods?.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    category_id: p.category_id,
    is_active: p.is_active,
    is_archived: p.is_archived,
    created_at: p.created_at
  })));

  console.log('\n=== 5. PRODUCT IMAGES TABLE ===');
  const { data: imgs, error: e4 } = await sb.from('product_images').select('*');
  console.log('Images count:', imgs?.length, e4 ? `Error: ${e4.message}` : '');
  console.log(imgs?.map(i => ({
    id: i.id,
    product_id: i.product_id,
    image_url: i.image_url,
    is_primary: i.is_primary
  })));

  console.log('\n=== 6. PRODUCT VARIANTS TABLE ===');
  const { data: vars, error: e5 } = await sb.from('product_variants').select('*');
  console.log('Variants count:', vars?.length, e5 ? `Error: ${e5.message}` : '');
  console.log('Total stock:', vars?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0));
  console.log(vars?.slice(0, 10).map(v => ({
    id: v.id,
    product_id: v.product_id,
    size: v.size,
    color: v.color,
    sku: v.sku,
    stock_quantity: v.stock_quantity
  })));
}

check().catch(console.error);
