"use server"

import { poolForRFID } from '@/lib/postgres';
import { neon } from '@neondatabase/serverless';

type ReturnDataType = {
    totalSMV: number;
    productionTarget: number;
    workingHours: number;
    targetWorkingHours: number;
    targetEfficiency: number;
    obbManPowers: number;
    utilizedManPowers: number;
}

export async function fetchLineEfficiencyResource(obbSheetId: string): Promise<ReturnDataType | null> {
    try {
      

        try {
  
            const query = `
             SELECT 
                "totalSMV", 
                "endQcTarget" as "productionTarget", 
                "workingHours", 
                "targetWorkingHours", 
                "targetEfficiency", 
                "obbManPowers",
                "utilizedManPowers"
            FROM 
                "LineEfficiencyResources"
            WHERE 
                "obbSheetId" = $1;
            `;
            const values = [obbSheetId];
        
            const result = await poolForRFID.query(query, values);
        
            // console.log("DATAaa: ", result.rows);
            return new Promise((resolve) => resolve(result.rows[0] as ReturnDataType));
            
            
          } catch (error) {
            console.error("[TEST_ERROR]", error);
            throw error;
          }

        
    } catch (error) {
        console.error("[FETCH_LINE_EFFICIENCY_RESOURCES_ERROR]", error);
        return null;
    }
}