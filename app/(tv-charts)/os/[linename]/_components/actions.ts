"use server"
import { neon } from "@neondatabase/serverless";
import { SMVChartData } from "./analytics-chart";
import { createPostgresClient } from "@/lib/postgres";

export async function getSMV(obbSheetId:String,date:String):Promise<SMVChartData[]> {
    const datef = `${date}%`;

    {
        const client = createPostgresClient();
    try {
    
      await client.connect();
      const query = `
       SELECT 
    o.smv,
    concat(o."seqNo",' - ',op.name) as name,
    o."seqNo",
    AVG(CAST(p.smv AS NUMERIC)) AS avg,
    sm."machineId"
FROM 
    "ProductionSMV" p
JOIN 
    "ObbOperation" o ON p."obbOperationId" = o.id
JOIN 
    "Operation" op ON o."operationId" = op.id
inner JOIN "SewingMachine" sm ON sm."id"= o."sewingMachineId"
WHERE 
    o."obbSheetId" = $1
    AND p.timestamp like $2
group by  o.smv,
    op.name,
    o."seqNo",
    sm."machineId" 
ORDER BY 
     o."seqNo" ASC;
      `;
      const values = [obbSheetId,datef];
    
      const result = await client.query(query, values);
    
      // console.log("DATAaa: ", result.rows);
      return new Promise((resolve) => resolve(result.rows as SMVChartData[] ));
      
      
    } catch (error) {
      console.error("[TEST_ERROR]", error);
      throw error;
    }
    finally{
      await client.end()
    }
    }    

 

}