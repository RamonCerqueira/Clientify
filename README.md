# Clientify

Monorepo com backend NestJS multi-tenant e frontend Next.js para captura de leads.

## Apps
- `apps/api`: API NestJS + Prisma + PostgreSQL
- `apps/web`: Frontend Next.js App Router + TailwindCSS

## Recursos implementados
- autenticação JWT com `accessToken` e `refreshToken`
- isolamento multi-tenant por `tenantId`
- CRUD de páginas com status de publicação
- captura pública de leads e atualização de status no dashboard
- paginação no painel (`pages` e `leads`)
- health check em `/api/health`
- SEO base (`robots.txt` + `sitemap.xml`)
- seed Prisma para ambiente local
- workflow de CI para lint + build

## Execução
```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev:api
npm run dev:web
```

> `NEXT_PUBLIC_API_URL` deve apontar para a base da API com prefixo `/api` (ex.: `http://localhost:4000/api`).

## Banco de dados
```bash
docker compose up -d
cd apps/api
npx prisma migrate dev
npx prisma db seed
```

## Produção (checklist mínimo)
- configurar `JWT_SECRET`, `JWT_REFRESH_SECRET` e CORS estritos
- rodar pipeline CI em todos os PRs
- habilitar observabilidade (logs, métricas e alertas)
- executar testes e2e antes de deploy
