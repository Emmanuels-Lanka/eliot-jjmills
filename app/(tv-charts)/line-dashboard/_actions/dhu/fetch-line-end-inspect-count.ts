"use server"

import { poolForRFID } from '@/lib/postgres';
import { neon } from '@neondatabase/serverless';
import moment from 'moment-timezone';

export async function fetchLineEndInspectCount(obbSheetId: string): Promise<number> {
    try {
    

        const today = moment().tz('Asia/Dhaka').format("YYYY-MM-DD");
        const dateKey = `${today}%`;

        try {
  
            const query = `
             SELECT 
                COUNT(*) AS count
            FROM 
                "ProductDefect"
            WHERE 
                timestamp like $2
                AND "obbSheetId" = $1
                AND part = 'line-end';
            `;
            const values = [obbSheetId,dateKey];
        
            const result = await poolForRFID.query(query, values);
        
            // console.log("DATAaa: ", result.rows);
            return new Promise((resolve) => resolve(result.rows[0].count as number));
            
            
          } catch (error) {
            console.error("[TEST_ERROR]", error);
            throw error;
          }
    
     
    } catch (error) {
        console.error("[FETCH_PRODUCT_DEFECTS_ERROR]", error);
        return 0;
    }
}