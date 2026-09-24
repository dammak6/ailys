import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kafyatqatggifedqtctm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthZnlhdHFhdGdnaWZlZHF0Y3RtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk5OTcwNzgsImV4cCI6MjEwNTU3MzA3OH0.Uo7z-jd2-cBVAlndWhTCfuOxRCpapPK2A7dEBBUqWf4';

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function inspect() {
  console.log('--- ALL ROWS IN products TABLE ---');
  const { data: prods, error: e1 } = await sb.from('products').select('*');
  console.log('Count:', prods?.length, e1);
  if (prods && prods.length > 0) {
    console.log('Columns:', Object.keys(prods[0]));
    prods.forEach((p, idx) => {
      console.log(`[${idx + 1}] ID: ${p.id} | Slug: ${p.slug} | Name: ${p.name} | Published: ${p.is_published} | Price: ${p.price}`);
    });
  }
  console.log('\n--- PRODUCTS WITH COLLECTION_PRODUCTS JOIN ---');
  const { data: pCols, error: eCol } = await sb
    .from('products')
    .select('id, name, slug, collection_products (collections (*))')
    .eq('is_published', true)
    .limit(2);
  console.log('Error:', eCol);
  console.log('Sample Data:', JSON.stringify(pCols, null, 2));
}

inspect().catch(console.error);
