"use server";
import { ProductionDataType } from "./analytics-chart";
import { poolForPortal } from "@/lib/postgres";


export async function getOperatorEfficiency(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {
    

  {
    
try {

  
  const query = `
    WITH avg_smv AS (
    SELECT oo."seqNo", o.name, AVG(CAST(oo.smv AS NUMERIC)) AS avg
    FROM "ProductionSMV" ps
    INNER JOIN "ObbOperation" oo ON oo."id" = ps."obbOperationId"
    INNER JOIN "ObbSheet" os ON os."id" = oo."obbSheetId"
    INNER JOIN "Operation" o ON o."id" = oo."operationId"
    WHERE os."id" = $1
    GROUP BY oo."seqNo", o.name
),

production_count AS (
    SELECT oo."seqNo", o.name, SUM(pd."productionCount") AS count,
    MAX(TO_TIMESTAMP(pd."timestamp", 'YYYY-MM-DD HH24:MI:SS')) AS last ,
    min(TO_TIMESTAMP(pd."timestamp", 'YYYY-MM-DD HH24:MI:SS')) AS first
    FROM "ProductionData" pd
    INNER JOIN "ObbOperation" oo ON oo."id" = pd."obbOperationId"
    INNER JOIN "ObbSheet" os ON os."id" = oo."obbSheetId"
    INNER JOIN "Operation" o ON o."id" = oo."operationId"
    WHERE pd.timestamp LIKE $2 
      AND os."id" = $1
    GROUP BY oo."seqNo", o.name
)

SELECT a."seqNo", a.name, a.avg, p.count,p.first,p.last
FROM avg_smv a
JOIN production_count p ON a."seqNo" = p."seqNo" AND a.name = p.name
ORDER BY a."seqNo";
  `;
  const values = [obbsheetid,date];

  const result = await poolForPortal.query(query, values);

  // console.log("DATAaa: ", result.rows);
  return new Promise((resolve) => resolve(result.rows as any[]));
  
  
} catch (error) {
  console.error("[TEST_ERROR]", error);
  throw error;
}
finally{
  
}
}    
  


}


export async function   getHours(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {
  

  {
    
try {

  
  const query = `
    select  MIN(TO_TIMESTAMP(os."LoginTimestamp", 'YYYY-MM-DD HH24:MI:SS')) AS login,
MAX(TO_TIMESTAMP(os."LogoutTimestamp", 'YYYY-MM-DD HH24:MI:SS')) AS logout , o.name as namee
from "OperatorSession" os
inner join "ObbOperation" oo  on oo.id = os."obbOperationId"
inner join "Operation" o  on o.id = oo."operationId"
inner join "ObbSheet" oss  on oss.id = oo."obbSheetId"

where "LoginTimestamp" like $2 and
oo."obbSheetId" = $1

group by namee,oo."seqNo"
order by oo."seqNo"
  `;
  const values = [obbsheetid,date];

  const result = await poolForPortal.query(query, values);

  // console.log("DATAaa: ", result.rows);
  return new Promise((resolve) => resolve(result.rows as any[]));
  
  
} catch (error) {
  console.error("[TEST_ERROR]", error);
  throw error;
}
finally{
  
}
}    
}
export async function getObbSheetID(linename: string): Promise<string> {

  {
    
try {

  
  const query = `
    SELECT oo.id
    FROM "ProductionLine" pl 
    INNER JOIN "ObbSheet" oo 
    ON pl.id = oo."productionLineId"
    WHERE oo."isActive"=true and pl.name=$1
    order by oo."createdAt" desc
  `;
  const values = [linename];

  const result = await poolForPortal.query(query, values);

  // console.log("DATAaa: ", result.rows);
  return new Promise((resolve) => resolve(result.rows[0].id ));
  
  
} catch (error) {
  console.error("[TEST_ERROR]", error);
  throw error;
}
finally{
  
}
}    

  }