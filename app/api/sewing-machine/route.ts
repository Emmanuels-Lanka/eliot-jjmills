import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { unitId, machineType, brandName, serialNumber, modelNumber, machineId, eliotDeviceId, ownership } = await req.json();


        const existingMachineByMachineID = await db.sewingMachine.findUnique({
            where: {
                machineId
            }
        });

        const existingMachineBySerialNo = await db.sewingMachine.findUnique({
            where: {
                serialNumber
            }
        });

        if (existingMachineByMachineID || existingMachineBySerialNo) {
            return new NextResponse("Sewing machine is already registered", { status: 409 })
        }

        // Create a new machine
        const newMachine = await db.sewingMachine.create({
            data: {
                brandName,
                machineType,
                machineId,
                serialNumber,
                ownership,
                modelNumber,
                eliotDeviceId: eliotDeviceId || null,
                unitId
            }
        });

        // Change the device state of isAssigned
        if (eliotDeviceId) {
            await db.eliotDevice.update({
                where: {
                    id: eliotDeviceId
                },
                data: {
                    isAssigned: true
                }
            })
        }

        return NextResponse.json({ data: newMachine, message: 'Sewing machine is created successfully'}, { status: 201 });

    } catch (error) {
        console.error("[SEWING_MACHINE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}



