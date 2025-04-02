"use server";
import { ProductionDataType } from "./LogTable";
import { poolForPortal } from "@/lib/postgres";



export async function getData(obbsheetid:string,date:string)  : Promise<ProductionDataType[]>   {


  {
    
  try {

    
    const query = `
      SELECT 
  oprt.name, 
  oprt."employeeId", 
  opn.name AS operationname, 
  opn.code, 
  pd."eliotSerialNumber", 
  SUM(pd."productionCount") AS totprod, 
  obbopn.target, 
  obbopn."seqNo", 
  sm."machineId", 
  null as "LoginTimestamp", 
  null  as "LogoutTimestamp"
FROM 
  "ProductionData" pd
  INNER JOIN "ObbOperation" obbopn ON pd."obbOperationId" = obbopn.id
  INNER JOIN "Operation" opn ON opn.id = obbopn."operationId"
  INNER JOIN "ObbSheet" obbs ON obbopn."obbSheetId" = obbs.id
  INNER JOIN "SewingMachine" sm ON sm.id = obbopn."sewingMachineId"
  INNER JOIN "Operator" oprt ON oprt.rfid = pd."operatorRfid"
  
WHERE 
  pd.timestamp LIKE $2
  AND obbs.id = $1
  
GROUP BY 
  sm."machineId", 
  pd."eliotSerialNumber", 
  opn.name, 
  opn.code, 
  obbopn."seqNo", 
  obbopn.target, 
  oprt.name, 
  oprt."employeeId",
  obbopn."seqNo"
  ORDER BY 
  obbopn."seqNo";
    `;
    const values = [obbsheetid,date];

    const result = await poolForPortal.query(query, values);

    // console.log("DATAaa: ", result.rows);
    return new Promise((resolve) => resolve(result.rows as ProductionDataType[] ));
    
    
  } catch (error) {
    console.error("[TEST_ERROR]", error);
    throw error;
  }
  finally{

  }}


   
     


}




