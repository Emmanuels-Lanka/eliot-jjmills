"use server"

import { db } from "@/lib/db";

export async function fetchCurrentOperationsCount(obbSheetId: string): Promise<number> {
    try {
        const count = await db.obbOperation.count({
            where: {
                obbSheetId
            }
        });

        return count;
    } catch (error) {
        console.error("[FETCH_OPERATIONS_COUNT_ERROR]", error);
        return 0;
    }
}