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
- health check em `/api/health`
- seed Prisma para ambiente local

## Execução
```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev:api
npm run dev:web
```

## Banco de dados
```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed
```
