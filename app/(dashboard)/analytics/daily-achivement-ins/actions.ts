"use server";
import { ProductionDataType } from "./components/analytics-chart";
import { poolForPortal } from "@/lib/postgres";


export async function getData(obbsheetid:string,date:string) : Promise<ProductionDataType[]>   {

    {
        
      try {
    
        // select SUM(pd."productionCount") as count
        // ,concat(oo."seqNo",'-',o.name ) as name ,oo.target,sm."machineId" as machine
        // FROM "ProductionData" pd
        // INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
        // INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
        // INNER JOIN "Operation" o ON o.id= oo."operationId"
        // INNER JOIN "SewingMachine" sm on sm.id = oo."sewingMachineId"
        // WHERE os.id = $1 and pd.timestamp like $2
        // group by o.name,oo.target,oo."seqNo",machine order by  oo."seqNo" 
        
        const query = `
      

select DISTINCT on (o.name,"oo"."seqNo",oo.target,"sm"."machineId") pd."totalPcs" as count,

    concat(oo."seqNo",'-',o.name ) as name ,oo.target,sm."machineId" as machine
    FROM "ProductionEfficiency" pd
    INNER JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    INNER JOIN "Operation" o ON o.id= oo."operationId"
    INNER JOIN "SewingMachine" sm on sm.id = oo."sewingMachineId"
    WHERE os.id = $1 and pd.timestamp like $2
    order by  oo."seqNo",o.name,oo.target,machine ,pd.timestamp desc

        `;
        const values = [obbsheetid,date];
    
        const result = await poolForPortal.query(query, values);
    console.log(obbsheetid,date)
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as ProductionDataType[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{
        
      }}




}