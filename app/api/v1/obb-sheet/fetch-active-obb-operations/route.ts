import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
    req: Request
) {
    const url = new URL(req.url);
    const obbSheetId = url.searchParams.get('obbSheetId');

    if (!obbSheetId) {
        return new NextResponse("Missing required parameters: obbSheetId", { status: 409 })
    }

    try {
        const obbOperations = await db.obbOperation.findMany({
            where: {
                obbSheetId,
                isActive: true
            },
            select: {
                id: true,
                seqNo: true,
                operation: {
                    select: {
                        name: true,
                        code: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // console.log("COUNT:", obbOperations.length);

        return NextResponse.json({ data: obbOperations, message: 'OBB operations fetched successfully'}, { status: 201 });
    } catch (error) {
        console.error("[FETCH_OBB_OPERATIONS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}