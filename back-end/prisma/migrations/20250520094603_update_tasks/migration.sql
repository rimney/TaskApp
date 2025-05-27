-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('In_Progress', 'In_Review', 'On_Hold', 'Completed');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Development', 'Testing', 'Bugs');

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "priority" "Priority" NOT NULL,
    "duedate" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "category" "Category" NOT NULL,
    "description" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);
