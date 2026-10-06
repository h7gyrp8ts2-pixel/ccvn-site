-- QR code do Twint exibido na página de pagamento dos eventos pagos.
alter table site_settings
  add column if not exists twint_qr_path text;

insert into storage.buckets (id, name, public)
values ('pagamento', 'pagamento', true)
on conflict (id) do nothing;
