"use server";
import { poolForPortal } from "@/lib/postgres";


export async function getData(obbsheetid:string,date:string)  : Promise<any[]>{
 


    try {
  
        const query = `
        SELECT pd."productionCount" as count, concat(substring(concat(oo."seqNo",'-',o.name ) from 0 for 30),' ','(',sm."machineId",')') as name  ,
     pd.timestamp as timestamp, oo."seqNo",oo.target,oo.smv as smv
    FROM "ProductionData" pd
    right JOIN "ObbOperation" oo ON pd."obbOperationId" = oo.id
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    inner JOIN "Operation" o ON o.id= oo."operationId"
     inner join "SewingMachine" sm on sm.id=oo."sewingMachineId"
    WHERE os.id = $1 and pd.timestamp like $2
     order by  pd.timestamp ;
        `;
        const values = [obbsheetid,date];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as any[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }

}

export async function geOperationList(obbsheetid:string ,date:string) : Promise<any[]>  {
    try {
  
        const query = `
        SELECT concat (substring(concat(oo."seqNo",'-',o.name ) from 0 for 30),' ','(',sm."machineId",')')  as name
    FROM "ObbOperation" oo  
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    inner JOIN "Operation" o ON o.id= oo."operationId"
    inner join "SewingMachine" sm on sm.id=oo."sewingMachineId"
    inner Join "ProductionData" pd ON pd."obbOperationId" = oo.id
    WHERE os.id = $1  and pd.timestamp like $2
    GROUP BY  concat (substring(concat(oo."seqNo",'-',o.name ) from 0 for 30),' ','(',sm."machineId",')'),oo."seqNo"
    order by  oo."seqNo" ;
        `;
        const values = [obbsheetid,date];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as any[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
 
   
}

export async function getEliotMachineList(obbsheetid:string,date:string ) : Promise<any[]>  {

    try {
  
        const query = `
   SELECT sm."machineId",ed."serialNumber"
    FROM "ObbOperation" oo  
    INNER JOIN "ObbSheet" os ON oo."obbSheetId" = os.id
    inner JOIN "SewingMachine" sm ON sm."id"= oo."sewingMachineId"
    inner JOIN "EliotDevice" ed ON ed.id = sm."eliotDeviceId"
    inner Join "ProductionData" pd ON pd."obbOperationId" = oo.id
    WHERE os.id = $1  and pd.timestamp like $2
    group by sm."machineId",ed."serialNumber",oo."seqNo"
     order by  oo."seqNo" ;
        `;
        const values = [obbsheetid,date];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as any[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
 
}