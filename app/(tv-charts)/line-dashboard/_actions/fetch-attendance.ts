"use server"

import moment from "moment-timezone";

import { db } from "@/lib/db";

export async function fetchAttendance(obbSheetId: string): Promise<number> {
    try {
        const today = moment().format('YYYY-MM-DD');
        const startDate = `${today} 00:00:00`;
        const endDate = `${today} 23:59:59`;

        const data = await db.operatorSession.count({
            where: {
                obbOperation: {
                    obbSheetId
                },
                LoginTimestamp: {
                    gte: startDate,
                    lte: endDate
                },
                LogoutTimestamp: null,   // only count the active operators
            }
        });
        // console.log("COUNT", data);

        return new Promise((resolve) => resolve(data as number));
    } catch (error) {
        console.error("[FETCH_ACTIVE_OBB_OPERATIONS_ERROR]", error);
        return 0;
    }
}