-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('GASTO', 'GANHO');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'GASTO';
