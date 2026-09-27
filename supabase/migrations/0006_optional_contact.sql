-- Eventos gratuitos servem só para contar presença, então e-mail e
-- telefone deixam de ser obrigatórios no cadastro.
alter table registrations
  alter column email drop not null,
  alter column phone drop not null;
