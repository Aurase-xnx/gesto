-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'OWNER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "EmployeeType" AS ENUM ('WAITER', 'BARMAN', 'COOK');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "employeeType" "EmployeeType",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENT';
