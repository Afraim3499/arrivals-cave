import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCollections() {
    const { data, error } = await supabase.from('collections').select('*');
    if (error) console.error(error);
    else fs.writeFileSync('collections_log.json', JSON.stringify(data, null, 2), 'utf8');
}

checkCollections();
