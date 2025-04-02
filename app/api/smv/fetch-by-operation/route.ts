import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
    req: Request
) {
    const url = new URL(req.url);
    const obbOperationId = url.searchParams.get('obbOperationId');
    const date = url.searchParams.get('date');

    if (!obbOperationId || !date) {
        return new NextResponse("Missing required parameters: obbOperationId or date", { status: 409 })
    }

    const startDate = `${date} 00:00:00`; // Start of the day
    const endDate = `${date} 23:59:59`; // End of the day

    try {
        const smv = await db.productionSMV.findMany({
            where: {
                obbOperationId,
                timestamp: {
                    gte: startDate,
                    lte: endDate
                },
                smv: {
                    not: "0.00" // Exclude entries where smv is 0
                }
            },
            include: {
                obbOperation: {
                    select: {
                        smv: true,
                        operation: {
                            select: {
                                name: true,
                                code: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                id: "asc"
            }
        });
        console.log('Dat00000',smv)

        //target SMV
        const tsmv = await db.obbOperation.findFirst({
            where: {
               id: obbOperationId
            },
             select: {
                smv: true,
                },
        })

        console.log("tsmv",tsmv,)

        return NextResponse.json({ data: smv, tsmv,message: 'SMV data fetched successfully'}, { status: 201 });
    } catch (error) {
        console.error("[FETCH_SMV_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}