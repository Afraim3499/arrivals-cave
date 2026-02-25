import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

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
    console.log('Fetching products...');
    const { data: products, error: pError } = await supabase.from('products').select('id, title, code, price, tags');
    if (pError) {
        console.error('Error fetching products:', pError);
        return;
    }

    console.log(`Processing ${products.length} products...`);
    for (const product of products) {
        const keywords = [
            product.title.toLowerCase(),
            product.code.toLowerCase(),
            `panjabi under ${Math.ceil(product.price / 500) * 500}`,
            `panjabi under ${product.price + 500}`,
            ...product.tags.map(t => t.toLowerCase())
        ];

        // Since I can't add a new column easily without CLI, 
        // I will use the 'tags' column for now or 'usp_bullets' if I want to store more data.
        // Actually, if I can't add a column, I'll just use the existing searchable fields 
        // and index them well in my search logic.

        // Wait, I should probably try to ADD the column if I can.
        // But without psql or supabase cli, it's hard.
        // I'll check if there is a 'postgrest' way to run SQL. (Usually not for security).
    }

    console.log('Enrichment plan formulated.');
}

run();
