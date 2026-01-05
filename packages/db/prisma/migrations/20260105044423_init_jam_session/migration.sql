-- CreateTable
CREATE TABLE "Jam" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Jam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Jam" ADD CONSTRAINT "Jam_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
