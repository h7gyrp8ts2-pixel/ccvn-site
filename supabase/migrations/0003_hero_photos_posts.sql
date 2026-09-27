-- CCVN Schweiz — hero editável, foto por ministério, e avisos/posts (para
-- flyers de eventos externos ou atividades que não precisam de inscrição).

alter table site_settings
  add column if not exists hero_title text not null default 'Um lugar para viver fé, comunhão e propósito juntos.',
  add column if not exists hero_subtitle text not null default 'bem-vindos à nossa comunidade';

alter table ministries
  add column if not exists photo_path text;

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_path text,
  external_link text,
  event_date timestamptz,
  created_at timestamptz not null default now()
);

alter table posts enable row level security;

drop policy if exists "posts are publicly readable" on posts;
create policy "posts are publicly readable"
  on posts for select
  to anon, authenticated
  using (true);

-- Buckets públicos para foto de ministério e imagens de avisos/flyers.
insert into storage.buckets (id, name, public)
values ('ministerios', 'ministerios', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('posts', 'posts', true)
on conflict (id) do nothing;
