-- Seed Products (17 items) — Idempotent (uses upsert)
-- Prices are placeholders tailored to collection tier (Basarah=Basic, Heer=Premium)
-- Stock is dummy data

DO $$
DECLARE
  c_basarah uuid;
  c_heer uuid;
  c_muraqsh uuid;
  c_zameen uuid;
  c_sirash uuid;
BEGIN
  select id into c_basarah from collections where slug = 'basarah';
  select id into c_heer from collections where slug = 'heer';
  select id into c_muraqsh from collections where slug = 'muraqsh';
  select id into c_zameen from collections where slug = 'zameen';
  select id into c_sirash from collections where slug = 'sirash';

  -- Basarah (Classic) - 2500 BDT
  insert into products (code, title, title_bn, slug, collection_id, price, stock_by_size, color_label, color_hex, fabric, images, is_new_arrival, tags) values
  ('BS-5001', 'Shamsheer', 'শামশের', 'shamsheer-bs-5001', c_basarah, 3450, '{"M":5,"L":5,"XL":5,"XXL":2}', 'Black', '#000000', 'Cotton', '{"/products/shamsheer-bs-5001/SHAMSHEER.webp","/products/shamsheer-bs-5001/2.webp","/products/shamsheer-bs-5001/3.webp","/products/shamsheer-bs-5001/4.webp"}', true, '{"cotton","classic","black","eid","kabli"}'),
  ('BR-5002', 'Rameen', 'রামীন', 'rameen-br-5002', c_basarah, 3540, '{"M":5,"L":5,"XL":5,"XXL":2}', 'White', '#FFFFFF', 'Cotton', '{"/products/rameen-br-5002/RAMEEN.webp","/products/rameen-br-5002/2 (1).webp","/products/rameen-br-5002/3.webp","/products/rameen-br-5002/4.webp"}', true, '{"cotton","classic","white","eid"}')
  on conflict (code) do update set
    title = excluded.title, title_bn = excluded.title_bn, slug = excluded.slug,
    collection_id = excluded.collection_id, price = excluded.price,
    stock_by_size = excluded.stock_by_size, color_label = excluded.color_label,
    color_hex = excluded.color_hex, fabric = excluded.fabric,
    images = excluded.images, is_new_arrival = excluded.is_new_arrival,
    tags = excluded.tags;

  -- Heer (Premium) - 4500 BDT
  insert into products (code, title, title_bn, slug, collection_id, price, stock_by_size, color_label, color_hex, fabric, images, is_new_arrival, is_eid_pick, tags) values
  ('HG-1001', 'Gulrukh', 'গুলরুখ', 'gulrukh-hg-1001', c_heer, 3680, '{"M":3,"L":3,"XL":2,"XXL":1}', 'Lemonade/Onion Pink', '#F7D488', 'Silk', '{"/products/gulrukh-hg-1001/1.webp","/products/gulrukh-hg-1001/2.webp","/products/gulrukh-hg-1001/3.webp"}', true, true, '{"premium","pink","lemonade","embroidered","silk","eid","kabli"}'),
  ('HA-1002', 'Arzoo', 'আরজু', 'arzoo-ha-1002', c_heer, 2999, '{"M":3,"L":3,"XL":2,"XXL":1}', 'Cream', '#FFFDD0', 'Silk', '{"/products/arzoo-ha-1002/ARZOO.webp","/products/arzoo-ha-1002/2.webp","/products/arzoo-ha-1002/3.webp","/products/arzoo-ha-1002/4.webp"}', true, true, '{"premium","cream","embroidered","silk","eid"}'),
  ('HA-1003', 'Ayzel', 'আইজেল', 'ayzel-ha-1003', c_heer, 3590, '{"M":3,"L":3,"XL":2,"XXL":1}', 'Sky Blue', '#87CEEB', 'Silk', '{"/products/ayzel-ha-1003/1.webp","/products/ayzel-ha-1003/2.webp","/products/ayzel-ha-1003/3.webp","/products/ayzel-ha-1003/4.webp"}', true, true, '{"premium","blue","sky-blue","embroidered","silk","eid"}'),
  ('HS-1004', 'Shahzad', 'শাহজাদ', 'shahzad-hs-1004', c_heer, 3100, '{"M":3,"L":3,"XL":2,"XXL":1}', 'Dark Purple', '#301934', 'Premium Cotton', '{"/products/shahzad-hs-1004/1.webp","/products/shahzad-hs-1004/2.webp","/products/shahzad-hs-1004/3.webp","/products/shahzad-hs-1004/4.webp"}', true, true, '{"premium","purple","dark-purple","embroidered","cotton","eid"}')
  on conflict (code) do update set
    title = excluded.title, title_bn = excluded.title_bn, slug = excluded.slug,
    collection_id = excluded.collection_id, price = excluded.price,
    stock_by_size = excluded.stock_by_size, color_label = excluded.color_label,
    color_hex = excluded.color_hex, fabric = excluded.fabric,
    images = excluded.images, is_new_arrival = excluded.is_new_arrival,
    is_eid_pick = excluded.is_eid_pick, tags = excluded.tags;

  -- Muraqsh (Artisan) - 3500 BDT
  insert into products (code, title, title_bn, slug, collection_id, price, stock_by_size, color_label, color_hex, fabric, images, is_new_arrival, is_eid_pick, tags) values
  ('MN-2001', 'Neelkaar', 'নীলকার', 'neelkaar-mn-2001', c_muraqsh, 2870, '{"M":4,"L":4,"XL":3,"XXL":2}', 'Navy Blue', '#000080', 'Mixed', '{"/products/neelkaar-mn-2001/1.webp","/products/neelkaar-mn-2001/2.webp","/products/neelkaar-mn-2001/3.webp","/products/neelkaar-mn-2001/4.webp"}', true, true, '{"artisan","navy-blue","blue","embroidered","eid"}'),
  ('MS-2002', 'Subhkaar', 'শুভকার', 'subhkaar-ms-2002', c_muraqsh, 3499, '{"M":4,"L":4,"XL":3,"XXL":2}', 'Bottle Green', '#006A4E', 'Mixed', '{"/products/subhkaar-ms-2002/1.webp","/products/subhkaar-ms-2002/2.webp","/products/subhkaar-ms-2002/3.webp","/products/subhkaar-ms-2002/4.webp"}', true, true, '{"artisan","green","bottle-green","embroidered","eid"}'),
  ('MN-2003', 'Nehaj', 'নেহাজ', 'nehaj-mn-2003', c_muraqsh, 2400, '{"M":4,"L":4,"XL":3,"XXL":2}', 'Navy Blue', '#000080', 'Mixed', '{"/products/nehaj-mn-2003/NEHAJ.webp","/products/nehaj-mn-2003/2.webp","/products/nehaj-mn-2003/3.webp","/products/nehaj-mn-2003/4.webp"}', true, true, '{"artisan","navy-blue","blue","embroidered","eid"}'),
  ('MN-2004', 'Noor', 'নূর', 'noor-mn-2004', c_muraqsh, 2690, '{"M":4,"L":4,"XL":3,"XXL":2}', 'White', '#FFFFFF', 'Mixed', '{"/products/noor-mn-2004/1.webp","/products/noor-mn-2004/2.webp","/products/noor-mn-2004/3 (1).webp","/products/noor-mn-2004/4 (1).webp"}', true, true, '{"artisan","white","embroidered","eid"}'),
  ('MZ-2005', 'Zayan', 'জায়ান', 'zayan-mz-2005', c_muraqsh, 3450, '{"M":4,"L":4,"XL":3,"XXL":2}', 'Off White', '#FAF9F6', 'Mixed', '{"/products/zayan-mz-2005/1.webp","/products/zayan-mz-2005/2.webp","/products/zayan-mz-2005/3.webp","/products/zayan-mz-2005/4.webp"}', true, true, '{"artisan","off-white","white","embroidered","eid"}')
  on conflict (code) do update set
    title = excluded.title, title_bn = excluded.title_bn, slug = excluded.slug,
    collection_id = excluded.collection_id, price = excluded.price,
    stock_by_size = excluded.stock_by_size, color_label = excluded.color_label,
    color_hex = excluded.color_hex, fabric = excluded.fabric,
    images = excluded.images, is_new_arrival = excluded.is_new_arrival,
    is_eid_pick = excluded.is_eid_pick, tags = excluded.tags;

  -- Zameen (Earthy) - 3000 BDT
  insert into products (code, title, title_bn, slug, collection_id, price, stock_by_size, color_label, color_hex, fabric, images, is_new_arrival, is_eid_pick, tags) values
  ('ZW-3001', 'Wazir', 'ওয়াজির', 'wazir-zw-3001', c_zameen, 3499, '{"M":5,"L":5,"XL":4,"XXL":2}', 'Chocolate Brown', '#7B3F00', 'Linen', '{"/products/wazir-zw-3001/WAZIR.webp","/products/wazir-zw-3001/2.webp","/products/wazir-zw-3001/3.webp","/products/wazir-zw-3001/4.webp"}', true, true, '{"earthy","brown","chocolate-brown","geometric","linen","eid","kabli"}'),
  ('ZS-3002', 'Sabzar', 'সবযার', 'sabzar-zs-3002', c_zameen, 3540, '{"M":5,"L":5,"XL":4,"XXL":2}', 'Teal Green', '#008080', 'Linen', '{"/products/sabzar-zs-3002/SABZAR.webp","/products/sabzar-zs-3002/2.webp","/products/sabzar-zs-3002/3.webp","/products/sabzar-zs-3002/4.webp"}', true, true, '{"earthy","green","teal-green","geometric","linen","eid"}'),
  ('ZN-3003', 'Neelash', 'নীলাশ', 'neelash-zn-3003', c_zameen, 2499, '{"M":5,"L":5,"XL":4,"XXL":2}', 'Blue Gray', '#6699CC', 'Linen', '{"/products/neelash-zn-3003/1.webp","/products/neelash-zn-3003/2.webp","/products/neelash-zn-3003/3.webp","/products/neelash-zn-3003/4.webp"}', true, true, '{"earthy","blue","blue-gray","geometric","linen","kabli","eid"}')
  on conflict (code) do update set
    title = excluded.title, title_bn = excluded.title_bn, slug = excluded.slug,
    collection_id = excluded.collection_id, price = excluded.price,
    stock_by_size = excluded.stock_by_size, color_label = excluded.color_label,
    color_hex = excluded.color_hex, fabric = excluded.fabric,
    images = excluded.images, is_new_arrival = excluded.is_new_arrival,
    is_eid_pick = excluded.is_eid_pick, tags = excluded.tags;

  -- Sirash (Minimal) - 2800 BDT
  insert into products (code, title, title_bn, slug, collection_id, price, stock_by_size, color_label, color_hex, fabric, images, is_new_arrival, is_eid_pick, tags) values
  ('SA-4001', 'Arsham', 'আরশাম', 'arsham-sa-4001', c_sirash, 2430, '{"M":5,"L":5,"XL":4,"XXL":2}', 'Brown', '#964B00', 'Soft Cotton', '{"/products/arsham-sa-4001/ARSHAM.webp","/products/arsham-sa-4001/2.webp","/products/arsham-sa-4001/3.webp","/products/arsham-sa-4001/4.webp"}', true, true, '{"minimal","solid","brown","short","cotton","eid"}'),
  ('SS-4002', 'Shahan', 'শাহান', 'shahan-ss-4002', c_sirash, 2399, '{"M":5,"L":5,"XL":4,"XXL":2}', 'Maroon', '#800000', 'Soft Cotton', '{"/products/shahan-ss-4002/SHAHAN.webp","/products/shahan-ss-4002/3.webp","/products/shahan-ss-4002/4.webp","/products/shahan-ss-4002/5.webp"}', true, true, '{"minimal","solid","maroon","short","cotton","eid"}'),
  ('SA-4003', 'Aftab', 'আফতাব', 'aftab-sa-4003', c_sirash, 2250, '{"M":5,"L":5,"XL":4,"XXL":2}', 'Gray', '#808080', 'Soft Cotton', '{"/products/aftab-sa-4003/1.webp","/products/aftab-sa-4003/2.webp","/products/aftab-sa-4003/3.webp","/products/aftab-sa-4003/4.webp"}', true, true, '{"minimal","solid","gray","short","cotton","eid"}')
  on conflict (code) do update set
    title = excluded.title, title_bn = excluded.title_bn, slug = excluded.slug,
    collection_id = excluded.collection_id, price = excluded.price,
    stock_by_size = excluded.stock_by_size, color_label = excluded.color_label,
    color_hex = excluded.color_hex, fabric = excluded.fabric,
    images = excluded.images, is_new_arrival = excluded.is_new_arrival,
    is_eid_pick = excluded.is_eid_pick, tags = excluded.tags;

END $$;
