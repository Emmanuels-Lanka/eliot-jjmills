"use server"

import { poolForRFID } from '@/lib/postgres';
import { neon } from '@neondatabase/serverless';
import moment from 'moment-timezone';

export async function fetchProductDefectsForDHU(obbSheetId: string): Promise<DHUDefectsDataTypes> {
    try {
       

        const today = moment().tz('Asia/Dhaka').format("YYYY-MM-DD");
        const dateKey = `${today}%`;

        try {
  
            const query = `
             SELECT 
                pd.id,
                pd.timestamp,
                pd."productId" AS "itemId",
                pd."qcStatus",
                pd.part,
                pd."obbOperationId",
                pd."operatorId",
                pd."operatorName",
                ARRAY_AGG(d.name) AS defects
            FROM 
                "ProductDefect" pd
            LEFT JOIN 
                "_ProductQC" pdq ON pdq."B" = pd.id
            LEFT JOIN 
                "Defect" d ON d.id = pdq."A"
            WHERE 
                pd.timestamp like $2
                AND pd."obbSheetId" = $1
                AND pd.part IN ('assembly', 'line-end')
            GROUP BY 
                pd.id
            ORDER BY 
                pd."createdAt" ASC;
            `;
            const values = [obbSheetId,dateKey];
        
            const result = await poolForRFID.query(query, values);
        
            // console.log("DATAaa: ", result.rows);
            return new Promise((resolve) => resolve(result.rows as any[]));
            
            
          } catch (error) {
            console.error("[TEST_ERROR]", error);
            throw error;
          }
    

       
    } catch (error) {
        console.error("[FETCH_PRODUCT_DEFECTS_ERROR]", error);
        return [];
    }
}