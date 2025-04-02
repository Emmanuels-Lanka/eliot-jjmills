"use server";

import { poolForRFID } from "@/lib/postgres";


export async function calculateWIP(obbSheetId: string): Promise<number> {
    

    try {
        // const frontCount = await sql `
        //     SELECT 
        //         COUNT(*) AS count
        //     FROM 
        //         "GmtData"
        //     WHERE 
        //         "partName" = 'FRONT'
        //         AND "obbSheetId" = ${obbSheetId}
        //         AND "timestampProduction" IS NOT NULL;`

        const fc = `
            SELECT 
                COUNT(*) AS count
            FROM 
                "GmtData"
            WHERE 
                "partName" = 'FRONT'
                AND "obbSheetId" = $1
                AND "timestampProduction" IS NOT NULL;`
        
                const values = [obbSheetId];
                    const result = await poolForRFID.query(fc,values);
                const frontCount = result.rows


        // const lineEndCount = await sql `
        //     SELECT 
        //         COUNT(*) AS count
        //     FROM 
        //         "ProductDefect"
        //     WHERE 
        //         "part" = 'line-end'
        //         AND "qcStatus" = 'pass'
        //         AND "obbSheetId" = $1;`
                
                const lec =`
            SELECT 
                COUNT(*) AS count
            FROM 
                "ProductDefect"
            WHERE 
                "part" = 'line-end'
                AND "qcStatus" = 'pass'
                AND "obbSheetId" = $1;`

                const values1 = [obbSheetId];
                const result1 = await poolForRFID.query(lec,values1);
            const lineEndCount = result1.rows    

        const wip = frontCount[0].count - lineEndCount[0].count;

        return new Promise((resolve) => resolve(wip));
    } catch (error) {
        console.error("CALCULATE_REJECTION_COUNT", error);
        return 0;
    }
}