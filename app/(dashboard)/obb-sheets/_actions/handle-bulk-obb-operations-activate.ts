"use server"

import { ObbOperation } from "@prisma/client";

import { db } from "@/lib/db";

type ResultsDataType = {
    id: ObbOperation["id"];
    type: "success" | "error";
    status: string;
}

export async function handleBulkObbOperationsActivate(obbOperations: ObbOperation[]){
    try {
        const results: ResultsDataType[] = await Promise.all(
            obbOperations.map(async (obbOperation) => {
                if (!obbOperation.sewingMachineId) {
                    return { id: obbOperation.id, type: "error", status: "OBB operation does not have a sewing machine!" };
                }

                const sewingMachine = await db.sewingMachine.findUnique({
                    where: { id: obbOperation.sewingMachineId },
                });

                if (!sewingMachine) {
                    return { id: obbOperation.id, type: "error", status: "Sewing machine does not exist!" };
                }

                if (sewingMachine.activeObbOperationId) {
                    if (sewingMachine.activeObbOperationId !== obbOperation.id) {
                        return { id: obbOperation.id, type: "error", status: "Sewing machine already active with another operation!" };
                    }

                    await db.obbOperation.update({
                        where: { id: obbOperation.id },
                        data: { isActive: true },
                    });

                    return { id: obbOperation.id, type: "success", status: "Sewing machine already active with the same operation!" };
                }

                await Promise.all([
                    db.sewingMachine.update({
                        where: { id: sewingMachine.id },
                        data: { activeObbOperationId: obbOperation.id },
                    }),
                    db.obbOperation.update({
                        where: { id: obbOperation.id },
                        data: { isActive: true },
                    }),
                ]);

                return { id: obbOperation.id, type: "success", status: "Sewing machine activated successfully!" };
            })
        );

        const successResults = results.filter(result => result.type === "success");
        const errorResults = results.filter(result => result.type === "error");

        return { success: successResults, error: errorResults };
    } catch (error) {
        console.error("[BULK_OBB_OPERATIONS_ACTIVE_ERROR]", error);
        return null;
    }
}