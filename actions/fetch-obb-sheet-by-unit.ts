"use server"

import { db } from '@/lib/db';

type ObbSheetDataType = {
    id: string;
    name: string;
}

export async function fetchObbSheetByUnit(unitId: string): Promise<ObbSheetDataType[]> {
    try {
        const data = await db.obbSheet.findMany({
            where: {
                unitId
            },
            select: {
                id: true,
                name: true,
            }
        });

        return new Promise((resolve) => resolve(data as ObbSheetDataType[]));
    } catch (error) {
        console.error("[FETCH_GMT_DEFECTS_ERROR]", error);
        return [];
    }
}