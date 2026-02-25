import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Clearing all existing blog posts...');

    // Using a trick to delete all rows by matching a condition that's always true.
    // In Supabase, deleting without eq() might be blocked if 'Safe Updates' are active,
    // but using not.is.null on primary key usually works.
    const { data, error } = await supabase
        .from('blog_posts')
        .delete()
        .not('id', 'is', null);

    if (error) {
        console.error('Error deleting blog posts:', error);
        process.exit(1);
    }

    console.log('Successfully cleared all blog posts!');
    process.exit(0);
}

main();
