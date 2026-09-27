-- Imagem/flyer opcional por evento.
alter table events
  add column if not exists image_path text;

insert into storage.buckets (id, name, public)
values ('eventos', 'eventos', true)
on conflict (id) do nothing;
