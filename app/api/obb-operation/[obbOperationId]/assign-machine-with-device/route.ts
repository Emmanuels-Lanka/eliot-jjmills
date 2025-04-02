import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: { obbOperationId: string } }
) {
    const { searchParams } = new URL(req.url);
    const machineId = searchParams.get("machineId");
    const serialNumber = searchParams.get("eliotSerialNo");

    if (!machineId || !serialNumber) {
        return new NextResponse("Required fields are missing", { status: 400 })
    }

    try {
        // Fetch the ObbSheet for this Obb operation
        const obbOperation = await db.obbOperation.findUnique({
            where: {
                id: params.obbOperationId
            },
            select: {
                obbSheetId: true,
                isActive: true
            }
        });

        const existingOperation = await db.obbOperation.findFirst({
            where: {
                sewingMachineId: machineId,
                obbSheetId: obbOperation?.obbSheetId,
            }
        });

        if (existingOperation) {
            return new NextResponse("This sewing machine is already assigned to another operation.", { status: 409 });
        }

        // Fetch the Device details
        const eliotDevice = await db.eliotDevice.findUnique({
            where: {
                serialNumber,
            }
        });

        // Check the device is it already assigned with another machine
        if (eliotDevice?.isAssigned) {
            // Remove the device from the machine
            await db.sewingMachine.update({
                where: {
                    eliotDeviceId: serialNumber
                },
                data: {
                    eliotDeviceId: null
                }
            });
        }

        // Assign the machine to the ObbOperating
        await db.obbOperation.update({
            where: {
                id: params.obbOperationId
            },
            data: {
                sewingMachineId: machineId
            }
        });
        
        // Bind the device with the machine and update the activeObbOperationId column
        await db.sewingMachine.update({
            where: {
                machineId
            },
            data: {
                eliotDeviceId: eliotDevice?.id,
                activeObbOperationId: params.obbOperationId
            }
        })
        
        // set `isAssigned: true` in eliot table
        await db.eliotDevice.update({
            where: {
                serialNumber
            },
            data: {
                isAssigned: true
            }
        });
        
        return NextResponse.json({ message: 'Binded successfully'}, { status: 201 });
    } catch (error) {
        console.error("[ASSIGN_MACHINE_WITH_DEVICE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}