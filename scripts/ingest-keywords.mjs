import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(
    supabaseUrl,
    supabaseKey
);

async function run() {
    console.log('Fetching products for keyword ingestion...');
    const { data: products, error: pError } = await supabase.from('products').select('*');
    if (pError) {
        console.error('Error fetching products:', pError);
        return;
    }

    let updatedCount = 0;

    for (const p of products) {
        // Build a massive array of rich keywords
        const keywords = new Set(p.tags || []);

        // Add permutations and related terms
        if (p.color_label) keywords.add(p.color_label);
        if (p.fabric) keywords.add(p.fabric);

        const priceRanges = [
            `under ${Math.ceil(p.price / 500) * 500}`,
            `below ${Math.ceil(p.price / 500) * 500}`,
            `budget ${Math.ceil(p.price / 500) * 500}`
        ];
        priceRanges.forEach(pr => keywords.add(pr));

        if (p.is_eid_pick) keywords.add('eid');
        if (p.is_best_seller) keywords.add('best seller');
        if (p.is_new_arrival) keywords.add('new arrival');

        // Tokenize title
        const tokens = p.title.toLowerCase().split(' ').filter(t => t.length > 2);
        tokens.forEach(t => keywords.add(t));

        const newTags = Array.from(keywords);

        // Let's store these rich keywords back in tags (or seo_meta if we don't want to pollute frontend tags)
        // Actually, frontend tags are used for UI filters. Let's append to usp_bullets or a dedicated JSON field?
        // stock_by_size is JSON, we can't use that.
        // We can just append them to the 'seo_meta' field as a comma separated string so we can ilike search it easily!
        const searchMeta = newTags.join(', ').toLowerCase();

        const { error: updateError } = await supabase
            .from('products')
            .update({ seo_meta: searchMeta })
            .eq('id', p.id);

        if (updateError) {
            console.error(`Failed to update product ${p.code}:`, updateError);
        } else {
            updatedCount++;
        }
    }

    console.log(`Successfully ingested rich search keywords into 'seo_meta' for ${updatedCount} products.`);

    console.log('Fetching landing pages...');
    const { data: pages, error: lError } = await supabase.from('seo_landing_pages').select('*');
    if (!lError && pages) {
        let pCount = 0;
        for (const page of pages) {
            const meta = [page.title, page.slug.replace(/-/g, ' '), page.type].join(', ').toLowerCase();
            await supabase.from('seo_landing_pages').update({ meta_description: page.meta_description || meta }).eq('id', page.id);
            pCount++;
        }
        console.log(`Updated ${pCount} landing pages.`);
    }
}

run();
