import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { operationId, sewingMachineId, smv, target, spi, length, totalStitches, obbSheetId, supervisorId } = await req.json();
        
        let id = generateUniqueId();

        const existingMachine = await db.sewingMachine.findUnique({
            where: {
                id: sewingMachineId
            },
            include: {
                obbOperation: true
            }
        })

        if (existingMachine && existingMachine.obbOperation) {
            return new NextResponse("This sewing machine is already assigned to another operation.", { status: 409 })
        }

        const newObbOperation = await db.obbOperation.create({
            data: {
                id,
                operationId, 
                obbSheetId,
                smv, 
                target, 
                spi, 
                length, 
                totalStitches, 
                supervisorId,
                sewingMachine: {
                    connect: {
                        id: sewingMachineId
                    }
                }
            }
        });

        return NextResponse.json({ data: newObbOperation, message: 'OBB Operation created successfully'}, { status: 201 });

    } catch (error) {
        console.error("[OBB_OPERATION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}