import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { machineId: string } }
) {
    try {
        const existingMachineById = await db.sewingMachine.findUnique({
            where: {
                id: params.machineId,
            },
        });

        if (!existingMachineById) {
            return new NextResponse("This machine does not exist", {
                status: 409,
            });
        }

        // Fetch the eliot device id
        const data = await db.sewingMachine.findUnique({
            where: {
                id: params.machineId,
            },
            select: {
                eliotDeviceId: true,
            },
        });

        if (data?.eliotDeviceId) {
            // Change the isAssigned status on EliotDevice table
            const changedStatus = await db.eliotDevice.update({
                where: {
                    id: data?.eliotDeviceId,
                },
                data: {
                    isAssigned: false,
                },
            });
        }

        const deletedMachine = await db.sewingMachine.delete({
            where: {
                id: params.machineId,
            },
        });

        return new NextResponse("Machine deleted successfully", {
            status: 201,
        });
    } catch (error) {
        console.error("[DELETE_SEWING_MACHINE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { machineId: string } }
) {
    try {
        const {
            unitId,
            machineType,
            brandName,
            serialNumber,
            modelNumber,
            machineId,
            ownership,
            eliotDeviceId,
        } = await req.json();

        const existingMachineById = await db.sewingMachine.findUnique({
            where: {
                id: params.machineId,
            },
        });

        if (!existingMachineById) {
            return new NextResponse("This machine does not exist", {
                status: 409,
            });
        }

        if (eliotDeviceId) {
            // If the existing machine already has eliotDeviceId
            if (existingMachineById.eliotDeviceId) {
                if (existingMachineById.eliotDeviceId !== eliotDeviceId) {
                    // Change the ELIOT device status available
                    await db.eliotDevice.update({
                        where: {
                            id: existingMachineById.eliotDeviceId,
                        },
                        data: {
                            isAssigned: false,
                        },
                    });
    
                    // Assign new device
                    await db.eliotDevice.update({
                        where: {
                            id: eliotDeviceId,
                        },
                        data: {
                            isAssigned: true,
                        },
                    });
                }
            } else {
                // Change the ELIOT device status
                await db.eliotDevice.update({
                    where: {
                        id: eliotDeviceId,
                    },
                    data: {
                        isAssigned: true,
                    },
                });
            }
        }

        const updatedMachine = await db.sewingMachine.update({
            where: {
                id: params.machineId,
            },
            data: {
                brandName,
                machineType,
                machineId,
                serialNumber,
                modelNumber,
                ownership,
                unitId,
                eliotDeviceId: eliotDeviceId || null,
            },
        });

        return NextResponse.json(
            {
                data: updatedMachine,
                message: "Sewing machine updated successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("[UPDATE_SEWING_MACHINE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
