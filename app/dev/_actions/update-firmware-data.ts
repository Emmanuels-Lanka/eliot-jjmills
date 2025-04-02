"use server";

import { db } from "@/lib/db";

export async function updateFirmwareData(data: { eliotSerialNo: string[], firmwareUrl: string }) {
    try {
        for (const eliotSerial of data.eliotSerialNo) {
            // const count = await db.eliotFirmwareUpdate.count({
            //     where: { eliotSerialNo: eliotSerial }
            // });

            // if (count === 0) {
            //     await db.eliotFirmwareUpdate.create({
            //         data: {
            //             eliotSerialNo: eliotSerial,
            //             firmwareUrl: data.firmwareUrl
            //         }
            //     });
            // } else {
            //     await db.eliotFirmwareUpdate.update({
            //         where: { eliotSerialNo: eliotSerial },
            //         data: { 
            //             firmwareUrl: data.firmwareUrl,
            //             status: "pending"
            //         }
            //     });
            // }

            await db.eliotFirmwareUpdate.upsert({
                where: { eliotSerialNo: eliotSerial },
                update: { 
                    firmwareUrl: data.firmwareUrl,
                    status: "pending"
                },
                create: {
                    eliotSerialNo: eliotSerial,
                    firmwareUrl: data.firmwareUrl,
                    status: "pending"
                },
            })
        };

        return "done";
    } catch (error) {
        console.error("[UPDATE_FIRMWARE_DATA_ERROR]", error);
        return null;
    }
}