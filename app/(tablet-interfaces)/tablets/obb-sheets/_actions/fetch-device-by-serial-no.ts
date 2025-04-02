"use server"

import { db } from '@/lib/db';

type DeviceDetailsType = {
    id: string;
    serialNumber: string;
    modelNumber: string;
}

export async function fetchDeviceBySerialNo(serialNumber: string): Promise<DeviceDetailsType | null> {
    try {
        const data = await db.eliotDevice.findUnique({
            where: {
                serialNumber
            },
            select: {
                id: true,
                serialNumber: true,
                modelNumber: true
            }
        })

        return new Promise((resolve) => resolve(data as DeviceDetailsType | null));
    } catch (error) {
        console.error("[FETCH_DEVICE_DETAILS_ERROR]", error);
        return null;
    }
}