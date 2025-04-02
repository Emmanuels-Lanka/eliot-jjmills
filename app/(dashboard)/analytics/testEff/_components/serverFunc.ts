"use server";

import { db } from "@/lib/db";

export async function fetchProductionData(obbSheetId: string, date: string) {
    if (!obbSheetId || !date) {
        throw new Error("Missing required parameters: obbSheetId or date");
    }

    const startDate = `${date} 00:00:00`; // Start of the day
    const endDate = `${date} 23:59:59`; // End of the day

    try {
        const productionData = await db.productionEfficiency.findMany({
            where: {
                obbOperation: { obbSheetId: obbSheetId },
                timestamp: { gte: startDate, lte: endDate }
            },
            include: {
                operator: {
                    select: {
                        name: true,
                        employeeId: true,
                        rfid: true,
                        operatorSessions: {
                            where: {
                                LoginTimestamp: { gte: startDate, lte: endDate }
                            }
                        }
                    }
                },
                obbOperation: {
                    select: {
                        id: true,
                        seqNo: true,
                        target: true,
                        smv: true,
                        part: true,
                        operation: { select: { name: true } },
                        sewingMachine: { select: { machineId: true } }
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        const obbSheet = await db.obbSheet.findUnique({
            where: { id: obbSheetId },
            select: {
                name: true,
                efficiencyLevel1: true,
                efficiencyLevel3: true
            }
        });

        return { data: productionData, obbSheet, message: "Production data fetched successfully" };
    } catch (error) {
        console.error("[PRODUCTION_EFFICIENCY_ERROR]", error);
        throw new Error("Internal Server Error");
    }
}
