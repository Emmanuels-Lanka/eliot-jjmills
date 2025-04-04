-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "rfid" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "rfid" TEXT,
    "gender" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isLoggedIn" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Operator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionLine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EliotDevice" (
    "id" TEXT NOT NULL,
    "isAssigned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "installedDate" TEXT NOT NULL,
    "modelNumber" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "hasTrained" BOOLEAN DEFAULT false,

    CONSTRAINT "EliotDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SewingMachine" (
    "id" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "machineType" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "ownership" TEXT NOT NULL,
    "isAssigned" BOOLEAN NOT NULL DEFAULT false,
    "eliotDeviceId" TEXT,
    "unitId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "modelNumber" TEXT,
    "activeObbOperationId" TEXT,
    "isCombinedOperation" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "SewingMachine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObbSheet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productionLineId" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "indEngineerId" TEXT,
    "mechanicId" TEXT,
    "qualityInsId" TEXT,
    "accInputManId" TEXT,
    "fabInputManId" TEXT,
    "buyer" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "operators" INTEGER NOT NULL,
    "helpers" INTEGER NOT NULL,
    "startingDate" TEXT NOT NULL,
    "endingDate" TEXT NOT NULL,
    "workingHours" DOUBLE PRECISION,
    "efficiencyLevel1" INTEGER NOT NULL,
    "efficiencyLevel2" INTEGER NOT NULL,
    "efficiencyLevel3" INTEGER NOT NULL,
    "itemReference" TEXT,
    "totalMP" INTEGER,
    "bottleNeckTarget" INTEGER,
    "target100" INTEGER,
    "ucl" INTEGER,
    "lcl" INTEGER,
    "balancingLoss" INTEGER,
    "balancingRatio" INTEGER,
    "colour" TEXT,
    "supResponseTime" INTEGER,
    "mecResponseTime" INTEGER,
    "qiResponseTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "supervisorAssemblyId" TEXT,
    "supervisorBackId" TEXT,
    "supervisorFrontId" TEXT,
    "supervisorLineEndId" TEXT,
    "lineChiefId" TEXT,
    "bundleTime" TEXT,
    "personalAllowance" TEXT,
    "factoryStartTime" TEXT,
    "obbOperationsNo" INTEGER,
    "factoryStopTime" TEXT,
    "totalSMV" DOUBLE PRECISION,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "availableMinPerHour" INTEGER,
    "isVisible" BOOLEAN NOT NULL DEFAULT false,
    "threshold" INTEGER,
    "thresholdStatus" BOOLEAN,
    "intervalStartTime" TEXT NOT NULL DEFAULT '13:00:00',
    "intervalStopTime" TEXT NOT NULL DEFAULT '14:00:00',

    CONSTRAINT "ObbSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObbOperation" (
    "id" TEXT NOT NULL,
    "seqNo" INTEGER NOT NULL DEFAULT 0,
    "operationId" TEXT NOT NULL,
    "obbSheetId" TEXT NOT NULL,
    "smv" DOUBLE PRECISION NOT NULL,
    "target" INTEGER NOT NULL,
    "spi" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "totalStitches" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "supervisorId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "sewingMachineId" TEXT,
    "part" TEXT,
    "isCombined" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ObbOperation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperatorSession" (
    "id" TEXT NOT NULL,
    "operatorRfid" TEXT NOT NULL,
    "obbOperationId" TEXT NOT NULL,
    "isLoggedIn" BOOLEAN NOT NULL DEFAULT true,
    "LoginTimestamp" TEXT NOT NULL,
    "LogoutTimestamp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OperatorSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffSession" (
    "id" TEXT NOT NULL,
    "staffEmpId" TEXT NOT NULL,
    "obbOperationId" TEXT NOT NULL,
    "isLoggedIn" BOOLEAN NOT NULL DEFAULT true,
    "LoginTimestamp" TEXT NOT NULL,
    "LogoutTimestamp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionData" (
    "id" TEXT NOT NULL,
    "operatorRfid" TEXT NOT NULL,
    "eliotSerialNumber" TEXT,
    "obbOperationId" TEXT NOT NULL,
    "productionCount" INTEGER NOT NULL,
    "timestamp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalPcs" INTEGER,
    "efficiency" INTEGER,

    CONSTRAINT "ProductionData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionEfficiency" (
    "id" TEXT NOT NULL,
    "operatorRfid" TEXT NOT NULL,
    "eliotSerialNumber" TEXT,
    "obbOperationId" TEXT NOT NULL,
    "totalPcs" INTEGER,
    "efficiency" INTEGER,
    "timestamp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductionEfficiency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertLog" (
    "id" TEXT NOT NULL,
    "machineId" TEXT,
    "operatorRfid" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "alertType" TEXT NOT NULL,
    "smsStatus" TEXT NOT NULL DEFAULT 'SENDING',
    "emailStatus" TEXT NOT NULL DEFAULT 'SENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loginTimestamp" TEXT,
    "logoutTimestamp" TEXT,
    "reqTimestamp" TEXT NOT NULL,

    CONSTRAINT "AlertLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrafficLightSystem" (
    "id" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "machineId" TEXT,
    "operatorRfid" TEXT NOT NULL,
    "obbOperationId" TEXT NOT NULL,
    "qcEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "roundNo" INTEGER NOT NULL DEFAULT 1,
    "colour" TEXT NOT NULL,

    CONSTRAINT "TrafficLightSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperatorNonEffectiveTime" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "operatorRfid" TEXT NOT NULL,
    "startTimestamp" TEXT NOT NULL,
    "endTimestamp" TEXT,
    "timeDifference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OperatorNonEffectiveTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperatorEffectiveTime" (
    "id" TEXT NOT NULL,
    "operatorRfid" TEXT NOT NULL,
    "loginTimestamp" TEXT NOT NULL,
    "logoutTimestamp" TEXT,
    "totalTime" TEXT,
    "effectiveTime" TEXT,
    "nonEffectiveTime" TEXT,
    "mechanicDownTime" TEXT,
    "productionDownTime" TEXT,
    "lunchBreakTime" TEXT,
    "offStandTime" TEXT,
    "status" VARCHAR(255),

    CONSTRAINT "OperatorEffectiveTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductionSMV" (
    "id" SERIAL NOT NULL,
    "operatorRfid" TEXT NOT NULL,
    "smv" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "obbOperationId" TEXT NOT NULL,

    CONSTRAINT "ProductionSMV_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoamingQC" (
    "id" TEXT NOT NULL,
    "unit" TEXT,
    "lineId" TEXT NOT NULL,
    "obbOperationId" TEXT NOT NULL,
    "operatorRfid" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "defects" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "inspectedQty" TEXT NOT NULL,
    "inspectedBy" TEXT DEFAULT 'Test RQC',
    "machineId" TEXT,
    "colorStatus" TEXT NOT NULL,

    CONSTRAINT "RoamingQC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineEfficiencyResources" (
    "id" TEXT NOT NULL,
    "unitId" TEXT NOT NULL,
    "obbSheetId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "sewingOperators" INTEGER NOT NULL,
    "ironOperators" INTEGER NOT NULL,
    "helpers" INTEGER NOT NULL,
    "manPowers" INTEGER NOT NULL,
    "frontQcTarget" INTEGER NOT NULL,
    "backQcTarget" INTEGER NOT NULL,
    "endQcTarget" INTEGER NOT NULL,
    "workingHours" INTEGER NOT NULL,
    "totalSMV" DOUBLE PRECISION NOT NULL,
    "targetEfficiency" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "LineEfficiencyResources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EliotFirmwareUpdate" (
    "id" TEXT NOT NULL,
    "eliotSerialNo" TEXT NOT NULL,
    "firmwareUrl" TEXT NOT NULL,
    "firmwareVersion" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EliotFirmwareUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "part" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductionLineToSewingMachine" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_employeeId_key" ON "Staff"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Operator_employeeId_key" ON "Operator"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Operator_rfid_key" ON "Operator"("rfid");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionLine_name_key" ON "ProductionLine"("name");

-- CreateIndex
CREATE INDEX "ProductionLine_unitId_idx" ON "ProductionLine"("unitId");

-- CreateIndex
CREATE UNIQUE INDEX "EliotDevice_serialNumber_key" ON "EliotDevice"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SewingMachine_machineId_key" ON "SewingMachine"("machineId");

-- CreateIndex
CREATE UNIQUE INDEX "SewingMachine_eliotDeviceId_key" ON "SewingMachine"("eliotDeviceId");

-- CreateIndex
CREATE UNIQUE INDEX "SewingMachine_serialNumber_key" ON "SewingMachine"("serialNumber");

-- CreateIndex
CREATE INDEX "SewingMachine_eliotDeviceId_unitId_idx" ON "SewingMachine"("eliotDeviceId", "unitId");

-- CreateIndex
CREATE INDEX "ObbSheet_productionLineId_unitId_indEngineerId_supervisorFr_idx" ON "ObbSheet"("productionLineId", "unitId", "indEngineerId", "supervisorFrontId", "supervisorBackId", "supervisorAssemblyId", "supervisorLineEndId", "mechanicId", "qualityInsId", "accInputManId", "fabInputManId");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_name_key" ON "Operation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_code_key" ON "Operation"("code");

-- CreateIndex
CREATE INDEX "ObbOperation_operationId_obbSheetId_idx" ON "ObbOperation"("operationId", "obbSheetId");

-- CreateIndex
CREATE INDEX "OperatorSession_operatorRfid_obbOperationId_idx" ON "OperatorSession"("operatorRfid", "obbOperationId");

-- CreateIndex
CREATE INDEX "StaffSession_staffEmpId_obbOperationId_idx" ON "StaffSession"("staffEmpId", "obbOperationId");

-- CreateIndex
CREATE INDEX "ProductionData_operatorRfid_eliotSerialNumber_obbOperationI_idx" ON "ProductionData"("operatorRfid", "eliotSerialNumber", "obbOperationId");

-- CreateIndex
CREATE INDEX "AlertLog_machineId_operatorRfid_employeeId_idx" ON "AlertLog"("machineId", "operatorRfid", "employeeId");

-- CreateIndex
CREATE INDEX "TrafficLightSystem_machineId_obbOperationId_operatorRfid_idx" ON "TrafficLightSystem"("machineId", "obbOperationId", "operatorRfid");

-- CreateIndex
CREATE INDEX "OperatorNonEffectiveTime_operatorRfid_idx" ON "OperatorNonEffectiveTime"("operatorRfid");

-- CreateIndex
CREATE INDEX "OperatorEffectiveTime_operatorRfid_idx" ON "OperatorEffectiveTime"("operatorRfid");

-- CreateIndex
CREATE INDEX "ProductionSMV_obbOperationId_operatorRfid_idx" ON "ProductionSMV"("obbOperationId", "operatorRfid");

-- CreateIndex
CREATE INDEX "RoamingQC_obbOperationId_operatorRfid_machineId_idx" ON "RoamingQC"("obbOperationId", "operatorRfid", "machineId");

-- CreateIndex
CREATE INDEX "LineEfficiencyResources_unitId_obbSheetId_idx" ON "LineEfficiencyResources"("unitId", "obbSheetId");

-- CreateIndex
CREATE UNIQUE INDEX "EliotFirmwareUpdate_eliotSerialNo_key" ON "EliotFirmwareUpdate"("eliotSerialNo");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductionLineToSewingMachine_AB_unique" ON "_ProductionLineToSewingMachine"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductionLineToSewingMachine_B_index" ON "_ProductionLineToSewingMachine"("B");

-- AddForeignKey
ALTER TABLE "ProductionLine" ADD CONSTRAINT "ProductionLine_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SewingMachine" ADD CONSTRAINT "SewingMachine_eliotDeviceId_fkey" FOREIGN KEY ("eliotDeviceId") REFERENCES "EliotDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SewingMachine" ADD CONSTRAINT "SewingMachine_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbSheet" ADD CONSTRAINT "ObbSheet_accInputManId_fkey" FOREIGN KEY ("accInputManId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbSheet" ADD CONSTRAINT "ObbSheet_fabInputManId_fkey" FOREIGN KEY ("fabInputManId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbSheet" ADD CONSTRAINT "ObbSheet_indEngineerId_fkey" FOREIGN KEY ("indEngineerId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbSheet" ADD CONSTRAINT "ObbSheet_lineChiefId_fkey" FOREIGN KEY ("lineChiefId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbSheet" ADD CONSTRAINT "ObbSheet_mechanicId_fkey" FOREIGN KEY ("mechanicId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbSheet" ADD CONSTRAINT "ObbSheet_productionLineId_fkey" FOREIGN KEY ("productionLineId") REFERENCES "ProductionLine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbSheet" ADD CONSTRAINT "ObbSheet_qualityInsId_fkey" FOREIGN KEY ("qualityInsId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbSheet" ADD CONSTRAINT "ObbSheet_supervisorAssemblyId_fkey" FOREIGN KEY ("supervisorAssemblyId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbSheet" ADD CONSTRAINT "ObbSheet_supervisorBackId_fkey" FOREIGN KEY ("supervisorBackId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbSheet" ADD CONSTRAINT "ObbSheet_supervisorFrontId_fkey" FOREIGN KEY ("supervisorFrontId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbSheet" ADD CONSTRAINT "ObbSheet_supervisorLineEndId_fkey" FOREIGN KEY ("supervisorLineEndId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbSheet" ADD CONSTRAINT "ObbSheet_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbOperation" ADD CONSTRAINT "ObbOperation_obbSheetId_fkey" FOREIGN KEY ("obbSheetId") REFERENCES "ObbSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbOperation" ADD CONSTRAINT "ObbOperation_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbOperation" ADD CONSTRAINT "ObbOperation_sewingMachineId_fkey" FOREIGN KEY ("sewingMachineId") REFERENCES "SewingMachine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObbOperation" ADD CONSTRAINT "ObbOperation_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperatorSession" ADD CONSTRAINT "OperatorSession_obbOperationId_fkey" FOREIGN KEY ("obbOperationId") REFERENCES "ObbOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperatorSession" ADD CONSTRAINT "OperatorSession_operatorRfid_fkey" FOREIGN KEY ("operatorRfid") REFERENCES "Operator"("rfid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffSession" ADD CONSTRAINT "StaffSession_obbOperationId_fkey" FOREIGN KEY ("obbOperationId") REFERENCES "ObbOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffSession" ADD CONSTRAINT "StaffSession_staffEmpId_fkey" FOREIGN KEY ("staffEmpId") REFERENCES "Staff"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionData" ADD CONSTRAINT "ProductionData_eliotSerialNumber_fkey" FOREIGN KEY ("eliotSerialNumber") REFERENCES "EliotDevice"("serialNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionData" ADD CONSTRAINT "ProductionData_obbOperationId_fkey" FOREIGN KEY ("obbOperationId") REFERENCES "ObbOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionData" ADD CONSTRAINT "ProductionData_operatorRfid_fkey" FOREIGN KEY ("operatorRfid") REFERENCES "Operator"("rfid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionEfficiency" ADD CONSTRAINT "ProductionEfficiency_eliotSerialNumber_fkey" FOREIGN KEY ("eliotSerialNumber") REFERENCES "EliotDevice"("serialNumber") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionEfficiency" ADD CONSTRAINT "ProductionEfficiency_obbOperationId_fkey" FOREIGN KEY ("obbOperationId") REFERENCES "ObbOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionEfficiency" ADD CONSTRAINT "ProductionEfficiency_operatorRfid_fkey" FOREIGN KEY ("operatorRfid") REFERENCES "Operator"("rfid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertLog" ADD CONSTRAINT "AlertLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Staff"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertLog" ADD CONSTRAINT "AlertLog_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "SewingMachine"("machineId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertLog" ADD CONSTRAINT "AlertLog_operatorRfid_fkey" FOREIGN KEY ("operatorRfid") REFERENCES "Operator"("rfid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrafficLightSystem" ADD CONSTRAINT "TrafficLightSystem_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "SewingMachine"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrafficLightSystem" ADD CONSTRAINT "TrafficLightSystem_obbOperationId_fkey" FOREIGN KEY ("obbOperationId") REFERENCES "ObbOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrafficLightSystem" ADD CONSTRAINT "TrafficLightSystem_operatorRfid_fkey" FOREIGN KEY ("operatorRfid") REFERENCES "Operator"("rfid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrafficLightSystem" ADD CONSTRAINT "TrafficLightSystem_qcEmail_fkey" FOREIGN KEY ("qcEmail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperatorNonEffectiveTime" ADD CONSTRAINT "OperatorNonEffectiveTime_operatorRfid_fkey" FOREIGN KEY ("operatorRfid") REFERENCES "Operator"("rfid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperatorEffectiveTime" ADD CONSTRAINT "OperatorEffectiveTime_operatorRfid_fkey" FOREIGN KEY ("operatorRfid") REFERENCES "Operator"("rfid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionSMV" ADD CONSTRAINT "ProductionSMV_obbOperationId_fkey" FOREIGN KEY ("obbOperationId") REFERENCES "ObbOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductionSMV" ADD CONSTRAINT "ProductionSMV_operatorRfid_fkey" FOREIGN KEY ("operatorRfid") REFERENCES "Operator"("rfid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoamingQC" ADD CONSTRAINT "RoamingQC_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "SewingMachine"("machineId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoamingQC" ADD CONSTRAINT "RoamingQC_obbOperationId_fkey" FOREIGN KEY ("obbOperationId") REFERENCES "ObbOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoamingQC" ADD CONSTRAINT "RoamingQC_operatorRfid_fkey" FOREIGN KEY ("operatorRfid") REFERENCES "Operator"("rfid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineEfficiencyResources" ADD CONSTRAINT "LineEfficiencyResources_obbSheetId_fkey" FOREIGN KEY ("obbSheetId") REFERENCES "ObbSheet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LineEfficiencyResources" ADD CONSTRAINT "LineEfficiencyResources_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductionLineToSewingMachine" ADD CONSTRAINT "_ProductionLineToSewingMachine_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductionLine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductionLineToSewingMachine" ADD CONSTRAINT "_ProductionLineToSewingMachine_B_fkey" FOREIGN KEY ("B") REFERENCES "SewingMachine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
