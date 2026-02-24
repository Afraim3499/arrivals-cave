-- Seed Collections
insert into public.collections (title, title_bn, slug, description, description_bn, is_active)
values
  ('Eid Collection 2026', 'ঈদ কালেকশন ২০২৬', 'eid-collection-2026', 'Exclusive Panjabis for Eid', 'ঈদের জন্য বিশেষ পাঞ্জাবি', true),
  ('New Arrivals', 'নতুন কালেকশন', 'new-arrivals', 'Latest designs', 'সর্বশেষ ডিজাইন', true),
  ('Premium Panjabi', 'প্রিমিয়াম পাঞ্জাবি', 'premium-panjabi', 'Luxury fabrics and craftsmanship', 'বিলাসবহুল ফ্যাব্রিক এবং কারিগরি', true),
  ('Kabli Sets', 'কাবলি সেট', 'kabli-sets', 'Traditional Kabli sets', 'ঐতিহ্যবাহী কাবলি সেট', true),
  ('Waistcoats', 'কোটি / কটি', 'waistcoats', 'Stylish waistcoats', 'স্টাইলিশ কোটি', true)
on conflict (slug) do nothing;

-- Seed Home Settings
insert into public.home_settings (
  hero_title, hero_title_bn,
  hero_subtitle, hero_subtitle_bn,
  hero_cta_text, hero_cta_text_bn,
  hero_cta_link,
  eid_banner_visible,
  eid_banner_title, eid_banner_title_bn,
  eid_banner_link
) values (
  'Premium Panjabi Collection', 'প্রিমিয়াম পাঞ্জাবি কালেকশন',
  'Handcrafted elegance for the modern gentleman', 'আধুনিক পুরুষের জন্য হাতে তৈরি মার্জিত পাঞ্জাবি',
  'Shop Now', 'এখনই কিনুন',
  '/collection/premium-panjabi',
  true,
  'Eid Collection 2026 is Live', 'ঈদ কালেকশন ২০২৬ এখন লাইভ',
  '/eid-panjabi-collection'
);
