"use server"

import moment from 'moment-timezone';
import { RoamingQC } from '@prisma/client';

import { db } from '@/lib/db';

export async function fetchRoamingQcData(machineId: string): Promise<RoamingQC[]> {
    try {
        const timezone: string = process.env.NODE_ENV === 'development' ? 'Asia/Colombo' : 'Asia/Dhaka'
        const today = moment().tz(timezone).format('YYYY-MM-DD');
        const startDate = `${today} 00:00:00`;
        const endDate = `${today} 23:59:59`;

        const data = await db.roamingQC.findMany({
            where: {
                machineId,
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return new Promise((resolve) => resolve(data as RoamingQC[]));
    } catch (error) {
        console.error("[FETCH_GMT_DEFECTS_ERROR]", error);
        return [];
    }
}