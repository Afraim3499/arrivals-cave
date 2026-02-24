-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. Collections Table
create table if not exists public.collections (
  id uuid primary key default uuid_generate_v4(),
  slug text not null,
  title text not null, -- English title
  description text,
  image_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Localized fields
  title_bn text,
  description_bn text,

  -- SEO fields
  meta_title_en text,
  meta_title_bn text,
  meta_description_en text,
  meta_description_bn text,
  
  constraint collections_slug_key unique (slug)
);

-- 2. Products Table
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  code text not null, -- e.g. "EID-24-001"
  title text not null,
  slug text not null,
  description text,
  price numeric not null default 0,
  compare_at_price numeric, -- For discounts
  
  collection_id uuid references public.collections(id),
  
  -- Stock per size (JSONB: { "M": 10, "L": 5, "XL": 0, "XXL": 2 })
  stock_by_size jsonb not null default '{}'::jsonb,
  
  -- Product Details
  color_label text,
  color_label_bn text,
  color_hex text,
  fabric text,
  fabric_bn text,
  sort_order int default 0,
  
  -- Images (Array of URLs, first is main)
  images text[] not null default '{}'::text[],
  
  -- Tags for filtering (e.g. ["cotton", "black", "premium", "eid"])
  tags text[] not null default '{}'::text[],
  
  is_active boolean default true,
  is_new_arrival boolean default false,
  is_best_seller boolean default false,
  is_eid_pick boolean default false, -- Special flag for Eid
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Localized fields
  title_bn text,
  description_bn text,

  -- Story/Editorial fields
  story_markdown text,
  story_markdown_bn text,
  seo_title text,
  seo_meta text,
  usp_bullets text[] not null default '{}'::text[],
  
  constraint products_code_key unique (code),
  constraint products_slug_key unique (slug)
);

-- Schema Evolution: Ensure new columns exist if table was already created
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='stock_by_size') then
    alter table public.products add column stock_by_size jsonb not null default '{}'::jsonb;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='color_label') then
    alter table public.products add column color_label text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='color_label_bn') then
    alter table public.products add column color_label_bn text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='color_hex') then
    alter table public.products add column color_hex text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='fabric') then
    alter table public.products add column fabric text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='fabric_bn') then
    alter table public.products add column fabric_bn text;
  end if;
    
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='tags') then
    alter table public.products add column tags text[] not null default '{}'::text[];
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='images') then
    alter table public.products add column images text[] not null default '{}'::text[];
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='is_new_arrival') then
    alter table public.products add column is_new_arrival boolean default false;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='is_best_seller') then
    alter table public.products add column is_best_seller boolean default false;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='is_eid_pick') then
    alter table public.products add column is_eid_pick boolean default false;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='title_bn') then
    alter table public.products add column title_bn text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='description_bn') then
    alter table public.products add column description_bn text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='story_markdown') then
    alter table public.products add column story_markdown text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='story_markdown_bn') then
    alter table public.products add column story_markdown_bn text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='seo_title') then
    alter table public.products add column seo_title text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='seo_meta') then
    alter table public.products add column seo_meta text;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='usp_bullets') then
    alter table public.products add column usp_bullets text[] not null default '{}'::text[];
  end if;
end $$;

-- 3. SEO Landing Pages (City/Price/Eid pages)
create table if not exists public.seo_landing_pages (
  id uuid primary key default uuid_generate_v4(),
  slug text not null, -- e.g. "panjabi-price-in-bd"
  type text not null, -- 'city', 'search', 'eid', 'style'
  
  title text not null,
  meta_description text,
  h1_heading text,
  content_markdown text, -- Main SEO text content
  
  -- FAQ Section (JSONB array of {question: string, answer: string})
  faq_items jsonb default '[]'::jsonb,
  
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Localized fields
  title_bn text,
  meta_description_bn text,
  h1_heading_bn text,
  content_markdown_bn text,
  faq_items_bn jsonb default '[]'::jsonb,
  
  constraint seo_pages_slug_key unique (slug)
);

-- 4. Blog Posts (Search Demand Hub)
create table if not exists public.blog_posts (
  id uuid primary key default uuid_generate_v4(),
  slug text not null,
  title text not null,
  excerpt text,
  content_markdown text,
  featured_image text,
  
  -- Content Cluster: 'eid', 'price-city', 'style', 'sizing', 'general'
  cluster text not null,
  
  author text default 'Arrivals Cave Team',
  published_at timestamp with time zone default timezone('utc'::text, now()),
  is_published boolean default false,
  
  -- Localized fields
  title_bn text,
  excerpt_bn text,
  content_markdown_bn text,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  constraint blog_posts_slug_key unique (slug)
);

-- 5. Home Settings (Banner, specific featured IDs)
create table if not exists public.home_settings (
  id uuid primary key default uuid_generate_v4(),
  hero_title text,
  hero_subtitle text,
  hero_cta_text text,
  hero_cta_link text,
  hero_background_image text,
  
  eid_banner_visible boolean default false,
  eid_banner_title text,
  eid_banner_link text,
  
  -- Localized fields
  hero_title_bn text,
  hero_subtitle_bn text,
  hero_cta_text_bn text,
  eid_banner_title_bn text,
  
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
do $$ 
begin
  alter table public.collections enable row level security;
  alter table public.products enable row level security;
  alter table public.seo_landing_pages enable row level security;
  alter table public.blog_posts enable row level security;
  alter table public.home_settings enable row level security;
exception
  when others then null;
end $$;

-- Functions
create or replace function public.calculate_price_range(collection_uuid uuid)
returns table (min_price numeric, max_price numeric)
language plpgsql
security definer
as $$
begin
  return query
  select min(price), max(price)
  from products
  where collection_id = collection_uuid
    and is_active = true;
end;
$$;

-- Public Read Access Policies
do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Public can view active collections') then
    create policy "Public can view active collections" on public.collections for select using (is_active = true);
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Public can view active products') then
    create policy "Public can view active products" on public.products for select using (is_active = true);
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Public can view active seo pages') then
    create policy "Public can view active seo pages" on public.seo_landing_pages for select using (is_active = true);
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Public can view published blog posts') then
    create policy "Public can view published blog posts" on public.blog_posts for select using (is_published = true);
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Public can view home settings') then
    create policy "Public can view home settings" on public.home_settings for select using (true);
  end if;
end $$;
