import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const imageMap = {
    'best-eid-panjabi-in-bangladesh-2026': '/products/arzoo-ha-1002/ARZOO.webp',
    'top-panjabi-trends-for-eid-2026': '/products/shamsheer-bs-5001/SHAMSHEER.webp',
    'eid-panjabi-price-in-bangladesh-2026': '/products/sabzar-zs-3002/SABZAR.webp',
    'which-eid-panjabi-gets-most-compliments': '/products/nehaj-mn-2003/NEHAJ.webp',
    'black-vs-white-eid-panjabi': '/products/arsham-sa-4001/1.webp',
    'best-eid-panjabi-under-3000': '/products/shahan-ss-4002/SHAHAN.webp',
    'best-eid-gift-panjabi-ideas': '/products/wazir-zw-3001/WAZIR.webp',
    'where-to-buy-premium-eid-panjabi-dhaka': '/products/gulrukh-hg-1001/1.webp',
    'last-minute-eid-panjabi-buying-guide': '/products/zayan-mz-2005/1.webp',
    'premium-eid-panjabis-ready-for-delivery': '/images/hero/eid_collection_from_arrivals_cave.webp'
};

async function main() {
    console.log('Fixing blog images to be unique...');

    for (const [slug, image] of Object.entries(imageMap)) {
        const { error } = await supabase
            .from('blog_posts')
            .update({ featured_image: image })
            .eq('slug', slug);

        if (error) {
            console.error(`Error updating ${slug}:`, error);
        } else {
            console.log(`✅ Updated ${slug} with ${image}`);
        }
    }

    console.log('\nVerifying current blog states...');
    const { data } = await supabase
        .from('blog_posts')
        .select('slug, title, content_markdown');

    data.forEach(blog => {
        const wordCount = blog.content_markdown?.split(/\s+/).length || 0;
        console.log(`- ${blog.slug}: ${wordCount} words`);
    });

    process.exit(0);
}

main();
