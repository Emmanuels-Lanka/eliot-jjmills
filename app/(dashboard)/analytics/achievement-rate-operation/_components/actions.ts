"use server";

import { poolForPortal } from "@/lib/postgres";
import { ProductionDataType } from "./analytics-chart";

export async function getOperatorEfficiency(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {
 

    try {
  
        const query = `
         SELECT  opn.name as name,sum(pd."productionCount")  as count, obbopn.target,obbopn."seqNo" as seqNo
            FROM "ProductionData" pd
            INNER JOIN "ObbOperation" obbopn ON pd."obbOperationId" = obbopn.id
            INNER JOIN "Operation" opn ON opn.id= obbopn."operationId"
            INNER JOIN "ObbSheet" obbs ON obbopn."obbSheetId" = obbs.id
            WHERE pd.timestamp like  $1 and  obbs.id = $2}
            group by opn.name,obbopn."seqNo",obbopn.target
             order by  obbopn."seqNo"
        `;
        const values = [date,obbsheetid];
    
        const result = await poolForPortal.query(query, values);
    
        console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as ProductionDataType[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
    
   
}