import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
    req: Request
) {
    const url = new URL(req.url);
    const obbSheetId = url.searchParams.get('obbSheetId');
    const operatorId = url.searchParams.get('operatorId');
    const date = url.searchParams.get('date');
    
    console.log("asd",operatorId,obbSheetId,date)

    if (!operatorId || !obbSheetId || !date) {
        return new NextResponse("Missing required parameters: obbSheetId or date or operatorId", { status: 409 })
    }

    const startDate = `${date} 00:00:00`; // Start of the day
    const endDate = `${date} 23:59:59`; // End of the day

    try {

        // const productionData = await db.operator.findUnique({
        //     where: {
        //         id: operatorId,
        //         productionData: {
        //             every: {
        //                 obbOperation: {
        //                     obbSheetId: obbSheetId
        //                 },
        //                 timestamp: {
        //                     gte: startDate,
        //                     lte: endDate
        //                 }
        //             }
        //         },
        //     },
        //     select: {
        //         productionData: {
        //             include: {
        //                 operator: true,
        //                 eliotDevice: true,
        //                 obbOperation: {
        //                     include: {
        //                         operation: true,
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // });
        const productionData = await db.productionData.findMany({
            where: {
                timestamp: {
                    gte: startDate,
                    lte: endDate
                },
                operator: {
                    id: operatorId
                },
                obbOperation: {
                    obbSheetId: obbSheetId
                },
            },
            include: {
                operator: {
                    select: {
                        name: true,
                        employeeId: true,
                        rfid: true
                    }
                },
                obbOperation: {
                    select: {
                        id: true,
                        seqNo: true,
                        target: true,
                        smv: true,
                        operation: {
                            select: {
                                name: true
                            }
                        },
                        sewingMachine: {
                            select:{
                                machineId:true
                            }
                        }
                    }
                }
            }
        });

        const obbSheet = await db.obbSheet.findUnique({
            where: {
                id: obbSheetId
            },
            select: {
                name: true,
                efficiencyLevel1: true,
                efficiencyLevel3: true,
            }
        });

        return NextResponse.json({ data: productionData, obbSheet, message: 'Production data fetched successfully'}, { status: 201 });
    } catch (error) {
        console.error("[PRODUCTION_EFFICIENCY_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}