/*
  Warnings:

  - You are about to drop the column `title` on the `jam` table. All the data in the column will be lost.
  - Added the required column `bgImage` to the `jam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `jam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jam" DROP COLUMN "title",
ADD COLUMN     "bgImage" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL;
