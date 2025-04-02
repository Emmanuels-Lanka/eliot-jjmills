"use server";

import { poolForPortal } from "@/lib/postgres";
// import { ProductionDataType } from "./analytics-chart";

export async function getOperatorEfficiency(obbsheetid:string,date:string,timeValue:string)    {
    date = date+"%";

    {
        
      try {
    
       
        const query = `
          select sum(pd."productionCount") as total,oo."seqNo" as seqNo,concat(oo."seqNo",'-',o.name) as name,o.name as oprnName,op.name as oprtName,MAX(oet.net) as net,op.rfid
from "ProductionData" pd
inner join "ObbOperation" oo on oo.id = pd."obbOperationId" 
inner join "Operation" o on o.id = oo."operationId"
inner join "ObbSheet" os on os.id =  oo."obbSheetId"
inner join "Operator" op on op.rfid = pd."operatorRfid"

INNER JOIN (
    SELECT DISTINCT ON (oet."operatorRfid") oet."operatorRfid",oet."nonEffectiveTime" net
    FROM "OperatorEffectiveTime" oet
    WHERE oet."loginTimestamp" LIKE $2
) oet ON oet."operatorRfid" = pd."operatorRfid"

where pd.timestamp like $2 and os.id= $1
group by oo."seqNo",o.name,op.name,net,op.rfid;
        `;
        const values = [obbsheetid,date];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows ));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{
      
      }}


    
    
 
}



export async function getSMV(obbsheetid:string,date:string,timeValue:string)    {
    date=date+"%";

    {
        
      try {
    
       
        const query = `
          SELECT 
    AVG(CAST(o.smv AS NUMERIC)) AS avg,
    
     concat(o."seqNo",'-',op.name) as name,
    o."seqNo"
   
FROM 
    "ProductionSMV" p
JOIN 
    "ObbOperation" o ON p."obbOperationId" = o.id
JOIN 
    "Operation" op ON o."operationId" = op.id

  --INNER JOIN "ProductionSMV" pd ON pd."obbOperationId" = o.id
  WHERE 
      o."obbSheetId" = $1
      AND p.timestamp like $2
      
          
group by name,o."seqNo"

order by o."seqNo"
        `;
        const values = [obbsheetid,date];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows ));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{
      
      }}

   
}