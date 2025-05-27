/*
  Warnings:

  - You are about to drop the column `createdAt` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tasks` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `tasks` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - Changed the type of `priority` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `category` on the `tasks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ALTER COLUMN "title" SET DATA TYPE VARCHAR(100),
DROP COLUMN "priority",
ADD COLUMN     "priority" VARCHAR(20) NOT NULL,
ALTER COLUMN "duedate" SET DATA TYPE DATE,
DROP COLUMN "status",
ADD COLUMN     "status" VARCHAR(20) NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" VARCHAR(50) NOT NULL;
