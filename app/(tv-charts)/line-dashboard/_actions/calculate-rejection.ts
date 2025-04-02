"use server";

import moment from 'moment-timezone';
import { poolForRFID } from '@/lib/postgres';

export async function calculateRejection(obbSheetId: string): Promise<number> {

    const today = moment().tz('Asia/Dhaka').format("YYYY-MM-DD");
    const dateKey = `${today}%`;

    try {
  
        const query = `
         SELECT *
            FROM 
                "ProductDefect" pd
            WHERE 
                pd."obbSheetId" = $1
                AND pd."qcStatus" = 'reject'
                AND pd.part = 'line-end'
                AND pd.timestamp like $2;
        `;
        const values = [obbSheetId,dateKey];
    
        const result = await poolForRFID.query(query, values);
    
        // console.log("DATAaa: ", result.rows);
        return new Promise((resolve) => resolve(result.rows.length));
        
        
      } catch (error) {
        console.error("[TEST_ERROR]", error);
        throw error;
      }

    // try {
    //     const data = await sql `
    //         SELECT *
    //         FROM 
    //             "ProductDefect" pd
    //         WHERE 
    //             pd."obbSheetId" = ${obbSheetId}
    //             AND pd."qcStatus" = 'reject'
    //             AND pd.part = 'line-end'
    //             AND pd.timestamp like ${dateKey};`;
        
    //     return new Promise((resolve) => resolve(data.length));
    // } catch (error) {
    //     console.error("CALCULATE_REJECTION_COUNT", error);
    //     return 0;
    // }
}