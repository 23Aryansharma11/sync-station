/*
  Warnings:

  - You are about to drop the `Jam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Jam" DROP CONSTRAINT "Jam_authorId_fkey";

-- DropTable
DROP TABLE "Jam";

-- CreateTable
CREATE TABLE "jam" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "jam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "jam" ADD CONSTRAINT "jam_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
