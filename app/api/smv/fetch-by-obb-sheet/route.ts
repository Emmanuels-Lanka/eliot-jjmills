import { NextResponse } from "next/server";

import { poolForPortal } from "@/lib/postgres";

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
    try {
  
        const query = `
       SELECT 
    p.id,
    o.smv,
    op.name,
    op.code
FROM 
    "ProductionSMV" p
JOIN 
    "ObbOperation" o ON p."obbOperationId" = o.id
JOIN 
    "Operation" op ON o."operationId" = op.id
WHERE 
    o."obbSheetId" = $1
    AND p.timestamp >=$2
    AND p.timestamp <= $3
ORDER BY 
    p.id ASC;
        `;
        const values = [obbSheetId,startDate,endDate];
    
        const result = await poolForPortal.query(query,values);
    
        // console.log("DATAaa: ", result.rows);
         return NextResponse.json({ data: result.rows, message: 'SMV data fetched successfully'}, { status: 201 });
    } catch (error) {
        console.error("[FETCH_SMV_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }


  
       
}