-- Enable Storage
insert into storage.buckets (id, name, public) 
values ('products', 'products', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public) 
values ('blog', 'blog', true)
on conflict (id) do nothing;

-- Storage Policies (Products)
do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Public Access Products' and tablename = 'objects') then
    create policy "Public Access Products" on storage.objects for select using ( bucket_id = 'products' );
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Auth Upload Products' and tablename = 'objects') then
    create policy "Auth Upload Products" on storage.objects for insert with check ( bucket_id = 'products' and auth.role() = 'authenticated' );
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Auth Update Products' and tablename = 'objects') then
    create policy "Auth Update Products" on storage.objects for update using ( bucket_id = 'products' and auth.role() = 'authenticated' );
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Auth Delete Products' and tablename = 'objects') then
    create policy "Auth Delete Products" on storage.objects for delete using ( bucket_id = 'products' and auth.role() = 'authenticated' );
  end if;
end $$;

-- Storage Policies (Blog)
do $$ 
begin
  if not exists (select 1 from pg_policies where policyname = 'Public Access Blog' and tablename = 'objects') then
    create policy "Public Access Blog" on storage.objects for select using ( bucket_id = 'blog' );
  end if;
  
  if not exists (select 1 from pg_policies where policyname = 'Auth Upload Blog' and tablename = 'objects') then
    create policy "Auth Upload Blog" on storage.objects for insert with check ( bucket_id = 'blog' and auth.role() = 'authenticated' );
  end if;
end $$;
