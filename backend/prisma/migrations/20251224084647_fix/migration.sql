/*
  Warnings:

  - You are about to drop the column `homeTechModel` on the `Requests` table. All the data in the column will be lost.
  - You are about to drop the column `homeTechType` on the `Requests` table. All the data in the column will be lost.
  - Added the required column `homeTechModel` to the `Requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `homeTechType` to the `Requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "homeTechType" AS ENUM ('CONDITIONER', 'SPLIT_SYSTEM', 'WINDOW_AC', 'CENTRAL_AC', 'PORTABLE_AC', 'HEAT_PUMP', 'OTHER');

-- AlterTable
ALTER TABLE "Requests" DROP COLUMN "homeTechModel",
DROP COLUMN "homeTechType",
ADD COLUMN     "homeTechModel" TEXT NOT NULL,
ADD COLUMN     "homeTechType" "homeTechType" NOT NULL;

-- DropEnum
DROP TYPE "homeTechType";
