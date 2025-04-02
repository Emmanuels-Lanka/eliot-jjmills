import { NextResponse } from "next/server";

import { createPostgresClient } from "@/lib/postgres";


export async function POST(req: Request) {
    const client = createPostgresClient();

    try {
        await client.connect();

        // const result = await client.query(
        //     `
        //     SELECT DISTINCT "size"
        //     FROM "GmtData"
        //     WHERE "color" = $1
        //       AND "styleNo" = $2
        //       AND "timestampProduction" IS NOT NULL;
        //     `,
        //     [color, style]
        // );

        // const result = await client.query(`
        //     INSERT INTO "TestTable" (text) VALUES ('Abhimanyu');
        // `);
        // console.log("INSERT LOG: ", result);

        const result = await client.query(`
            SELECT * FROM "TestTable";
        `);
        console.log("DATA: ", result.rows);

        return NextResponse.json({data: result.rows, message:"Successfully stored!" }, { status: 201 });
    } catch (error) {
        console.error("[TEST_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    } finally {
        await client.end();
    }
}