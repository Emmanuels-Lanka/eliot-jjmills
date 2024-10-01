import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const {
            seqNo,
            operationId,
            sewingMachineId,
            smv,
            target,
            spi,
            length,
            totalStitches,
            obbSheetId,
            part
        } = await req.json();

        let id = generateUniqueId();

        // Fetch the ObbSheet
        const obbSheet = await db.obbSheet.findUnique({
            where: {
                id: obbSheetId
            },
            select: {
                supervisorFrontId: true,
                supervisorBackId: true,
                supervisorAssemblyId: true,
                supervisorLineEndId: true
            }
        });

        if (!obbSheet) {
            return new NextResponse("Obb Sheet not found.", { status: 409 });
        }

        // Find the supervisorId according to the part
        let supervisorId: string;
        switch (part) {
            case 'front':
                supervisorId = obbSheet.supervisorFrontId || "";
                break;
            case 'back':
                supervisorId = obbSheet.supervisorBackId || "";
                break;
            case 'assembly':
                supervisorId = obbSheet.supervisorAssemblyId || "";
                break;
            case 'line-end':
                supervisorId = obbSheet.supervisorLineEndId || "";
                break;
            default:
                return new NextResponse("Invalid part specified", { status: 400 });
        }

        // Check if a machine is already assigned to another operation for the same obbSheet
        if (sewingMachineId) {
            const existingOperation = await db.obbOperation.findFirst({
                where: {
                    sewingMachineId,
                    obbSheetId,
                }
            });

            if (existingOperation) {
                return new NextResponse("This sewing machine is already assigned to another operation.", { status: 409 });
            }
        }

        // Create the new ObbOperation
        const newObbOperation = await db.obbOperation.create({
            data: {
                id,
                seqNo,
                operationId,
                obbSheetId,
                smv: parseFloat(smv),
                target,
                spi,
                length,
                totalStitches,
                supervisorId: supervisorId,
                sewingMachineId: sewingMachineId || null,
                part
            }
        });

        return NextResponse.json({ data: newObbOperation, message: 'OBB Operation created successfully' }, { status: 201 });
    } catch (error) {
        console.error("[OBB_OPERATION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}