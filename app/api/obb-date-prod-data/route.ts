import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";

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
    console.log("date",date)

    try {
        
       
      
 
        const dateLike= date+"%"
        
        const res = await db.$queryRaw`
        SELECT "productionCount", "ObbSheet"."name"
        FROM "ProductionData"
        INNER JOIN "ObbOperation" ON "ProductionData"."obbOperationId" = "ObbOperation"."id"
        INNER JOIN "ObbSheet" ON "ObbOperation"."obbSheetId" = "ObbSheet"."id"
        WHERE "ProductionData"."timestamp" LIKE ${dateLike};
      `;
        console.log("date",date)
        console.log("adoooooo",res)
        console.log("first")
        return NextResponse.json({ data: res,  message: 'Production data fetched successfully'}, { status: 200 });

    } catch (error) {
        console.error("[PRODUCTION_EFFICIENCY_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}