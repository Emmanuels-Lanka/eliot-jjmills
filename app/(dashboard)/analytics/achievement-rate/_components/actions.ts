"use server";

import { ProductionDataType } from "./analytics-chart";
import { poolForPortal } from "@/lib/postgres";

export async function getOperatorEfficiency(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {

    try {
      
          const query = `
           SELECT sum(pd."productionCount") as count, name:item.name.trim().substring(0,10)+"...", ,oo.target
            FROM "ProductionData" pd
            INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
            INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
            INNER JOIN "Operator" o ON o.rfid= pd."operatorRfid"
            WHERE os.id = $1 and pd.timestamp like $2
            group by o.name,oo."seqNo",oo.target order by  oo."seqNo" ;
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