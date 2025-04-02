"use server"

import { ObbOperation } from "@prisma/client";

import { db } from "@/lib/db";

type ResultsDataType = {
    id: ObbOperation["id"];
    type: "success" | "error";
    status: string;
}

export async function handleBulkObbOperationsDeactivate(obbOperations: ObbOperation[]){
    try {
        const results: ResultsDataType[] = await Promise.all(
            obbOperations.map(async (obbOperation) => {
                if (obbOperation.sewingMachineId) {
                    await db.sewingMachine.update({
                        where: { id: obbOperation.sewingMachineId },
                        data: { activeObbOperationId: null },
                    })
                }

                await db.obbOperation.update({
                    where: { id: obbOperation.id },
                    data: { isActive: false },
                });

                return { id: obbOperation.id, type: "success", status: "Sewing machine activated successfully!" };
            })
        );

        return { success: results, error: [] };
    } catch (error) {
        console.error("[BULK_OBB_OPERATIONS_ACTIVE_ERROR]", error);
        return null;
    }
}