"use server"
import { neon } from "@neondatabase/serverless";
import { SMVChartData } from "./analytics-chart";

export async function getSMV(obbSheetId:String,date:String):Promise<SMVChartData[]> {
  
  const sql = neon(process.env.DATABASE_URL || "");

  const Date = `${date}%`; // Start of the day
//   const endDate = `${date} 23:59:59`; // End of the day

//   console.log("Start Date:", startDate);
//   console.log("End Date:", endDate);
//   const smv = await sql `SELECT 
//   p.id,
//   o.smv,
//   op.name,
//   op.code
// FROM 
//   "ProductionSMV" p 
// JOIN 
//   "ObbOperation" o ON p."obbOperationId" = o.id
// JOIN 
//   "Operation" op ON o."operationId" = op.id
// WHERE 
//   o."obbSheetId" = ${obbSheetId}
//   AND p.timestamp >=${startDate}
//   AND p.timestamp <= ${endDate }
// ORDER BY 
//   p.id ASC;`


 


 


const smv = await sql `SELECT 
     
    o.smv,
    op.name,
    o."seqNo",
    op.code,
    AVG(CAST(p.smv AS NUMERIC)) AS avg
    
FROM 
    "ProductionSMV" p
JOIN 
    "ObbOperation" o ON p."obbOperationId" = o.id
JOIN 
    "Operation" op ON o."operationId" = op.id
WHERE 
    o."obbSheetId" = ${obbSheetId}
    AND p.timestamp >=${Date}
  
group by   o.smv,
    op.name,
    o."seqNo",
    op.code
ORDER BY 
     op.name ASC;`


  console.log("SMV Data",smv)

  return new Promise((resolve) => resolve(smv as SMVChartData[] ))
}