"use server";

import { db } from "@/lib/db";

export async function pendingToCancelledStatus() {
    try {
        // const firmwares = await db.eliotFirmwareUpdate.findMany({
        //     where: {
        //         status: "pending",
        //     }
        // });

        // if (!firmwares.length) return null;

        const res = await db.eliotFirmwareUpdate.updateMany({
            where: {
                status: "pending",
            },
            data: {
                status: "cancelled",
            },
        });

        // for (const firmware of firmwares) {
        //     await db.eliotFirmwareUpdate.update({
        //         where: { id: firmware.id },
        //         data: { status: "cancelled" },
        //     });
        // }

        return res;
    } catch (error) {
        console.error("[STATUS_PENDING_TO_CANCELLED_ERROR]", error);
        return null;
    }
}