"use server";
import { neon } from "@neondatabase/serverless";

export async function getOperatorEfficiencyData15M(obbsheetid:string,date:string)   {
    const sql = neon(process.env.DATABASE_URL || "");

    
    
    //  const data = await sql`SELECT substring(concat(obbopn."seqNo",'-',oprtr.name ) from 0 for 20)  as name,
    //         pd."productionCount" as count, obbopn.target,pd.timestamp as timestamp
    //         FROM "ProductionData" pd
    //         INNER JOIN "ObbOperation" obbopn ON pd."obbOperationId" = obbopn.id
    //         INNER JOIN "ObbSheet" obbs ON obbopn."obbSheetId" = obbs.id
    //         INNER JOIN "Operator" oprtr ON oprtr."rfid" = pd."operatorRfid"
    //         INNER JOIN "Operation" opn ON opn."id" = obbopn."operationId"
    //         WHERE pd.timestamp like ${date} and  obbs.id = ${obbsheetid}
    //         group by substring(concat(obbopn."seqNo",'-',oprtr.name ) from 0 for 20),obbopn.target, pd."productionCount",pd.timestamp
    //         order by  pd.timestamp ;`;

    // const data = await sql`SELECT substring(concat(obbopn."seqNo",'-(',opn."code",')-',oprtr.name ) from 0 for 25)  as name,
    const data = await sql`select CONCAT(SUBSTRING(CONCAT(obbopn."seqNo", '-(', opn."code", ')', '-', oprtr.name) FROM 1 FOR 25), ' ', '(', sm."machineId", ')') AS name,
    pd."productionCount" as count, obbopn.target,pd.timestamp as timestamp
    FROM "ProductionData" pd
    INNER JOIN "ObbOperation" obbopn ON pd."obbOperationId" = obbopn.id
    INNER JOIN "ObbSheet" obbs ON obbopn."obbSheetId" = obbs.id
    INNER JOIN "Operator" oprtr ON oprtr."rfid" = pd."operatorRfid"
    INNER JOIN "Operation" opn ON opn."id" = obbopn."operationId"
     INNER JOIN 
      "SewingMachine" sm ON sm.id = obbopn."sewingMachineId"
    WHERE pd.timestamp like ${date} and  obbs.id = ${obbsheetid}
    group by CONCAT(SUBSTRING(CONCAT(obbopn."seqNo", '-(', opn."code", ')', '-', oprtr.name) FROM 1 FOR 25), ' ', '(', sm."machineId", ')') ,obbopn.target, pd."productionCount",pd.timestamp
    order by  pd.timestamp ;`;

  //and (oprtr.name like 'AJUFA%' or oprtr.name like 'RATNA%')
            // INNER JOIN "Operation" opn ON opn.id= obbopn."operationId"

// group by oprtr.name,obbopn."seqNo",obbopn.target, pd."productionCount",pd.timestamp
    
    console.log("data",data,obbsheetid)
    return new Promise((resolve) => resolve(data  ))
    
}


export async function geOperatorList(obbsheetid:string,date:string ) : Promise<any[]>  {
    const sql = neon(process.env.DATABASE_URL || "");
 
    // const data = await sql`SELECT   concat(oo."seqNo",'-',o.name ) as name

    const data = await sql`
    SELECT 
      CONCAT(SUBSTRING(CONCAT(oopn."seqNo", '-(', opn."code", ')', '-', oo.name) FROM 1 FOR 25), ' ', '(', sm."machineId", ')') AS name
    FROM 
      "Operator" oo  
    INNER JOIN 
      "ProductionData" pd ON oo."rfid" = pd."operatorRfid"
    INNER JOIN 
      "ObbOperation" oopn ON pd."obbOperationId" = oopn."id"
    INNER JOIN 
      "ObbSheet" os ON oopn."obbSheetId" = os.id
    INNER JOIN 
      "Operation" opn ON opn."id" = oopn."operationId"
    INNER JOIN 
      "SewingMachine" sm ON sm.id = oopn."sewingMachineId"
    WHERE 
      os.id = ${obbsheetid}  
      AND pd.timestamp LIKE ${date}
    GROUP BY 
      CONCAT(SUBSTRING(CONCAT(oopn."seqNo", '-(', opn."code", ')', '-', oo.name) FROM 1 FOR 25), ' ', '(', sm."machineId", ')'), 
      oopn."seqNo"
    ORDER BY 
      oopn."seqNo";
  `;
  
    //order by  substring(concat(oopn."seqNo",'-',oo.name ) from 0 for 20) ;`
    // group by substring(concat(oopn."seqNo",'-(',opn."code",')-',oo.name ) from 0 for 25) , oopn."seqNo"

    console.log("geOperationList",data,)


 
    return new Promise((resolve) => resolve(data ))
}