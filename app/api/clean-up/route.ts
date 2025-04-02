import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
    req: Request
) {
    try {
        const startDate = "2024-11-01 00:00:00";
        const endDate = "2024-11-31 23:59:59";

        const data = await db.productionData.count({
            where: {
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
        
        console.log("LENGTH: " + data);

        // const data = await db.productionData.deleteMany({
        //     where: {
        //         timestamp: {
        //             gte: startDate,
        //             lte: endDate
        //         }
        //     }
        // });

        // if (data.count === 0) {
        //     return NextResponse.json({ message: 'No records found within the specified date range' }, { status: 404 });
        // }

        return NextResponse.json({ data: data, message: 'Deleted the data successfully' }, { status: 200 });
    } catch (error) {
        console.error("[CLEAN_UP_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}