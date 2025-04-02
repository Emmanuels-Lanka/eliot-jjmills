import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE() {
    try {
        const data = await db.productionData.count({
            // where: {
            //     // timestamp: {
            //     //     gte: "2025-01-10 00:00:00"
            //     // },
            //     eliotSerialNumber: null
            // }
        });

        // const data = await db.productionData.deleteMany({
        //     where: {
        //         timestamp: {
        //             lte: "2024-12-10 00:00:00"
        //         },
        //         // eliotSerialNumber: null
        //     }
        // });

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("[DELETE_DATA_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}