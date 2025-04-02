"use server";

import { poolForPortal } from "@/lib/postgres";




export async function getObb(unit:any) : Promise<{ id: string; name: string }[]>  {
  

    try {
  
      
      const query = `
        SELECT os.name AS name, os.id AS id 
        FROM "ObbSheet" os
        INNER JOIN "Unit" u ON u.id = os."unitId"
        WHERE os."unitId" = $1 AND os."isActive"
        ORDER BY os."createdAt" DESC
      `;
      const values = [unit];
  
      const result = await poolForPortal.query(query, values);
  
      console.log("DATAaa: ", result.rows);
      return new Promise((resolve) => resolve(result.rows as { id: string; name: string }[]));
      
      
    } catch (error) {
      console.error("[TEST_ERROR]", error);
      throw error;
    }
    finally{
      
    }
  
  }
  


export async function getOperationSmv(obbSheetId:string,date:string) : Promise<any[]>  {

  {
  try {

    
    const query = `
     WITH OperationData AS (
    SELECT os."seqNo", os.smv, o.name
    FROM "ObbOperation" os
    INNER JOIN "Operation" o ON o.id = os."operationId"
    WHERE os."obbSheetId" =$1
)
SELECT *, (SELECT COUNT(DISTINCT name) FROM OperationData) AS operations
FROM OperationData
ORDER BY "seqNo";

    `;
    const values = [obbSheetId];

    const result = await poolForPortal.query(query, values);

    // console.log("DATAaa: ", result.rows);
    return new Promise((resolve) => resolve(result.rows as any[] ));
    
    
  } catch (error) {
    console.error("[TEST_ERROR]", error);
    throw error;
  }
  finally{
    
  }}
  
}


export async function getTargetValues(obbSheetId:string) : Promise<any[]>  {

  try {
  
    const query = `
    select "totalSMV" as tsmv,"obbOperationsNo"as operations , name as obb from "ObbSheet" 
where id=$1
    `;
    const values = [obbSheetId];

    const result = await poolForPortal.query(query,values);

    // console.log("DATAaa: ", result.rows);
    return new Promise((resolve) => resolve(result.rows as any[]));
    
    
  } catch (error) {
    console.error("[TEST_ERROR]", error);
    throw error;
  }


}