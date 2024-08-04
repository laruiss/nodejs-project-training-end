/*
  Warnings:

  - You are about to drop the column `labelId` on the `movies` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "movies" DROP CONSTRAINT "movies_labelId_fkey";

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "labelId";

-- CreateTable
CREATE TABLE "_LabelToMovie" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LabelToMovie_AB_unique" ON "_LabelToMovie"("A", "B");

-- CreateIndex
CREATE INDEX "_LabelToMovie_B_index" ON "_LabelToMovie"("B");

-- AddForeignKey
ALTER TABLE "_LabelToMovie" ADD CONSTRAINT "_LabelToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "labels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LabelToMovie" ADD CONSTRAINT "_LabelToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
