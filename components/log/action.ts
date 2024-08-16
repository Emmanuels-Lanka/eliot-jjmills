"use server";
import { neon } from "@neondatabase/serverless";
import { ProductionDataType } from "./LogTable";


export async function getData(obbsheetid:string,date:string)  : Promise<ProductionDataType[]>   {
    const sql = neon(process.env.DATABASE_URL || "");

    const data = await sql`SELECT 
  oprt.name, 
  oprt."employeeId", 
  opn.name AS operationname, 
  opn.code, 
  pd."eliotSerialNumber", 
  SUM(pd."productionCount") AS totprod, 
  obbopn.target, 
  sm."machineId", 
  opses."LoginTimestamp", 
  opses."LogoutTimestamp"
FROM 
  "ProductionData" pd
  INNER JOIN "ObbOperation" obbopn ON pd."obbOperationId" = obbopn.id
  INNER JOIN "Operation" opn ON opn.id = obbopn."operationId"
  INNER JOIN "ObbSheet" obbs ON obbopn."obbSheetId" = obbs.id
  INNER JOIN "SewingMachine" sm ON sm.id = obbopn."sewingMachineId"
  INNER JOIN "Operator" oprt ON oprt.rfid = pd."operatorRfid"
  INNER JOIN "OperatorSession" opses ON opses."operatorRfid" = oprt."rfid"
WHERE 
  pd.timestamp LIKE ${date} 
  AND obbs.id = ${obbsheetid}
GROUP BY 
  sm."machineId", 
  pd."eliotSerialNumber", 
  opn.name, 
  opn.code, 
  obbopn."seqNo", 
  obbopn.target, 
  oprt.name, 
  oprt."employeeId", 
  opses."LoginTimestamp", 
  opses."LogoutTimestamp"
ORDER BY 
  obbopn."seqNo";`;

    console.log("data fetchedddddd",data,)


 
    return new Promise((resolve) => resolve(data as ProductionDataType[]  ))
}