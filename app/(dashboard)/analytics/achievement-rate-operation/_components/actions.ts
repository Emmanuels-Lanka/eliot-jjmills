"use server";
import { neon } from "@neondatabase/serverless";
import { ProductionDataType } from "./analytics-chart";

export async function getOperatorEfficiency(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql`SELECT 
    sum(pd."productionCount") as count,
    o.name,
    oo.target
FROM 
    "ProductionData" pd
INNER JOIN 
    "ObbOperation" oo ON pd."obbOperationId" = oo.id
INNER JOIN 
    "ObbSheet" os ON oo."obbSheetId" = os.id
INNER JOIN 
    "Operation" o ON o.id = oo."operationId"
WHERE 
    os.id = ${obbsheetid} 
    AND pd.timestamp like ${date}
GROUP BY 
    o.name, oo."seqNo", oo.target 
ORDER BY  
    oo."seqNo";`;
    console.log("data",data,)
    return new Promise((resolve) => resolve(data as ProductionDataType[] ))
}