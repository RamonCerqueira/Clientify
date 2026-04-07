-- CreateEnum
CREATE TYPE "PageLayoutStyle" AS ENUM ('MODERN', 'MINIMALIST', 'TECH');

-- AlterTable
ALTER TABLE "pages"
  ADD COLUMN "heroHeadline" TEXT,
  ADD COLUMN "heroSubheadline" TEXT,
  ADD COLUMN "ctaText" TEXT NOT NULL DEFAULT 'Quero atendimento',
  ADD COLUMN "layoutStyle" "PageLayoutStyle" NOT NULL DEFAULT 'MODERN',
  ADD COLUMN "primaryColor" TEXT NOT NULL DEFAULT '#22d3ee';
