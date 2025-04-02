import { NextResponse } from "next/server";

import { db } from "@/lib/db";





export async function GET(
    req: Request
){
  const url = new URL(req.url);
  const obbSheetId = url.searchParams.get('obbSheetId');
  const date = url.searchParams.get('date');
  console.log("dateppp",date)
  if (!obbSheetId || !date) {
      return new NextResponse("Missing required parameters: obbSheetId or date", { status: 409 })
  }


  try{
    
    const datelike = `${date}%`

         //const res=await db.$queryRaw`SELECT * FROM "ProductionData" WHERE timestamp like ${datelike};`
         const res=await db.$queryRaw`SELECT o.id,p.obbOperationId,p.timestamp,o.buyer FROM "ObbSheet" as o inner join "ProductionData" as p on o.id=p.obbOperationId   WHERE p.timestamp like ${datelike};`
         console.log("RES",res) //ObbSheet obbOperationId
         return NextResponse.json({ data: res,  message: 'Production data fetched successfully'}, { status: 200 });
       
     
    }
    catch(er){

      console.log(er)
      return new NextResponse("Missing required parameters: obbSheetId or date", { status: 409 })
    }
    
    
}