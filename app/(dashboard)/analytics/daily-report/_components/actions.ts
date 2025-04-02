

"use server";

import { db } from "@/lib/db";
import { ReportData } from "./daily-report";
import { poolForPortal } from "@/lib/postgres";
import { NextResponse } from "next/server";



export async function getDailyData(obbsheetid:string,date:string)  : Promise<ReportData[]>   {
    
    {
        
    date=date+"%"

      try {
    
    
        const query = `
 SELECT 
    opr.id,
    obbop."seqNo",
    opr.name AS operatorname,
    op.name AS operationname,
    SUM(pd."productionCount") AS count,
    obbop.smv AS smv,
    obbop.target,
    unt.name AS unitname,
    obbs.style AS style,
    sm."machineId" AS machineid,
    pl.name AS linename,
    obbs.buyer,
    opr."employeeId",
    opr."rfid",
    os.first_login AS first,  -- Earliest timestamp from subquery
    MAX(pd."timestamp") AS last  -- Latest timestamp in the group
FROM "ProductionData" pd
INNER JOIN "Operator" opr ON pd."operatorRfid" = opr.rfid 
INNER JOIN "ObbOperation" obbop ON pd."obbOperationId" = obbop.id
INNER JOIN "ObbSheet" obbs ON obbop."obbSheetId" = obbs.id
INNER JOIN "Operation" op ON obbop."operationId" = op.id
INNER JOIN "Unit" unt ON obbs."unitId" = unt.id
INNER JOIN "SewingMachine" sm ON obbop."sewingMachineId" = sm.id
INNER JOIN "ProductionLine" pl ON pl.id = obbs."productionLineId"
-- Subquery to get the earliest LoginTimestamp for each operator on the selected date
LEFT JOIN (
    SELECT 
        "operatorRfid",
        MIN("LoginTimestamp") AS first_login
    FROM "OperatorSession"
    WHERE "LoginTimestamp" LIKE $2
    GROUP BY "operatorRfid"
) AS os ON os."operatorRfid" = opr.rfid
WHERE pd."timestamp" LIKE $2 
    AND obbs.id = $1
GROUP BY 
    opr.id, 
    opr.name, 
    op.name, 
    obbop."seqNo", 
    obbop.smv, 
    obbop.target, 
    unt.name, 
    obbs.style, 
    sm.id, 
    pl.name, 
    obbs.buyer, 
    opr."employeeId", 
    opr."rfid",
    os.first_login
ORDER BY obbop."seqNo";
        `;
        const values = [obbsheetid,date];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as ReportData[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{
      
      }}



}


export const getLatestRecordsPerOperator = async (obbSheetId: string, date: string) => {
  const startDate = `${date} 00:00:00`;
  const endDate = `${date} 23:59:59`;

  try {
    // Step 1: Get latest timestamp per operator
    const latestTimestamps = await db.productionEfficiency.groupBy({
      by: ["operatorRfid"],
      _max: {
        timestamp: true, // Get the max timestamp for each operator
      },
      where: {
        obbOperation: {
          obbSheetId: obbSheetId,
        },
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Step 2: Get full records matching latest timestamps
    const latestRecords = await db.productionEfficiency.findMany({
      where: {
        OR: latestTimestamps.map((record) => ({
          operatorRfid: record.operatorRfid,
          timestamp: record._max.timestamp!,
        })),
      },
      orderBy: {
        timestamp: "desc",
      },
    });

    return { data: latestRecords, message: "Fetched last record of each operator" };
  } catch (error) {
    console.error("[PRODUCTION_EFFICIENCY_ERROR]", error);
    return { error: "Internal Error" };
  }
};

