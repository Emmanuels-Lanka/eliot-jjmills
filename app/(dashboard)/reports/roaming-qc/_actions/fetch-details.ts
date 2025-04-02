"use server"

import { ObbSheet, ProductionLine } from "@prisma/client";

import { db } from "@/lib/db";

export async function fetchLinesForUnit(unitName: string): Promise<ProductionLine[]> {
    try {
        const lines = await db.productionLine.findMany({
            where: {
                unit: {
                    name: unitName
                }
            }
        });

        return new Promise((resolve) => resolve(lines as ProductionLine[]));
    } catch (error) {
        console.error("[FETCH_LINES_FOR_UNIT_ERROR]", error);
        return [];
    }
}

export async function fetchObbSheetsForUnit(lineId: string): Promise<ObbSheet[]> {
    try {
        const obbSheets = await db.obbSheet.findMany({
            where: {
                productionLineId: lineId,
                isActive: true
            }
        });

        return new Promise((resolve) => resolve(obbSheets as ObbSheet[]));
    } catch (error) {
        console.error("[FETCH_OBB_SHEETS_FOR_UNIT_ERROR]", error);
        return [];
    }
}