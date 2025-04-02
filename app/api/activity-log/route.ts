import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
    req: Request
) {
    try {
        const { part, activity } = await req.json();

        const res = await db.activityLog.create({
            data: {
                part,
                activity
            }
        });

        return NextResponse.json({ data: res, message: 'Successfully created activity log' }, { status: 200 });
    } catch (error) {
        console.error("[CREATE_ACTIVITY_LOG_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}