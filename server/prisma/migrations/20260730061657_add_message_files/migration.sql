-- AlterTable
ALTER TABLE "public"."Message" ADD COLUMN     "fileName" TEXT,
ADD COLUMN     "fileType" TEXT,
ADD COLUMN     "fileUrl" TEXT,
ALTER COLUMN "content" DROP NOT NULL;
