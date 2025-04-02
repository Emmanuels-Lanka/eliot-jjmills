"use server";
import { ReportData1 } from "./dhu-report";
import {  poolForPortal, poolForRFID } from "@/lib/postgres";

export async function getDHUData(obbsheetid: string, date: string): Promise<any> {
 

    try {
       

        // Query for "GmtDefect" data
        const queryGmtDefects = `
            SELECT 
                COUNT(*) AS count, 
                "qcStatus" AS qc, 
                "operatorName" AS name, 
                "operatorId" AS operatorid 
            FROM "GmtDefect"
            WHERE "qcStatus" <> 'pass' AND "obbSheetId" = $1 AND timestamp LIKE $2
            GROUP BY "operatorName", "qcStatus", "operatorId";
        `;
        const dataGmts = await poolForRFID.query(queryGmtDefects, [obbsheetid, date]);

        // Query for "ProductDefect" data
        const queryProductDefects = `
            SELECT 
                COUNT(*) AS count, 
                "qcStatus" AS qc, 
                "operatorName" AS name 
            FROM "ProductDefect"
            WHERE "qcStatus" <> 'pass' AND "obbSheetId" = $1 AND timestamp LIKE $2
            GROUP BY "operatorName", "qcStatus";
        `;
        const dataProducts = await poolForRFID.query(queryProductDefects, [obbsheetid, date]);

        // Query for total counts in "GmtDefect"
        const queryTotalGmtDefects = `
            SELECT COUNT(*) AS count 
            FROM "GmtDefect"
            WHERE "obbSheetId" = $1 AND timestamp LIKE $2;
        `;
        const tc = await poolForRFID.query(queryTotalGmtDefects, [obbsheetid, date]);

        // Query for total counts in "ProductDefect"
        const queryTotalProductDefects = `
            SELECT COUNT(*) AS count 
            FROM "ProductDefect"
            WHERE "obbSheetId" = $1 AND timestamp LIKE $2;
        `;
        const tcProducts = await poolForRFID.query(queryTotalProductDefects, [obbsheetid, date]);

        // Consolidating the data for the final output
        const count: number = Number(tc.rows[0]?.count) || 1;
        const countP: number = Number(tcProducts.rows[0]?.count) || 1;

        const updatedGmtDfcts: any[] = [];

        for (const gmtdfct of dataGmts.rows) {
            const tmpIndex = dataProducts.rows.findIndex((p: any) => p.name === gmtdfct.name);

            if (tmpIndex !== -1) {
                const tmp = dataProducts.rows[tmpIndex];
                updatedGmtDfcts.push({ ...gmtdfct, count: tmp.count + gmtdfct.count });
                dataProducts.rows.splice(tmpIndex, 1);
            } else {
                updatedGmtDfcts.push(gmtdfct);
            }
        }

        for (const prdDfct of dataProducts.rows) {
            updatedGmtDfcts.push(prdDfct);
        }

        const res = updatedGmtDfcts.map(d => ({
            ...d,
            count: (d.count / (count + countP)) * 100,
        }));

        return res;
    } catch (error) {
        console.error("[ERROR_FETCHING_DEFECT_DATA]", error);
        throw error;
    } finally {
    
    }
}

export async function getDailyData(obbsheetid: string, date: string): Promise<ReportData1[]> {

    {

      try {
    
     
        const query = `
          SELECT opr.id, opr.name as operatorname,
               opr.id as operatorid,
               op.name as operationname,
               obbop.target,
               unt.name as unitname,
               obbs.style as style,
               sm."machineId" as machineid,
               pl.name as linename,
               COUNT(pd."operatorRfid") as inspect,
               obbop."seqNo",
               opr."employeeId"
        FROM "ProductionData" pd
        INNER JOIN "Operator" opr ON pd."operatorRfid" = opr.rfid 
        INNER JOIN "ObbOperation" obbop ON pd."obbOperationId" = obbop.id
        INNER JOIN "ObbSheet" obbs ON obbop."obbSheetId" = obbs.id
        INNER JOIN "Operation" op ON obbop."operationId" = op.id
        INNER JOIN "Unit" unt ON obbs."unitId" = unt.id
        INNER JOIN "SewingMachine" sm ON obbop."sewingMachineId" = sm.id
        INNER JOIN "ProductionLine" pl ON pl.id = obbs."productionLineId"
        WHERE pd."timestamp" LIKE $2 AND obbs.id = $1
        GROUP BY opr.id, opr.name, op.name, obbop.smv, obbop.target, unt.name, obbs.style, sm.id, pl.name, obbs.buyer, obbop."seqNo",opr."employeeId"
        ORDER BY obbop."seqNo" ASC;
        `;
        const values = [obbsheetid,date];
    
        const result = await poolForPortal.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows  as ReportData1[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{

      }}


}

export async function getDefects(obbsheetid: string, date: string): Promise<any[]> {
    const newdate = `${date}%`;



    {
   
      try {
    
      
        const query = `
          SELECT 
            COUNT(pd.id) as defectcount,
            pd."operatorId" as operatorid
        FROM "ProductDefect" pd
        LEFT JOIN "_ProductQC" pqc ON pqc."B" = pd.id
        LEFT JOIN "Defect" d ON d.id = pqc."A"
        WHERE pd."qcStatus" <> 'pass' 
            AND pd."obbSheetId" = $1
            AND pd.timestamp LIKE $2
        GROUP BY d.name, pd."operatorId"

        UNION

        SELECT 
            COUNT(gd.id) as defectcount,
            gd."operatorId" as operatorid
        FROM "GmtDefect" gd
        LEFT JOIN "_GmtQC" gqc ON gqc."B" = gd.id
        LEFT JOIN "Defect" d ON d.id = gqc."A"
        WHERE gd."qcStatus" <> 'pass' 
            AND gd."obbSheetId" = $1
            AND gd.timestamp LIKE $2
        GROUP BY d.name, gd."operatorId"
        `;
        const values = [obbsheetid,newdate];
    
        const result = await poolForRFID.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as any[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{
   
      }}

   
}


export async function inspaetfetch(obbsheetid: string, date: string): Promise<any[]> {

    {
       
      try {
    
       
        const query = `
        SELECT 
          count(*) as inspectcount
          from
          "ProductDefect"
          where timestamp like $2 and "obbSheetId"=$1

        UNION

      SELECT 
          count(*) as inspectcount
          from
          "GmtDefect"
          where timestamp like $2 and "obbSheetId"=$1
        `;
        const values = [obbsheetid,date+"%"];
    
        const result = await poolForRFID.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as any[] ));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
      finally{
      
      }}

}


