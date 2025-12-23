-- CreateEnum
CREATE TYPE "requestStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_PARTS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "climateTechType" AS ENUM ('CONDITIONER', 'SPLIT_SYSTEM', 'WINDOW_AC', 'CENTRAL_AC', 'PORTABLE_AC', 'HEAT_PUMP', 'OTHER');

-- CreateEnum
CREATE TYPE "EquipmentType" AS ENUM ('SPLIT_SYSTEM', 'WINDOW_AC', 'CENTRAL_AC', 'PORTABLE_AC', 'HEAT_PUMP', 'OTHER');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'SPECIALIST', 'CLIENT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('STATUS_CHANGED', 'ASSIGNED_TO_YOU', 'COMMENT_ADDED', 'PARTS_ORDERED', 'COMPLETION');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'SPECIALIST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requests" (
    "requestID" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "climateTechType" "climateTechType" NOT NULL,
    "climateTechModel" TEXT NOT NULL,
    "problemDescryption" TEXT NOT NULL,
    "requestStatus" "requestStatus" NOT NULL DEFAULT 'OPEN',
    "completionDate" TIMESTAMP(3),
    "repairParts" TEXT,
    "masterID" TEXT,
    "clientID" TEXT NOT NULL,

    CONSTRAINT "Requests_pkey" PRIMARY KEY ("requestID")
);

-- CreateTable
CREATE TABLE "StatusHistory" (
    "id" TEXT NOT NULL,
    "requestId" INTEGER NOT NULL,
    "oldStatus" "requestStatus" NOT NULL,
    "newStatus" "requestStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changedById" TEXT,
    "reason" TEXT,

    CONSTRAINT "StatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comments" (
    "commentID" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "requestID" INTEGER NOT NULL,
    "masterID" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("commentID")
);

-- CreateTable
CREATE TABLE "OrderedPart" (
    "id" TEXT NOT NULL,
    "requestId" INTEGER NOT NULL,
    "partName" TEXT NOT NULL,
    "partNumber" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION,
    "totalPrice" DOUBLE PRECISION,
    "supplier" TEXT,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedDeliveryDate" TIMESTAMP(3),
    "actualDeliveryDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'ORDERED',
    "notes" TEXT,

    CONSTRAINT "OrderedPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestId" INTEGER,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefectStatistic" (
    "id" TEXT NOT NULL,
    "equipmentType" "EquipmentType" NOT NULL,
    "defectType" TEXT NOT NULL,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "averageRepairTime" DOUBLE PRECISION,
    "completionRate" DOUBLE PRECISION,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DefectStatistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentStatistic" (
    "id" TEXT NOT NULL,
    "totalRequests" INTEGER NOT NULL DEFAULT 0,
    "completedRequests" INTEGER NOT NULL DEFAULT 0,
    "inProgressRequests" INTEGER NOT NULL DEFAULT 0,
    "averageRepairTime" DOUBLE PRECISION,
    "periodStartDate" TIMESTAMP(3) NOT NULL,
    "periodEndDate" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepartmentStatistic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE INDEX "User_login_idx" ON "User"("login");

-- CreateIndex
CREATE INDEX "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "StatusHistory_requestId_idx" ON "StatusHistory"("requestId");

-- CreateIndex
CREATE INDEX "StatusHistory_changedAt_idx" ON "StatusHistory"("changedAt");

-- CreateIndex
CREATE INDEX "Comments_createdAt_idx" ON "Comments"("createdAt");

-- CreateIndex
CREATE INDEX "OrderedPart_requestId_idx" ON "OrderedPart"("requestId");

-- CreateIndex
CREATE INDEX "OrderedPart_status_idx" ON "OrderedPart"("status");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "DefectStatistic_equipmentType_idx" ON "DefectStatistic"("equipmentType");

-- CreateIndex
CREATE UNIQUE INDEX "DefectStatistic_equipmentType_defectType_key" ON "DefectStatistic"("equipmentType", "defectType");

-- CreateIndex
CREATE INDEX "DepartmentStatistic_lastUpdated_idx" ON "DepartmentStatistic"("lastUpdated");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentStatistic_periodStartDate_periodEndDate_key" ON "DepartmentStatistic"("periodStartDate", "periodEndDate");

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_masterID_fkey" FOREIGN KEY ("masterID") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requests" ADD CONSTRAINT "Requests_clientID_fkey" FOREIGN KEY ("clientID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Requests"("requestID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusHistory" ADD CONSTRAINT "StatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_requestID_fkey" FOREIGN KEY ("requestID") REFERENCES "Requests"("requestID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_masterID_fkey" FOREIGN KEY ("masterID") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderedPart" ADD CONSTRAINT "OrderedPart_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Requests"("requestID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Requests"("requestID") ON DELETE SET NULL ON UPDATE CASCADE;
