/*
  Warnings:

  - You are about to drop the `_LabelToMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_LabelToMovie" DROP CONSTRAINT "_LabelToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_LabelToMovie" DROP CONSTRAINT "_LabelToMovie_B_fkey";

-- DropTable
DROP TABLE "_LabelToMovie";

-- CreateTable
CREATE TABLE "movies_labels" (
    "movieId" INTEGER NOT NULL,
    "labelId" INTEGER NOT NULL,

    CONSTRAINT "movies_labels_pkey" PRIMARY KEY ("movieId","labelId")
);

-- AddForeignKey
ALTER TABLE "movies_labels" ADD CONSTRAINT "movies_labels_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movies_labels" ADD CONSTRAINT "movies_labels_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "labels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
