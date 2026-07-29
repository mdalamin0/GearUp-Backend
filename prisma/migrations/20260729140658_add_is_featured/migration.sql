-- AlterTable
ALTER TABLE "gearItems" ADD COLUMN     "featuredAt" TIMESTAMP(3),
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;
