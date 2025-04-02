"use server"

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function handleDuplicateObb(obbSheetId: string) {
    try {
        const obbSheet = await db.obbSheet.findUnique({
            where: {
                id: obbSheetId
            },
            include: {
                productionLine: { select: { name: true } },
                obbOperations: true
            }
        });
        
        if (!obbSheet) {
            throw new Error("OBB Sheet not found");
        }

        const { id, name, productionLine, obbOperations, isActive, createdAt, updatedAt, ...restObb } = obbSheet;
        
        const data = await db.obbSheet.create({
            data: {
                id: generateUniqueId(),
                name: `${productionLine.name}-${obbSheet.style}-v${obbSheet.version} Copy`,
                isActive: false,
                ...restObb
            }
        });

        if (obbOperations.length > 0 ) {
            await db.obbOperation.createMany({
                data: obbOperations.map(operation => {
                    const { id, obbSheetId, isActive, sewingMachineId, createdAt, updatedAt, ...restOp } = operation;
                    return {
                        id: generateUniqueId(),
                        obbSheetId: data.id,
                        isActive: false,
                        ...restOp
                    }
                })
            });
        }

        return data;
    } catch (error) {
        console.error("[DUPLICATE_OBB_SHEET_ERROR]", error);
        return null;
    }
}