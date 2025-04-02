import { NextResponse } from "next/server";
import moment from "moment-timezone";

import { db } from "@/lib/db";

export async function GET(
    req: Request
) {
    const url = new URL(req.url);
    const obbOperationId = url.searchParams.get('obbOperationId');

    if (!obbOperationId) {
        return new NextResponse("Missing required parameters: obbOperationId", { status: 409 })
    }

    const timezone: string = process.env.NODE_ENV === 'development' ? 'Asia/Colombo' : 'Asia/Dhaka'
    const today = moment().tz(timezone).format('YYYY-MM-DD');
    const startDate = `${today} 00:00:00`;
    const endDate = `${today} 23:59:59`;
    
    try {
        const operators = await db.operatorSession.findMany({
            where: {
                obbOperationId,
                LoginTimestamp: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                id: true,
                operator: {
                    select: {
                        name: true,
                        rfid: true,
                        employeeId: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // console.log("COUNT:", obbOperations.length);

        return NextResponse.json({ data: operators, message: 'Operators fetched successfully'}, { status: 201 });
    } catch (error) {
        console.error("[FETCH_OPERATORS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}