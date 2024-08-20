import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
    req: Request
) {
    try {
        const obbSheets = await db.obbSheet.findMany({
            where: {
                isActive: true
            },
            select: {
                id: true,
                name: true

            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({ data: obbSheets, message: 'OBB sheets fetched successfully'}, { status: 201 });
    } catch (error) {
        console.error("[FETCH_OBB_SHEETS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}