"use server";


import { poolForPortal } from "@/lib/postgres";


export async function getCapacity(obbSheetId:string,date:string) : Promise<any[]>  {

    {
       
      try {
    
        
        const query = `
          SELECT 
    AVG(CAST(ps.smv AS NUMERIC)) AS avg,
    ps."operatorRfid",
    os."bundleTime",
    os."personalAllowance",
    o.name,
    oo."seqNo",
    oo.target,
    sm."machineId" ,
    os.name as obb
FROM 
    "ProductionSMV" ps 
INNER JOIN 
    "ObbOperation" oo ON oo.id = ps."obbOperationId"
INNER JOIN 
    "ObbSheet" os ON os.id = oo."obbSheetId"
INNER JOIN 
    "Operation" o ON o.id = oo."operationId"
INNER JOIN 
    "SewingMachine" sm ON sm.id = oo."sewingMachineId"
WHERE 
    timestamp like $2
    AND os.id = $1
    and ps.smv <> '0.00'
   
GROUP BY 
    ps."operatorRfid",
    os."bundleTime",
    os."personalAllowance",
    o.name,
    oo."seqNo",
    oo.target,
    sm."machineId",
    os.name
ORDER BY 
    oo."seqNo";
        `;
        const values = [obbSheetId  ,date+"%"];
    
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