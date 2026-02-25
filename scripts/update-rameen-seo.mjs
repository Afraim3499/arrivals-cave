import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Updating SEO Title for Rameen...');

    const { data, error } = await supabase
        .from('products')
        .update({ seo_title: 'Rameen Elegant Eid Panjabi for Men | Buy Online in Bangladesh' })
        .eq('slug', 'rameen-br-5002')
        .select();

    if (error) {
        console.error('Error updating Rameen SEO title:', error);
        process.exit(1);
    } else {
        console.log('Successfully updated Rameen SEO title!', data);
        process.exit(0);
    }
}

main();
