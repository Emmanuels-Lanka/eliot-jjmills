import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: { obbOperationId: string } }
) {
    const { searchParams } = new URL(req.url);
    const machineId = searchParams.get("machineId");

    if (!machineId) {
        return new NextResponse("Machine ID is required", { status: 400 });
    }

    try {
        // Set null the active operation to available this machine
        await db.sewingMachine.update({
            where: {
                id: machineId
            },
            data: {
                activeObbOperationId: null,
            }
        });

        // Unassign the maching for this operation
        await db.obbOperation.update({
            where: {
                id: params.obbOperationId
            },
            data: {
                sewingMachineId: null,
            }
        });

        return new NextResponse("Successfully unassigned", { status: 200 });
    } catch (error) {
        console.error("[UNASSIGN_MACHINE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}