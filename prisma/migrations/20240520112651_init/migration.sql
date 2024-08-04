-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" INTEGER NOT NULL,
    "fullname" TEXT NOT NULL,
    "realname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MovieDirectors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MovieWriters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MovieActors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MovieComposers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MovieProducers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MovieCinematographers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MovieArtDirectors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MovieSetDesigners" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MovieEditors" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "movies_title_key" ON "movies"("title");

-- CreateIndex
CREATE UNIQUE INDEX "people_fullname_key" ON "people"("fullname");

-- CreateIndex
CREATE UNIQUE INDEX "people_realname_key" ON "people"("realname");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieDirectors_AB_unique" ON "_MovieDirectors"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieDirectors_B_index" ON "_MovieDirectors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieWriters_AB_unique" ON "_MovieWriters"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieWriters_B_index" ON "_MovieWriters"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieActors_AB_unique" ON "_MovieActors"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieActors_B_index" ON "_MovieActors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieComposers_AB_unique" ON "_MovieComposers"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieComposers_B_index" ON "_MovieComposers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieProducers_AB_unique" ON "_MovieProducers"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieProducers_B_index" ON "_MovieProducers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieCinematographers_AB_unique" ON "_MovieCinematographers"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieCinematographers_B_index" ON "_MovieCinematographers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieArtDirectors_AB_unique" ON "_MovieArtDirectors"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieArtDirectors_B_index" ON "_MovieArtDirectors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieSetDesigners_AB_unique" ON "_MovieSetDesigners"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieSetDesigners_B_index" ON "_MovieSetDesigners"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MovieEditors_AB_unique" ON "_MovieEditors"("A", "B");

-- CreateIndex
CREATE INDEX "_MovieEditors_B_index" ON "_MovieEditors"("B");

-- AddForeignKey
ALTER TABLE "_MovieDirectors" ADD CONSTRAINT "_MovieDirectors_A_fkey" FOREIGN KEY ("A") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieDirectors" ADD CONSTRAINT "_MovieDirectors_B_fkey" FOREIGN KEY ("B") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieWriters" ADD CONSTRAINT "_MovieWriters_A_fkey" FOREIGN KEY ("A") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieWriters" ADD CONSTRAINT "_MovieWriters_B_fkey" FOREIGN KEY ("B") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieActors" ADD CONSTRAINT "_MovieActors_A_fkey" FOREIGN KEY ("A") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieActors" ADD CONSTRAINT "_MovieActors_B_fkey" FOREIGN KEY ("B") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieComposers" ADD CONSTRAINT "_MovieComposers_A_fkey" FOREIGN KEY ("A") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieComposers" ADD CONSTRAINT "_MovieComposers_B_fkey" FOREIGN KEY ("B") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieProducers" ADD CONSTRAINT "_MovieProducers_A_fkey" FOREIGN KEY ("A") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieProducers" ADD CONSTRAINT "_MovieProducers_B_fkey" FOREIGN KEY ("B") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieCinematographers" ADD CONSTRAINT "_MovieCinematographers_A_fkey" FOREIGN KEY ("A") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieCinematographers" ADD CONSTRAINT "_MovieCinematographers_B_fkey" FOREIGN KEY ("B") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieArtDirectors" ADD CONSTRAINT "_MovieArtDirectors_A_fkey" FOREIGN KEY ("A") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieArtDirectors" ADD CONSTRAINT "_MovieArtDirectors_B_fkey" FOREIGN KEY ("B") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieSetDesigners" ADD CONSTRAINT "_MovieSetDesigners_A_fkey" FOREIGN KEY ("A") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieSetDesigners" ADD CONSTRAINT "_MovieSetDesigners_B_fkey" FOREIGN KEY ("B") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieEditors" ADD CONSTRAINT "_MovieEditors_A_fkey" FOREIGN KEY ("A") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieEditors" ADD CONSTRAINT "_MovieEditors_B_fkey" FOREIGN KEY ("B") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;
