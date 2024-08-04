/*
  Warnings:

  - Added the required column `labelId` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE movies_id_seq;
ALTER TABLE "movies" ADD COLUMN     "labelId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('movies_id_seq');
ALTER SEQUENCE movies_id_seq OWNED BY "movies"."id";

-- AlterTable
CREATE SEQUENCE people_id_seq;
ALTER TABLE "people" ALTER COLUMN "id" SET DEFAULT nextval('people_id_seq');
ALTER SEQUENCE people_id_seq OWNED BY "people"."id";

-- AlterTable
CREATE SEQUENCE users_id_seq;
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('users_id_seq');
ALTER SEQUENCE users_id_seq OWNED BY "users"."id";

-- CreateTable
CREATE TABLE "labels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "labels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "labels_name_key" ON "labels"("name");

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_labelId_fkey" FOREIGN KEY ("labelId") REFERENCES "labels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
