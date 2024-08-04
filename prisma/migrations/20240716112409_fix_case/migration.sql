/*
  Warnings:

  - You are about to drop the column `imdbId` on the `movies` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imdbID]` on the table `movies` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "movies_imdbId_key";

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "imdbId",
ADD COLUMN     "imdbID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "movies_imdbID_key" ON "movies"("imdbID");
