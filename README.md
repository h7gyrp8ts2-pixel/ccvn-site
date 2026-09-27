# CCVN Schweiz — site institucional

Site da Comunidade Cristã Vida Nova (Rotkreuz, Suíça): páginas institucionais
e sistema de eventos com inscrição paga e controle de vagas.

Stack: Next.js (App Router) + Tailwind CSS v4 + Supabase (Postgres + Storage) + Vercel.

## Setup local

1. `npm install`
2. Copie `.env.local.example` para `.env.local` e preencha:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — em
     Project Settings > API Keys no painel do Supabase (chaves
     `publishable`/`secret` nas versões novas do Supabase).
   - `SUPABASE_SERVICE_ROLE_KEY` — a chave `secret`, mesma tela.
   - `ADMIN_PASSWORD` — senha de acesso ao painel `/admin`.
   - `ADMIN_SESSION_SECRET` — gere com `openssl rand -hex 32`.
3. Rode a migração `supabase/migrations/0001_init.sql` no SQL Editor do
   Supabase (cria tabelas, views de disponibilidade, bucket da galeria e o
   primeiro evento).
4. `npm run dev` e acesse http://localhost:3000

## Estrutura

- `src/app` — páginas institucionais (`/`, `/sobre`, `/ministerios`,
  `/contato`, `/galeria`) e eventos (`/eventos`, `/eventos/[slug]`).
- `src/app/admin` — painel admin protegido por senha (cookie de sessão via
  `middleware`/proxy). Login em `/admin/login`.
- `src/lib/supabase` — clientes Supabase: `server.ts` (chave anon, respeita
  RLS) e `admin.ts` (service role, só em código de servidor).
- `src/lib/site-config.ts` — nome, endereço e **dados de pagamento
  (placeholder)** exibidos na confirmação de inscrição. Atualize
  `paymentInfo` com os dados reais de Twint/conta quando disponíveis.
- `supabase/migrations` — schema SQL (fonte da verdade do banco).

## Como funciona o controle de vagas

Ao se inscrever, a reserva recebe `expires_at` = data do cadastro + prazo de
reserva do evento (calculado por um trigger no insert). "Vagas restantes" é
uma view (`events_availability`) calculada em tempo real: `máximo -
(confirmados + reservados dentro do prazo)` — reservas vencidas somem da
conta sozinhas, sem cron job.

## Deploy

Importe o repositório na Vercel e configure as mesmas variáveis de ambiente
do `.env.local` em Project Settings > Environment Variables.
