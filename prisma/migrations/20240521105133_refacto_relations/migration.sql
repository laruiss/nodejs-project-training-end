/*
  Warnings:

  - You are about to drop the `_MovieActors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovieArtDirectors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovieCinematographers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovieComposers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovieDirectors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovieEditors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovieProducers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovieSetDesigners` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MovieWriters` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MovieActors" DROP CONSTRAINT "_MovieActors_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieActors" DROP CONSTRAINT "_MovieActors_B_fkey";

-- DropForeignKey
ALTER TABLE "_MovieArtDirectors" DROP CONSTRAINT "_MovieArtDirectors_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieArtDirectors" DROP CONSTRAINT "_MovieArtDirectors_B_fkey";

-- DropForeignKey
ALTER TABLE "_MovieCinematographers" DROP CONSTRAINT "_MovieCinematographers_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieCinematographers" DROP CONSTRAINT "_MovieCinematographers_B_fkey";

-- DropForeignKey
ALTER TABLE "_MovieComposers" DROP CONSTRAINT "_MovieComposers_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieComposers" DROP CONSTRAINT "_MovieComposers_B_fkey";

-- DropForeignKey
ALTER TABLE "_MovieDirectors" DROP CONSTRAINT "_MovieDirectors_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieDirectors" DROP CONSTRAINT "_MovieDirectors_B_fkey";

-- DropForeignKey
ALTER TABLE "_MovieEditors" DROP CONSTRAINT "_MovieEditors_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieEditors" DROP CONSTRAINT "_MovieEditors_B_fkey";

-- DropForeignKey
ALTER TABLE "_MovieProducers" DROP CONSTRAINT "_MovieProducers_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieProducers" DROP CONSTRAINT "_MovieProducers_B_fkey";

-- DropForeignKey
ALTER TABLE "_MovieSetDesigners" DROP CONSTRAINT "_MovieSetDesigners_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieSetDesigners" DROP CONSTRAINT "_MovieSetDesigners_B_fkey";

-- DropForeignKey
ALTER TABLE "_MovieWriters" DROP CONSTRAINT "_MovieWriters_A_fkey";

-- DropForeignKey
ALTER TABLE "_MovieWriters" DROP CONSTRAINT "_MovieWriters_B_fkey";

-- DropTable
DROP TABLE "_MovieActors";

-- DropTable
DROP TABLE "_MovieArtDirectors";

-- DropTable
DROP TABLE "_MovieCinematographers";

-- DropTable
DROP TABLE "_MovieComposers";

-- DropTable
DROP TABLE "_MovieDirectors";

-- DropTable
DROP TABLE "_MovieEditors";

-- DropTable
DROP TABLE "_MovieProducers";

-- DropTable
DROP TABLE "_MovieSetDesigners";

-- DropTable
DROP TABLE "_MovieWriters";

-- CreateTable
CREATE TABLE "Job" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "jobId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_title_key" ON "Job"("title");

-- CreateIndex
CREATE UNIQUE INDEX "roles_movieId_personId_jobId_key" ON "roles"("movieId", "personId", "jobId");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
