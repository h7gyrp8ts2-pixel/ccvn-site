-- Foto de fundo opcional no hero da home.
alter table site_settings
  add column if not exists hero_photo_path text;

insert into storage.buckets (id, name, public)
values ('hero', 'hero', true)
on conflict (id) do nothing;
