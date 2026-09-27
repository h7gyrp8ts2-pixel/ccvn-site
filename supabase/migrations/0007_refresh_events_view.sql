-- A view events_availability foi criada antes da coluna image_path existir
-- em events, e "e.*" numa view não acompanha colunas adicionadas depois via
-- ALTER TABLE — o Postgres fixa a lista de colunas na criação da view. Recria
-- a view para que ela passe a incluir image_path (e qualquer coluna futura).
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
