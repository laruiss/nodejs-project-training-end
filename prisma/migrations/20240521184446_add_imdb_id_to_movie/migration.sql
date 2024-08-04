/*
  Warnings:

  - A unique constraint covering the columns `[imdbId]` on the table `movies` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "imdbId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "movies_imdbId_key" ON "movies"("imdbId");
