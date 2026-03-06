import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Updated colours from "AC DATA - Sheet1 - Copy.csv"
const colorUpdates = [
    { code: 'BS-5001', color_label: 'Black', color_hex: '#000000' },
    { code: 'BR-5002', color_label: 'White', color_hex: '#FFFFFF' },
    { code: 'HG-1001', color_label: 'Lemonade/Onion Pink', color_hex: '#F7D488' },
    { code: 'HA-1002', color_label: 'Cream', color_hex: '#FFFDD0' },
    { code: 'HA-1003', color_label: 'Sky Blue', color_hex: '#87CEEB' },
    { code: 'HS-1004', color_label: 'Dark Purple', color_hex: '#301934' },
    { code: 'MN-2001', color_label: 'Navy Blue', color_hex: '#000080' },
    { code: 'MS-2002', color_label: 'Bottle Green', color_hex: '#006A4E' },
    { code: 'MN-2003', color_label: 'Navy Blue', color_hex: '#000080' },
    { code: 'MN-2004', color_label: 'White', color_hex: '#FFFFFF' },
    { code: 'MZ-2005', color_label: 'Off White', color_hex: '#FAF9F6' },
    { code: 'ZW-3001', color_label: 'Chocolate Brown', color_hex: '#7B3F00' },
    { code: 'ZS-3002', color_label: 'Teal Green', color_hex: '#008080' },
    { code: 'ZN-3003', color_label: 'Blue Gray', color_hex: '#6699CC' },
    { code: 'SA-4001', color_label: 'Brown', color_hex: '#964B00' },
    { code: 'SS-4002', color_label: 'Maroon', color_hex: '#800000' },
    { code: 'SA-4003', color_label: 'Gray', color_hex: '#808080' },
];

async function main() {
    console.log(`Updating colors for ${colorUpdates.length} products...\n`);

    let success = 0;
    let failed = 0;

    for (const item of colorUpdates) {
        const { data, error } = await supabase
            .from('products')
            .update({ color_label: item.color_label, color_hex: item.color_hex })
            .eq('code', item.code)
            .select('code, title, color_label, color_hex');

        if (error) {
            console.error(`✗ ${item.code}: ${error.message}`);
            failed++;
        } else if (!data || data.length === 0) {
            console.error(`✗ ${item.code}: No matching product found`);
            failed++;
        } else {
            console.log(`✓ ${data[0].code} (${data[0].title}) → ${data[0].color_label} (${data[0].color_hex})`);
            success++;
        }
    }

    console.log(`\nDone: ${success} updated, ${failed} failed.`);
    process.exit(failed > 0 ? 1 : 0);
}

main();
