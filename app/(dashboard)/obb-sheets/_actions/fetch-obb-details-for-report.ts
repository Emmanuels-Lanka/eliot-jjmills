"use server"

import { db } from "@/lib/db";

export async function fetchObbDetailsForReport(obbSheetId: string): Promise<ReportObbDetailsTypes | null> {
    try {
        const obb = await db.obbSheet.findUnique({
            where: {
                id: obbSheetId
            },
            select: {
                id: true,
                style: true,
                version: true,
                buyer: true,
                item: true,
                colour: true,
                productionLine: { select: { name: true } },
                unit: { select: { name: true } },
                indEngineer: { select: { name: true } },
                mechanic: { select: { name: true } },
                qualityIns: { select: { name: true } },
                accInputMan: { select: { name: true } },
                fabInputMan: { select: { name: true } },
                lineChief: { select: { name: true } },
                startingDate: true,
                endingDate: true,
                factoryStartTime: true,
                factoryStopTime: true,
                workingHours: true,
                totalSMV: true,
                obbOperationsNo: true,
                bundleTime: true,
                personalAllowance: true,
                efficiencyLevel1: true,
                efficiencyLevel3: true,
                obbOperations: {
                    select: {
                        id: true,
                        seqNo: true,
                        smv: true,
                        part: true,
                        target: true,
                        operation: { select: { name: true, code: true } },
                        sewingMachine: { select: { machineId: true } }
                    },
                    orderBy: {
                        seqNo: "asc"
                    }
                }
            }
        });

        if (!obb) {
            return null;
        }

        const data = {
            id: obb.id,
            style: obb.style,
            version: obb.version,
            line: obb.productionLine.name,
            unit: obb.unit.name,
            indEngineer: obb.indEngineer?.name,
            mechanic: obb.mechanic?.name,
            qualityIns: obb.qualityIns?.name,
            accInputMan: obb.accInputMan?.name,
            fabInputMan: obb.fabInputMan?.name,
            lineChief: obb.lineChief?.name,
            buyer: obb.buyer,
            item: obb.item,
            colour: obb.colour,
            startingDate: obb.startingDate,
            endingDate: obb.endingDate,
            factoryStartTime: obb.factoryStartTime,
            factoryStopTime: obb.factoryStopTime,
            workingHours: obb.workingHours,
            totalSMV: obb.totalSMV,
            obbOperationsNo: obb.obbOperationsNo,
            bundleTime: obb.bundleTime,
            personalAllowance: obb.personalAllowance,
            efficiencyLevel1: obb.efficiencyLevel1,
            efficiencyLevel3: obb.efficiencyLevel3,
            operations: obb.obbOperations.map(operation => ({
                id: operation.id,
                seqNo: operation.seqNo,
                smv: operation.smv,
                part: operation.part,
                target: operation.target,
                operationName: operation.operation.name,
                operationCode: operation.operation.code,
                machineId: operation.sewingMachine?.machineId
            }))
        };

        return new Promise((resolve) => resolve(data as ReportObbDetailsTypes));
    } catch (error) {
        console.error("[FETCH_OPERATIONS_COUNT_ERROR]", error);
        return null;
    }
}