-- Seed SEO Landing Pages (City & Category Pages)
insert into public.seo_landing_pages (slug, type, title, title_bn, meta_description, meta_description_bn, h1_heading, h1_heading_bn, content_markdown, content_markdown_bn)
values
  (
    'panjabi-price-in-chattogram', 'city', 
    'Panjabi Price in Chattogram – Premium Ethnic Wear', 'চট্টগ্রামে পাঞ্জাবির দাম – প্রিমিয়াম এথনিক ওয়্যার',
    'Explore the latest Panjabi collection with prices in Chattogram. Fast delivery across the port city.', 'চট্টগ্রামে পাঞ্জাবির লেটেস্ট কালেকশন এবং দাম দেখুন। পুরো বন্দর নগরীতে দ্রুত ডেলিভারি।',
    'Panjabi Price in Chattogram – Online Shop', 'চট্টগ্রামে পাঞ্জাবির দাম – অনলাইন শপ',
    'Bringing the finest Panjabis home to Chattogram. Shop from our curated collection for any occasion.', 'চট্টগ্রামের জন্য সেরা পাঞ্জাবি নিয়ে এল অ্যারাইভালস কেভ। যেকোনো অনুষ্ঠানের জন্য আমাদের কালেকশন দেখুন।'
  ),
  (
    'panjabi-price-in-sylhet', 'city', 
    'Panjabi Price in Sylhet – Royal Collection 2026', 'সিলেটে পাঞ্জাবির দাম – রয়্যাল কালেকশন ২০২৬',
    'Find exclusive Panjabis at best prices in Sylhet. Nationwide delivery from Arrivals Cave.', 'সিলেটে সেরা দামে এক্সক্লুসিভ পাঞ্জাবি খুঁজুন। অ্যারাইভালস কেভ থেকে সারা বাংলাদেশে ডেলিভারি।',
    'Panjabi Price in Sylhet – Royal Collection 2026', 'সিলেটে পাঞ্জাবির দাম – রয়্যাল কালেকশন ২০২৬',
    'Luxury Panjabis for the tea capital. Quality fabrics and classic designs.', 'সিলেটের জন্য লাক্সারি পাঞ্জাবি। উন্নত ফ্যাব্রিক এবং ক্লাসিক ডিজাইন।'
  ),
  (
    'black-panjabi', 'style', 
    'Black Panjabi Collection – The Classic Choice', 'কালো পাঞ্জাবি কালেকশন – ক্লাসিক পছন্দ',
    'Shop the bold and elegant black Panjabi collection. Perfect for any formal or festive event.', 'বোল্ড এবং মার্জিত কালো পাঞ্জাবি কালেকশন দেখুন। যেকোনো অনুষ্ঠানের জন্য উপযুক্ত।',
    'Premium Black Panjabi Collection', 'প্রিমিয়াম কালো পাঞ্জাবি কালেকশন',
    'Discover our signature black Panjabis crafted with midnight fabrics and golden details.', 'আমাদের সিগনেচার কালো পাঞ্জাবি কালেকশন দেখুন।'
  ),
  (
    'white-panjabi', 'style', 
    'White Panjabi Collection – Purity & Style', 'সাদা পাঞ্জাবি কালেকশন – আভিজাত্য ও স্টাইল',
    'Explore pristine white Panjabis for a clean and sophisticated look. Cotton and silk options.', 'সাদা পাঞ্জাবি কালেকশন দেখুন। কটন এবং সিল্কের চমৎকার সব ডিজাইন।',
    'Elegant White Panjabi Collection', 'আভিজাত্যপূর্ণ সাদা পাঞ্জাবি কালেকশন',
    'A timeless collection of white Panjabis that define grace and simplicity.', 'সাদা পাঞ্জাবির কালজয়ী কালেকশন যা আভিজাত্য এবং সারল্যের পরিচয় দেয়।'
  ),
  (
    'eid-panjabi-collection', 'style', 
    'Eid Panjabi Collection 2026 – Arrivals Cave', 'ঈদ পাঞ্জাবি কালেকশন ২০২৬ – অ্যারাইভালস কেভ',
    'Celebrate Eid with our exclusive 2026 Panjabi collection. Limited edition designs for the festive season.', 'আমাদের এক্সক্লুসিভ ২০২৬ পাঞ্জাবি কালেকশন দিয়ে ঈদ উদযাপন করুন। সিজনাল লিমিটেড ডিজাইন।',
    'Eid Panjabi Collection 2026', 'ঈদ পাঞ্জাবি কালেকশন ২০২৬',
    'The most awaited collection of the year is here. Elegant embroideries and festive colors.', 'বছরের সবচেয়ে প্রতীক্ষিত কালেকশন এখন আমাদের কাছে। চমৎকার এমব্রয়ডারি এবং উৎসবের রঙ।'
  )
on conflict (slug) do update set
  title = excluded.title,
  title_bn = excluded.title_bn,
  meta_description = excluded.meta_description,
  meta_description_bn = excluded.meta_description_bn;

-- Seed Blog Posts
insert into public.blog_posts (slug, title, title_bn, excerpt, excerpt_bn, content_markdown, content_markdown_bn, cluster, is_published)
values
  (
    'how-to-choose-the-perfect-panjabi', 
    'How to Choose the Perfect Panjabi for Your Body Type', 'আপনার বডি টাইপ অনুযায়ী সঠিক পাঞ্জাবি বেছে নেওয়ার নিয়ম',
    'A guide to finding the best fit and style for different body shapes.', 'বিভিন্ন বডি শেপের জন্য সেরা ফিট এবং স্টাইল খুঁজে নেওয়ার গাইড।',
    'Choosing the perfect Panjabi is about more than just the fabric...', 'সঠিক পাঞ্জাবি বেছে নেওয়া মানে শুধু ফ্যাব্রিক নয়...',
    'style', true
  ),
  (
    'trending-panjabi-colors-2026', 
    'Trending Panjabi Colors for 2026', '২০২৬ সালে পাঞ্জাবির জনপ্রিয় কালারগুলো',
    'Discover which colors are ruling the fashion world this year.', 'এই বছর ফ্যাশন বিশ্বে রাজত্ব করছে যে কালারগুলো সেগুলো জানুন।',
    'From deep emerald to classic gold, here are the top picks...', 'ডিপ এমেরাল্ড থেকে ক্লাসিক গোল্ড, এখানে রয়েছে সেরা পছন্দগুলো...',
    'general', true
  ),
  (
    'panjabi-fabric-guide-cotton-vs-silk', 
    'Panjabi Fabric Guide: Cotton vs. Silk', 'পাঞ্জাবি ফ্যাব্রিক গাইড: কটন বনাম সিল্ক',
    'Understanding the differences to choose the most comfortable fabric for any weather.', 'যেকোনো আবহাওয়ায় আরামদায়ক ফ্যাব্রিক বেছে নেওয়ার জন্য পার্থক্যগুলো বুঝুন।',
    'When it comes to Panjabis, fabric is the soul of the garment...', 'পাঞ্জাবির ক্ষেত্রে ফ্যাব্রিকই হল এর প্রাণ...',
    'general', true
  )
on conflict (slug) do nothing;
