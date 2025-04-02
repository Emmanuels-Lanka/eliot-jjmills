"use server"

import { db } from '@/lib/db';

type EliotDeviceData = {
    id: string;
    modelNumber: string;
    serialNumber: string;
};

export async function fetchEliotDeviceForMachine(machineId: string): Promise<EliotDeviceData | null> {
    try {
        const data = await db.sewingMachine.findUnique({
            where: {
                id: machineId
            },
            select: {
                eliotDevice: true
            }
        });

        const formattedData = data?.eliotDevice ? {
            id: data.eliotDevice.id,
            modelNumber: data.eliotDevice.modelNumber,
            serialNumber: data.eliotDevice.serialNumber,
        } : null;

        return new Promise((resolve) => resolve(formattedData as EliotDeviceData | null));
    } catch (error) {
        console.error("[FETCH_ELIOT_DEVICE_ERROR]", error);
        return null;
    }
}