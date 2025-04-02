"use server"

import { poolForRFID } from '@/lib/postgres';
import { neon } from '@neondatabase/serverless';
import moment from 'moment-timezone';

type ProductionDataType = {
    id: string;
    obbSheetId: string | null;
    createdAt: Date;
    timestamp: string;
    productId: string;
    qcStatus: string;
    qcPointId: string;
    obbOperationId: string | null;
    operatorId: string | null;
    operatorName: string | null;
    part: string;
}[];

export async function fetchPassProductionData(obbSheetId: string): Promise<ProductionDataType> {
    try {
      

        const today = moment().tz('Asia/Dhaka').format("YYYY-MM-DD");
        // console.log("TODAY: " + today);
        const dateKey = `${today}%`;

        try {
  
            const query = `
             SELECT *
            FROM 
                "ProductDefect"
            WHERE 
                timestamp like $2
                AND "obbSheetId" = $1
                AND "qcStatus" = 'pass'
                AND part = 'line-end'
            ORDER BY 
                "createdAt" ASC;
            `;
            const values = [obbSheetId,dateKey];
        
            const result = await poolForRFID.query(query, values);
        
            // console.log("DATAaa: ", result.rows);
            return new Promise((resolve) => resolve(result.rows as ProductionDataType));
            
            
          } catch (error) {
            console.error("[TEST_ERROR]", error);
            throw error;
          }

    } catch (error) {
        console.error("[FETCH_PASSED_PRODUCTION_DATA_ERROR]", error);
        return [];
    }
}