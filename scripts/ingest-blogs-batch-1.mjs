import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateBlog(slug, image, content) {
    console.log(`Updating ${slug}...`);
    const { error } = await supabase
        .from('blog_posts')
        .update({
            content_markdown: content,
            featured_image: image,
            updated_at: new Date().toISOString()
        })
        .eq('slug', slug);
    if (error) console.error(`Error updating ${slug}:`, error);
    else console.log(`✅ Updated ${slug} (${content.split(/\s+/).length} words)`);
}

const blog1 = `... (long content) ...`; // I will fill these in the next tool call
const blog2 = `... (long content) ...`;
// ...
