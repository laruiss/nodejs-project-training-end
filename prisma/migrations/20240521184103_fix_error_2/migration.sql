/*
  Warnings:

  - Made the column `jobId` on table `roles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "movies" DROP CONSTRAINT "movies_labelId_fkey";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_jobId_fkey";

-- AlterTable
ALTER TABLE "movies" ALTER COLUMN "labelId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "people" ALTER COLUMN "realname" DROP NOT NULL;

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "jobId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "labels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
