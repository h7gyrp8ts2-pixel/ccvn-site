-- Pedidos de oração (enviados pelo formulário da página Contato) e opções
-- de exibição de preço/vagas por evento.

create table if not exists prayer_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  contact text,
  message text not null,
  created_at timestamptz not null default now()
);

-- RLS ligado e sem nenhuma policy: ninguém lê ou escreve pela chave pública.
-- Pedidos de oração são sensíveis; só o servidor (service role) acessa.
alter table prayer_requests enable row level security;

alter table events
  add column if not exists show_spots boolean not null default true,
  add column if not exists show_price boolean not null default true;

-- A view fixa a lista de colunas na criação, então precisa ser recriada
-- para repassar as colunas novas (mesmo motivo da migração 0007).
drop view if exists events_availability;

create view events_availability as
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
