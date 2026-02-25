import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Fetching all products...');

    // 1. Fetch all products
    const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('id, title, slug');

    if (fetchError) {
        console.error('Error fetching products:', fetchError);
        process.exit(1);
    }

    console.log(`Found ${products.length} products. Updating...`);

    let successCount = 0;
    let errorCount = 0;

    // 2. Loop and update each product
    for (const product of products) {
        // Skip Rameen if it's already updated, though updating it again with the same string is harmless.
        const newSeoTitle = `${product.title} Elegant Eid Panjabi for Men | Buy Online in Bangladesh`;

        const { error: updateError } = await supabase
            .from('products')
            .update({ seo_title: newSeoTitle })
            .eq('id', product.id);

        if (updateError) {
            console.error(`Error updating product ${product.title} (${product.slug}):`, updateError);
            errorCount++;
        } else {
            console.log(`✅ Updated: ${product.title} -> ${newSeoTitle}`);
            successCount++;
        }
    }

    console.log(`\nFinished updating SEO Titles! Successfully updated: ${successCount}, Errors: ${errorCount}`);
    process.exit(0);
}

main();
