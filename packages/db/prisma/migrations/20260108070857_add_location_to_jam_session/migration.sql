/*
  Warnings:

  - Added the required column `latitude` to the `jam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `jam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jam" ADD COLUMN     "accuracy" DOUBLE PRECISION,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;
