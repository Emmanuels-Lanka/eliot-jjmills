import { NextResponse } from "next/server";
import DATA from "./pro-data-9.json";

import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        // const results = await Promise.all(DATA.map(async (data) => {
        //     // const count = await db.productionData.count({
        //     //     where: {
        //     //         id: data.id,
        //     //         eliotSerialNumber: null,
        //     //     }
        //     // });

        //     // if (count === 0) {
        //     // }
        //     const res = await db.productionData.create({
        //         data: {
        //             ...data,
        //         },
        //     });
        //     return res;
        // }));
        // console.log("COUNT:", results.length);

        return NextResponse.json("results.length", { status: 201 });
    } catch (error) {
        console.error("[UPDATE_DATA_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}