import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
    req: Request
) {
    const url = new URL(req.url);
    const obbSheetId = url.searchParams.get('obbSheetId');
    const date = url.searchParams.get('date');

    if (!obbSheetId || !date) {
        return new NextResponse("Missing required parameters: obbSheetId or date", { status: 409 })
    }

    const startDate = `${date} 00:00:00`; // Start of the day
    const endDate = `${date} 23:59:59`; // End of the day

    try {
        const productionData = await db.productionEfficiency.findMany({
            where: {
                // operatorRfid: "OP-00090",
                // obbOperationId: "ly8pb4yn-rC6auXtWFDaK",
                obbOperation: {
                    obbSheetId: obbSheetId,
                },
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                operator: {
                    select: {
                        name: true,
                        employeeId: true,
                        rfid: true,
                        operatorSessions:{
                            where:{
                                LoginTimestamp:{
                                    gte:startDate,
                                    lte:endDate
                                },
                               
                            }
                        }
                    }
                },
                obbOperation: {
                    select: {
                        id: true,
                        seqNo: true,
                        target: true,
                        smv: true,
                        part: true,
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
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        // console.log("DATA COUNT:", productionData.length);
        // console.log("DATA:", productionData);

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