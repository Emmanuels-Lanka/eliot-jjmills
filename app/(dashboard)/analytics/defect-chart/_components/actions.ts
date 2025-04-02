"use server";
import { ProductionDataType } from "./analytics-chart";
import { defectData } from "./bar-chart-graph";
import { poolForPortal } from "@/lib/postgres";



export async function getOperatorEfficiency(obbsheetid:string,date:string) : Promise<defectData[]>   {
 


    const query = `
        SELECT
    pd."part",
    COUNT(DISTINCT pd."gmtId") AS garment_count
FROM 
    "GmtDefect" pd
LEFT JOIN  
    "_GmtQC" gdd ON gdd."B" = pd.id
LEFT JOIN
    "Defect" d ON d.id = gdd."A"
WHERE
    pd."qcStatus" <> 'pass'
    AND pd."obbSheetId" = $1
    AND pd."timestamp" LIKE $2
GROUP BY 
    pd."part"

UNION ALL

SELECT
    pd."part",
    COUNT(DISTINCT pd."productId") AS garment_count
FROM 
    "ProductDefect" pd
LEFT JOIN  
    "_GmtQC" gdd ON gdd."B" = pd.id
LEFT JOIN
    "Defect" d ON d.id = gdd."A"
WHERE
    pd."qcStatus" <> 'pass' 
    AND pd."obbSheetId" = $1
    AND pd."timestamp" LIKE $2
GROUP BY 
    pd."part";
      `;
      const values = [obbsheetid,date];
  
      const result = await poolForPortal.query(query, values);
    
    
            // console.log(data)
    
    
    return new Promise((resolve) => resolve(result.rows as defectData[] ))
}



export async function getObb(unit:any) : Promise<{ id: string; name: string }[]>  {
  

    try {
  
      const query = `
        SELECT os.name AS name, os.id AS id 
        FROM "ObbSheet" os
        INNER JOIN "Unit" u ON u.id = os."unitId"
        WHERE os."unitId" = $1 AND os."isActive"
        ORDER BY os."createdAt" DESC
      `;
      const values = [unit];
  
      const result = await poolForPortal.query(query, values);
  
      console.log("DATAaa: ", result.rows);
      return new Promise((resolve) => resolve(result.rows as { id: string; name: string }[]));
      
      
    } catch (error) {
      console.error("[TEST_ERROR]", error);
      throw error;
    }
    finally{
 
    }
  
  }
  