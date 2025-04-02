"use server";

import { poolForPortal } from "@/lib/postgres";
import { ProductionDataType } from "./components/analytics-chart";
import { propItems } from "./components/vertical-graph";

export async function getData(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {
   

    try {
  
        const query = `
         SELECT SUM(pd."productionCount") as count,concat(oo."seqNo",'-',o.name ) as name ,oo.target
    FROM "ProductionData" pd
    INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    INNER JOIN "Operation" o ON o.id= oo."operationId"
    WHERE os.id = $1 and pd.timestamp like $2
    group by o.name,oo.target,oo."seqNo" order by  oo."seqNo" ;
        `;
        const values = [obbsheetid,date];
    
        const result = await poolForPortal.query(query, values);
    
        console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as ProductionDataType[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
   
  
}

export async function getSMV({obbSheet,date,timeslot}:propItems) {



    try {
  
        const query = `
          SELECT 
      o.smv,
      concat(o."seqNo",'-',op.name) as name,
      o."seqNo",   
      AVG(CAST(pd.smv AS NUMERIC)) AS avg
      
  FROM 
      "ProductionData" p
  JOIN 
      "ObbOperation" o ON p."obbOperationId" = o.id
  JOIN 
      "Operation" op ON o."operationId" = op.id
  inner JOIN "SewingMachine" sm ON sm."id"= o."sewingMachineId"
  INNER JOIN "ProductionSMV" pd ON pd."obbOperationId" = o.id
  WHERE 
      o."obbSheetId" = $1
      AND p.timestamp like $2
  group by  o.smv,
      op.name,
      o."seqNo"
     
  ORDER BY 
       o."seqNo" ASC;
        `;
        const values = [obbSheet,date];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as { id: string; name: string }[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
    
   
  }



  export async function getProduction({obbSheet,date,timeslot}:propItems) {
    

  
    const cleanDate = date.replace(/%$/, "");
    console.log(cleanDate)

    const time = String(timeslot).padStart(2, '0');
    // const datef = `${date}%`; // Start of the day

    try {
  
        const query = `
          SELECT SUM(pd."productionCount") as count,concat(oo."seqNo",'-',o.name ) as name 
    FROM "ProductionData" pd
    INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    INNER JOIN "Operation" o ON o.id= oo."operationId"
    WHERE os.id = $1 and  pd.timestamp like  $2 || ' ' || $3 || ':%'
    group by o.name,oo."seqNo" order by  oo."seqNo" ASC ;
        `;
        const values = [obbSheet,cleanDate,date];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as []));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
  

  }