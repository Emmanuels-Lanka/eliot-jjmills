import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {
        console.log("WORKING...!");
        const body = await req.json();

        // const res = await db.unit.findMany();
        const res = await db.eliotDevice.createMany({
            data: body
        });
        console.log("RES:", res);

        return new NextResponse('ELIoT devices created successfully', { status: 201 });
        
    } catch (error) {
        console.error("[ELIOT_DEVICE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}