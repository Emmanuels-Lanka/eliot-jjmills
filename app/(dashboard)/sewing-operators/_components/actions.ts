"use server";
import { ReportData } from "../../analytics/daily-report/_components/daily-report";
import { learnCurveData } from "./curve-graph";
import { poolForPortal, poolForRFID } from "@/lib/postgres";

type defects= {
    count:number;
    operator:string;
    part:string
}
type defcount= {
    total:number;

}


export async function getEfficiency(date:string,obbSheet:string,operatorId:string) : Promise<learnCurveData[]>   {
   
    try {
  
        const query = `
       SELECT 
    DATE(pd."timestamp") AS day,  -- Group by each day for the learning curve
    oo."seqNo", 
    SUM(pd."productionCount") AS count, 
    o.name AS name, 
    opn.name AS operation, 
    oo.smv AS smv, 
    os.first_login AS first,
    MAX(pd."timestamp") AS last
FROM 
    "ProductionData" pd 
INNER JOIN 
    "Operator" o ON o.rfid = pd."operatorRfid"
INNER JOIN 
    "ObbOperation" oo ON oo.id = pd."obbOperationId"
INNER JOIN 
    "Operation" opn ON opn.id = oo."operationId"
LEFT JOIN (
    SELECT 
        "operatorRfid",
        DATE("LoginTimestamp") AS login_date,  -- Extract date part for daily grouping
        MIN("LoginTimestamp") AS first_login
    FROM "OperatorSession"
    WHERE DATE("LoginTimestamp") < CURRENT_DATE  -- Ensure type consistency with date
    GROUP BY "operatorRfid", DATE("LoginTimestamp")  -- Group by operator and date
) AS os ON os."operatorRfid" = o.rfid AND DATE(pd."timestamp") = os.login_date  -- Join on date
WHERE 
    DATE(pd."timestamp") < CURRENT_DATE  -- Ensure type consistency with date
    AND o.id = $1
GROUP BY 
    day, oo."seqNo", o.name, opn.name, oo.smv, os.first_login
ORDER BY 
    day, oo."seqNo"
        `;
        const values = [operatorId];
    
        const result = await poolForPortal.query(query,values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as learnCurveData[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
   
   
    
}


export async function getChecked(date:string,obbSheet:string) : Promise<defcount>   {
 
  

    try {
  
        const query = `
       WITH counts AS (
    SELECT COUNT(*) AS gmt_count FROM "GmtDefect" gd WHERE gd.timestamp LIKE ${date} 
    and "obbSheetId" = ${obbSheet}
    UNION ALL
    SELECT COUNT(*) AS product_count FROM "ProductDefect" pd WHERE pd.timestamp LIKE ${date}
    and "obbSheetId" = ${obbSheet}
)
SELECT SUM(gmt_count) AS total FROM counts;
        `;
        const values = [obbSheet];
    
        const result = await poolForRFID.query(query,values);
    
        // console.log("DATAaa: ", result.rows);
        const total = result.rows[0]?.total || 0;
    
        return { total } as defcount;
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
    
     

}
export async function getDefects(date:string,obbSheet:string,operatorId: string) : Promise<defects []>   {
   
    try {
  
        const query = `
       select count(*),"operatorName" as operator,part from "GmtDefect" gd
where timestamp like $1 and "obbSheetId" =$2 and 
"qcStatus" <> 'pass' and gd."operatorId" = $3
group by operator,part
union
select count(*),"operatorName" as operator,part  from "ProductDefect" pd
where "qcStatus" <> 'pass' and  timestamp like $1 and "obbSheetId" = $2
and pd."operatorId" = $3
group by operator,part
        `;
        const values = [date,obbSheet,operatorId];
    
        const result = await poolForPortal.query(query,values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows as defects[]));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }
    
}
