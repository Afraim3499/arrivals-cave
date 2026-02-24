import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Need service role to bypass RLS easily for seeding
const supabase = createClient(supabaseUrl, supabaseKey);

const oldCollectionIds = [
    '24532aa4-2970-45d7-88e6-4cdfe70a24f0', // Kabli
    '6f78d1eb-6af6-4190-8479-20f7acdb77fc', // Waistcoats
];

const newCollections = [
    { slug: 'basarah', title: 'Basarah', description: 'Classic Panjabi', title_bn: 'বাসারাহ', description_bn: 'ক্লাসিক পাঞ্জাবি', is_active: true },
    { slug: 'heer', title: 'Heer', description: 'Premium Silk', title_bn: 'হীর', description_bn: 'প্রিমিয়াম সিল্ক', is_active: true },
    { slug: 'muraqsh', title: 'Muraqsh', description: 'Artisan Embroidery', title_bn: 'মুরাকশ', description_bn: 'আর্টিজান এমব্রয়ডারি', is_active: true },
    { slug: 'zameen', title: 'Zameen', description: 'Earthy Linen', title_bn: 'জমিন', description_bn: 'আর্থি লিনেন', is_active: true },
    { slug: 'sirash', title: 'Sirash', description: 'Minimal Cotton', title_bn: 'সিরাশ', description_bn: 'মিনিমাল কটন', is_active: true }
];

async function runMigration() {
    console.log("Starting Migration...");

    // 1. Delete old collections
    console.log("Deleting old collections...");
    for (const id of oldCollectionIds) {
        const { error } = await supabase.from('collections').delete().eq('id', id);
        if (error) console.error(`Error deleting ${id}:`, error.message);
        else console.log(`Deleted ${id}`);
    }

    // 2. Insert new collections and get their IDs
    console.log("Inserting new collections...");
    const collectionIds = {};
    for (const col of newCollections) {
        const { data: existing } = await supabase.from('collections').select('id').eq('slug', col.slug).single();
        let colId;
        if (existing) {
            console.log(`Collection ${col.slug} already exists.`);
            colId = existing.id;
        } else {
            const { data, error } = await supabase.from('collections').insert(col).select('id').single();
            if (error) {
                console.error(`Error inserting ${col.slug}:`, error.message);
                continue;
            }
            console.log(`Inserted ${col.slug} with ID ${data.id}`);
            colId = data.id;
        }
        collectionIds[col.slug] = colId;
    }

    // 3. Update products
    console.log("Updating products...");
    const { data: products } = await supabase.from('products').select('id, code');
    if (!products) {
        console.error("No products found.");
        return;
    }

    for (const p of products) {
        let targetCollectionSlug = null;
        if (p.code.startsWith('B')) targetCollectionSlug = 'basarah';
        else if (p.code.startsWith('H')) targetCollectionSlug = 'heer';
        else if (p.code.startsWith('M')) targetCollectionSlug = 'muraqsh';
        else if (p.code.startsWith('Z')) targetCollectionSlug = 'zameen';
        else if (p.code.startsWith('S')) targetCollectionSlug = 'sirash';

        if (targetCollectionSlug && collectionIds[targetCollectionSlug]) {
            const { error } = await supabase.from('products').update({ collection_id: collectionIds[targetCollectionSlug] }).eq('id', p.id);
            if (error) console.error(`Error updating product ${p.code}:`, error.message);
            else console.log(`Mapped ${p.code} to ${targetCollectionSlug}`);
        } else {
            console.log(`No mapping for ${p.code}`);
        }
    }

    console.log("Migration Complete.");
}

runMigration();
