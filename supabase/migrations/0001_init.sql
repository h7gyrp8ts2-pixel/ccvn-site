-- CCVN Schweiz — schema inicial: eventos e inscrições
create extension if not exists pgcrypto;

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null default '',
  event_date timestamptz not null,
  location text not null,
  price_chf numeric(10, 2) not null default 0,
  max_spots int not null check (max_spots > 0),
  reservation_days int not null default 7 check (reservation_days > 0),
  status text not null default 'ativo' check (status in ('ativo', 'encerrado')),
  created_at timestamptz not null default now()
);

create table if not exists registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  name text not null,
  email text not null,
  phone text not null,
  status text not null default 'reservado' check (status in ('reservado', 'confirmado')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create index if not exists registrations_event_id_idx on registrations (event_id);

-- Ao inserir uma inscrição, calcula expires_at automaticamente a partir do
-- prazo de reserva (reservation_days) configurado no evento. Isso evita
-- precisar de uma tarefa agendada: a expiração é resolvida no momento do
-- cadastro e reavaliada dinamicamente nas consultas (ver views abaixo).
create or replace function set_registration_expiry()
returns trigger
language plpgsql
as $$
begin
  select new.created_at + (e.reservation_days || ' days')::interval
  into new.expires_at
  from events e
  where e.id = new.event_id;

  if new.expires_at is null then
    raise exception 'evento % não encontrado', new.event_id;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_set_registration_expiry on registrations;
create trigger trg_set_registration_expiry
  before insert on registrations
  for each row
  execute function set_registration_expiry();

-- Status efetivo de cada inscrição, calculado em tempo real: uma reserva
-- não paga vira "expirado" assim que passa do prazo, sem job nenhum.
create or replace view registrations_view as
select
  r.*,
  case
    when r.status = 'confirmado' then 'confirmado'
    when r.status = 'reservado' and r.expires_at < now() then 'expirado'
    else 'reservado'
  end as effective_status
from registrations r;

-- Vagas restantes por evento: máximo - (confirmados + reservados dentro do prazo).
create or replace view events_availability as
select
  e.*,
  e.max_spots - coalesce(sum(
    case
      when r.status = 'confirmado' then 1
      when r.status = 'reservado' and r.expires_at >= now() then 1
      else 0
    end
  ), 0)::int as spots_remaining
from events e
left join registrations r on r.event_id = e.id
group by e.id;

alter table events enable row level security;
alter table registrations enable row level security;

-- Leitura pública dos eventos (para as páginas institucionais e de evento).
drop policy if exists "events are publicly readable" on events;
create policy "events are publicly readable"
  on events for select
  to anon, authenticated
  using (true);

-- Qualquer visitante pode se inscrever (inserir), mas não pode ler, alterar
-- ou apagar inscrições — isso protege nome/e-mail/telefone dos inscritos.
-- Leitura e atualização de inscrições passam apenas pelo painel admin, que
-- usa a service role key no servidor (bypassa RLS).
drop policy if exists "anyone can register" on registrations;
create policy "anyone can register"
  on registrations for insert
  to anon, authenticated
  with check (true);

-- Bucket público para a galeria de fotos (upload feito só pelo painel admin,
-- que usa a service role key e por isso não depende de policies de escrita).
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (select 1 from events where slug = 'encontro-de-mulheres') then
    insert into events (slug, name, description, event_date, location, price_chf, max_spots, reservation_days, status)
    values (
      'encontro-de-mulheres',
      'Encontro de Mulheres',
      'Um encontro especial para as mulheres da nossa comunidade, com louvor, palavra e comunhão.',
      now() + interval '30 days',
      'Rotkreuz, Lettenstrasse 7',
      20.00,
      40,
      7,
      'ativo'
    );
  end if;
end $$;
