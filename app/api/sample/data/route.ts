import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

const addMinutes = (date: Date, minutes: number) => {
    return new Date(date.getTime() + minutes * 60000);
}

const formatDateToString = (date: Date) => {
    const z = (n: number) => n < 10 ? '0' + n : '' + n;
    return date.getFullYear() + '-' + z(date.getMonth() + 1) + '-' + z(date.getDate()) + ' ' + z(date.getHours()) + ':' + z(date.getMinutes()) + ':' + z(date.getSeconds());
}

export async function POST(
    req: Request,
) {
    try {
        // Testing merge
        const { operatorRfid, eliotSerialNumber, obbOperationId, initialCount, iterations } = await req.json();

        let id = generateUniqueId();
        let timestamp = new Date("2024-04-21T04:50:00Z");
        let productionCount = parseInt(initialCount, 10);
        const data = [];
        const increment = 6;

        for (let i = 0; i < iterations; i++) {
            let id = generateUniqueId();
            productionCount += increment;
            timestamp = addMinutes(timestamp, 5);

            data.push({
                id,
                operatorRfid,
                eliotSerialNumber,
                obbOperationId,
                productionCount,
                timestamp: formatDateToString(timestamp)
            });
        }

        const createdSession = await db.productionData.createMany({
            data
        });

        return NextResponse.json({ data: createdSession, message: 'Session created successfully' }, { status: 201 });

    } catch (error) {
        console.error("[PRODUCTION_DATA_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}