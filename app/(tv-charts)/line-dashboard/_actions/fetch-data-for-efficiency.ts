"use server";

import moment from 'moment-timezone';
// import { neon } from "@neondatabase/serverless";
import { poolForPortal, poolForRFID } from '@/lib/postgres';

// // const sqlEliot = neon(process.env.DATABASE_URL || "");
// const sqlRfid = neon(process.env.RFID_DATABASE_URL || "");
const today = moment().tz('Asia/Dhaka').format("YYYY-MM-DD");
const dateKey = `${today}%`;

export async function fetchFactoryStartTime(obbSheetId: string): Promise<any[]> {
    try {

        const query = `
        SELECT 
    os.id, 
    os."factoryStartTime" AS start 
FROM 
    "ProductionData" pd 
    INNER JOIN "ObbOperation" oo ON oo.id = pd."obbOperationId" 
    INNER JOIN "ObbSheet" os ON os.id = oo."obbSheetId" 
WHERE 
    pd.timestamp LIKE $1
    AND oo."obbSheetId" = $2;
       `;
       const values = [dateKey,obbSheetId];
   
       const result = await poolForPortal.query(query, values);



        // const data = await sqlEliot `
        //     select 
        //         os.id, 
        //         "factoryStartTime" start 
        //     from 
        //         "ProductionData" pd 
        //         inner join "ObbOperation" oo on oo.id = pd."obbOperationId" 
        //         inner join "ObbSheet" os on os.id = oo."obbSheetId" 
        //     where 
        //         pd.timestamp like ${dateKey} 
        //         and oo."obbSheetId" = ${obbSheetId} 
        //     group by 
        //         os.id, 
        //         start;`;

        return new Promise((resolve) => resolve(result.rows));
    } catch (error) {
        console.error("FETCH_FACTORY_START_TIME_DATA", error);
        return [];
    }
}

export async function fetchProductionData(obbSheetId: string): Promise<any[]> {
    
    try {


         const query = `
                     select 
                count(pd."productId"), 
                ler."totalSMV", 
                "obbManPowers", 
                ler."obbSheetId" obbSheetId 
            from 
                "ProductDefect" pd 
                inner join "LineEfficiencyResources" ler on ler."obbSheetId" = pd."obbSheetId" 
            where 
                timestamp like $1
                and pd."qcStatus" = 'pass' 
                and pd."obbSheetId" = $2
                and pd."part" = 'line-end' 
            group by 
                ler."totalSMV", 
                "obbManPowers", 
                ler."obbSheetId";;
                    `;
                    const values = [dateKey,obbSheetId];
                
                    const result = await poolForRFID.query(query, values);
                
        // const data = await sqlRfid `
        //     select 
        //         count(pd."productId"), 
        //         ler."totalSMV", 
        //         "obbManPowers", 
        //         ler."obbSheetId" obbSheetId 
        //     from 
        //         "ProductDefect" pd 
        //         inner join "LineEfficiencyResources" ler on ler."obbSheetId" = pd."obbSheetId" 
        //     where 
        //         timestamp like ${dateKey} 
        //         and pd."qcStatus" = 'pass' 
        //         and pd."obbSheetId" = ${obbSheetId} 
        //         and pd."part" = 'line-end' 
        //     group by 
        //         ler."totalSMV", 
        //         "obbManPowers", 
        //         ler."obbSheetId";`;

        return new Promise((resolve) => resolve(result.rows));
    } catch (error) {
        console.error("FETCH_PRODUCTION_DATA", error);
        return [];
    }
}

export async function fetchProductionCount(obbSheetId: string): Promise<number> {
    try {


        
        const query = `
        SELECT 
                COUNT(*) AS count
            FROM 
                "ProductDefect"
            WHERE 
                "obbSheetId" = $2
                AND "part" = 'line-end'
                AND "qcStatus" = 'pass'
                AND "timestamp" like $1;
       `;
       const values = [dateKey,obbSheetId];
   
       const result = await poolForRFID.query(query, values);



        // const data = await sqlRfid `
        //     SELECT 
        //         COUNT(*) AS count
        //     FROM 
        //         "ProductDefect"
        //     WHERE 
        //         "obbSheetId" = ${obbSheetId}
        //         AND "part" = 'line-end'
        //         AND "qcStatus" = 'pass'
        //         AND "timestamp" like ${dateKey};`;

        // console.log(data);

        return new Promise((resolve) => resolve(result.rows[0].count));
    } catch (error) {
        console.error("FETCH_PRODUCTION_DATA", error);
        return 0;
    }
}