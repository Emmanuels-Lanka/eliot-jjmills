

"use server";
import { neon } from "@neondatabase/serverless";

import { ReportData } from "./daily-report";


export async function getDailyData(obbsheetid:string,date:string)  : Promise<ReportData[]>   {
    console.log("date",date)
    console.log("Obb sheet ",obbsheetid)
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql `select opr.id,opr.name as operatorname,
       op.name operationname,
       sum(pd."productionCount") as count,
       obbop.smv as smv,
       obbop.target
       from "ProductionData" pd
inner join "Operator" opr on pd."operatorRfid"=opr.rfid 
inner join "OperatorSession" ops on opr.rfid=ops."operatorRfid"
inner join "ObbOperation" obbop on ops."obbOperationId"=obbop.id
INNER JOIN "ObbSheet" obbs ON obbop."obbSheetId" = obbs.id
inner join "Operation" op on obbop."operationId"=op.id
where pd."timestamp" like ${date} AND obbs.id = ${obbsheetid}
group by opr.id,opr.name,op.name,obbop.smv,obbop.target`
  
console.log("TableData",data)
 
    return new Promise((resolve) => resolve(data as ReportData[]  ))
}


