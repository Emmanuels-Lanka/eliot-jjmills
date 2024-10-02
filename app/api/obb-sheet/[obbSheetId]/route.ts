import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { obbSheetId: string } }
) {
    try {
        const existingSheetById = await db.obbSheet.findUnique({
            where: {
                id: params.obbSheetId
            }
        });

        if (!existingSheetById) {
            return new NextResponse("OBB sheet does not exist!", { status: 409 })
        }

        // Fetch the obb operations for this sheet
        const obbOperations = await db.obbOperation.findMany({
            where: {
                obbSheetId: params.obbSheetId
            }
        });

        // Change the activeObbOperation on each assigned machine
        for (const operation of obbOperations) {
            if (operation.sewingMachineId) {
                await db.sewingMachine.update({
                    where: {
                        id: operation.sewingMachineId
                    },
                    data: {
                        activeObbOperationId: null,
                    }
                });
            }
        }

        // Delete the OBB sheet
        await db.obbSheet.delete({
            where: {
                id: params.obbSheetId
            }
        });

        return new NextResponse("OBB sheet removed successfully", { status: 201 })
    } catch (error) {
        console.error("[OBB_SHEET_DELETE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { obbSheetId: string } }
) {
    try {
        const { 
            unitId, productionLineId, indEngineer, supervisor1, supervisor2, mechanic, qualityIns, accInputMan, fabInputMan, 
            buyer, style, item, operators, helpers, startingDate, endingDate, workingHours, 
            efficiencyLevel1, efficiencyLevel2, efficiencyLevel3, itemReference, totalMP, totalSMV, bottleNeckTarget, target100, 
            ucl, lcl, balancingLoss, balancingRatio, colour, supResponseTime, mecResponseTime, qiResponseTime, 
        } = await req.json();

        const existingSheetById = await db.obbSheet.findUnique({
            where: {
                id: params.obbSheetId
            }
        });

        if (!existingSheetById) {
            return new NextResponse("The OBB sheet does not exist", { status: 409 })
        };

        // Fetch the line name
        const line = await db.productionLine.findUnique({
            where: {
                id: productionLineId
            }
        });

        const name = `${line?.name}-${style}`

        const updatedSheet = await db.obbSheet.update({
            where: {
                id: params.obbSheetId
            },
            data: {
                name, unitId, productionLineId, 
                indEngineerId: indEngineer, 
                supervisorFrontId: supervisor1, 
                supervisorBackId: supervisor2,
                mechanicId: mechanic, 
                qualityInsId: qualityIns, 
                accInputManId: accInputMan, 
                fabInputManId: fabInputMan, 
                buyer, style, item, operators, helpers, startingDate, endingDate, workingHours, efficiencyLevel1,
                efficiencyLevel2, efficiencyLevel3, itemReference, totalMP, totalSMV, bottleNeckTarget,
                target100, ucl, lcl, balancingLoss, balancingRatio, colour, supResponseTime, mecResponseTime, qiResponseTime,
            }
        });

        return NextResponse.json({ data: updatedSheet, message: 'OBB sheet updated successfully' }, { status: 201 });
    } catch (error) {
        console.error("[OBB_SHEET_UPDATE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}