"use server"

import { db } from '@/lib/db';

type MachineWithDeviceDataType = {
    id: string;
    machineId: string;
    modelNumber: string;
    brandName: string;
    eliotDevice: {
        id: string;
        serialNumber: string;
        modelNumber: string;
    } | null;
}

export async function fetchMachineDataByMachineId(machineId: string): Promise<MachineWithDeviceDataType | null> {
    try {
        const data = await db.sewingMachine.findUnique({
            where: {
                machineId
            },
            select: {
                id: true,
                machineId: true,
                modelNumber: true,
                brandName: true,
                eliotDevice: {
                    select: {
                        id: true,
                        serialNumber: true,
                        modelNumber: true,
                    }
                }
            }
        })

        return new Promise((resolve) => resolve(data as MachineWithDeviceDataType | null));
    } catch (error) {
        console.error("[FETCH_MACHINE_DATA_ERROR]", error);
        return null;
    }
}