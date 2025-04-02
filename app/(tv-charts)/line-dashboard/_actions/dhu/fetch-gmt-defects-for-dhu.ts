"use server"

import { poolForRFID } from '@/lib/postgres';
import { neon } from '@neondatabase/serverless';
import moment from 'moment-timezone';

export async function fetchGmtDefectsForDHU(obbSheetId: string): Promise<DHUDefectsDataTypes> {
    try {
        
      
        const today = moment().tz('Asia/Dhaka').format("YYYY-MM-DD");
        const dateKey = `${today}%`;


        try {
  
            const query = `
             SELECT 
                gd.id,
                gd.timestamp,
                gd."gmtId" AS "itemId",
                gd."qcStatus",
                gd.part,
                gd."obbOperationId",
                gd."operatorId",
                gd."operatorName",
                ARRAY_AGG(d.name) AS defects
            FROM 
                "GmtDefect" gd
            LEFT JOIN 
                "_GmtQC" gdd ON gdd."B" = gd.id
            LEFT JOIN 
                "Defect" d ON d.id = gdd."A"
            WHERE 
                gd.timestamp like $2
                AND gd."obbSheetId" = $1
            GROUP BY 
                gd.id
            ORDER BY 
                gd."createdAt" ASC;
            `;
            const values = [obbSheetId,dateKey];
        
            const result = await poolForRFID.query(query, values);
        
            // console.log("DATAaa: ", result.rows);
            return new Promise((resolve) => resolve(result.rows as DHUDefectsDataTypes));
            
            
          } catch (error) {
            console.error("[TEST_ERROR]", error);
            throw error;
          }
    

        
    } catch (error) {
        console.error("[FETCH_GMT_DEFECTS_ERROR]", error);
        return [];
    }
}