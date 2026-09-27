-- CCVN Schweiz — conteúdo institucional editável (Sobre, Ministérios,
-- endereço/contato/pagamento), para não depender de deploy para atualizar.

create table if not exists site_settings (
  id int primary key default 1,
  about_quem_somos text not null default '',
  about_missao text not null default '',
  about_visao text not null default '',
  address_line1 text not null default '',
  address_line2 text not null default '',
  maps_query text not null default '',
  email text not null default '',
  instagram text not null default '',
  facebook text not null default '',
  youtube text not null default '',
  twint_number text not null default '',
  account_holder text not null default '',
  iban text not null default '',
  payment_notes text not null default '',
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id = 1)
);

insert into site_settings (
  id, about_quem_somos, about_missao, about_visao,
  address_line1, address_line2, maps_query, email,
  twint_number, account_holder, iban, payment_notes
)
values (
  1,
  'Somos uma família de pessoas transformadas por Cristo, que caminham juntos na fé, vivem o Evangelho e servem a Deus e ao próximo com amor. Não somos apenas uma igreja que realiza atividades; somos pessoas que pertencem umas às outras, que têm Cristo como centro e que desejam viver o Evangelho de maneira concreta.',
  'Evangelizar, discipular, formar pessoas maduras em Cristo, promover a comunhão e capacitar pessoas para o serviço.',
  'Ser uma Igreja acolhedora e viva, formada por pessoas transformadas por Cristo, espiritualmente maduras, unidas como família e comprometidas em servir a Deus e ao próximo.',
  'Lettenstrasse 7',
  '6343 Rotkreuz, Suíça',
  'Lettenstrasse 7, 6343 Rotkreuz, Switzerland',
  'contato@ccvn.ch',
  '+41 00 000 00 00',
  'Comunidade Cristã Vida Nova',
  'CH00 0000 0000 0000 0000 0',
  'Placeholder — atualizar com os dados reais de pagamento.'
)
on conflict (id) do nothing;

create table if not exists ministries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  position int not null default 0,
  created_at timestamptz not null default now()
);

insert into ministries (name, description, position)
select * from (values
  ('Pastoral', 'Cuidar da vida espiritual da igreja, conduzindo, ensinando, aconselhando e acompanhando os membros, além de orientar a igreja no cumprimento de sua missão. Prega e ensina a Palavra, pastoreia e aconselha os membros, conduz o discipulado e zela pela unidade e pela doutrina da igreja.', 1),
  ('Educação Cristã', 'Promove o ensino da Bíblia e o crescimento espiritual dos membros, ajudando cada pessoa a conhecer a Palavra de Deus e colocar os ensinos bíblicos em prática. Cuida do discipulado, prepara professores e realiza estudos bíblicos durante a semana.', 2),
  ('Homens', 'Promove o crescimento espiritual, a comunhão e o desenvolvimento de homens comprometidos com Cristo, com suas famílias, com a igreja e com a missão de Deus. Cria oportunidades de amizade, aconselhamento e edificação mútua.', 3),
  ('Mulheres', 'Promove o crescimento espiritual, a comunhão e o cuidado entre as mulheres, incentivando-as a viver sua fé, desenvolver seus dons e servir a Deus, à família e à igreja. Realiza encontros, estudos e atividades que aproximam as mulheres.', 4),
  ('Adolescentes', 'Acolhe, discipula e prepara adolescentes para seguir a Cristo, desenvolver seus dons e enfrentar os desafios da vida com fé. Cria um ambiente seguro e acolhedor, com orientação e apoio nessa fase da vida.', 5),
  ('Infantil', 'Existe para acolher, ensinar e discipular crianças, ajudando-as a conhecer a Cristo, crescer na fé e desenvolver uma vida de relacionamento com Deus, com amor, alegria e segurança.', 6),
  ('Casais', 'Fortalece os casamentos cristãos por meio do ensino bíblico, comunhão, oração e cuidado, ajudando os casais a desenvolverem um relacionamento saudável com Deus, entre si, com os filhos e com a comunidade.', 7),
  ('Intercessão', 'Leva diante de Deus, por meio da oração, as necessidades da igreja, das pessoas, da obra missionária e da sociedade. Promove uma cultura de oração e sustenta os líderes, com maturidade cristã, discrição e sigilo.', 8),
  ('Missões', 'Mobiliza e prepara a igreja para cumprir a Grande Comissão, levando o evangelho, servindo pessoas e apoiando a obra missionária local, nacional e mundial, em parceria com a presidência da igreja.', 9),
  ('Recepção/Integração', 'Recebe cada pessoa com amor, atenção e cordialidade, proporcionando um ambiente acolhedor e ajudando visitantes e novos membros a se integrarem à vida da igreja.', 10),
  ('Louvor & Adoração', 'Serve à igreja na adoração a Deus, auxiliando a congregação a expressar louvor, gratidão, entrega e proclamação da fé por meio da música e de outras expressões bíblicas de adoração.', 11),
  ('Mídia', 'Utiliza recursos de comunicação e tecnologia para apoiar a missão da igreja: cuida dos equipamentos de áudio, vídeo e transmissão, registra os momentos da igreja e cuida das redes sociais.', 12)
) as v(name, description, position)
where not exists (select 1 from ministries);

-- Bucket público para fotos da página Sobre (separado da galeria geral).
insert into storage.buckets (id, name, public)
values ('sobre', 'sobre', true)
on conflict (id) do nothing;

alter table site_settings enable row level security;
alter table ministries enable row level security;

drop policy if exists "site settings are publicly readable" on site_settings;
create policy "site settings are publicly readable"
  on site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "ministries are publicly readable" on ministries;
create policy "ministries are publicly readable"
  on ministries for select
  to anon, authenticated
  using (true);

-- Escrita (settings/ministries) só pelo painel admin, via service role
-- (bypassa RLS) — por isso não há policy de insert/update/delete para anon.
