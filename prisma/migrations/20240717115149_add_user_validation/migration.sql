/*
  Warnings:

  - Made the column `createdAt` on table `labels` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `labels` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `movies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `movies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `poster` on table `movies` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imdbID` on table `movies` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "movies_title_key";

-- AlterTable
ALTER TABLE "labels" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "movies" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "poster" SET NOT NULL,
ALTER COLUMN "imdbID" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "validationDate" TIMESTAMP(3),
ADD COLUMN     "validationToken" TEXT,
ADD COLUMN     "validationTokenExpiry" TIMESTAMP(3);
