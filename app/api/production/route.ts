import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const date = url.searchParams.get("date");

    if (!date) {
        return new NextResponse("Missing required parameter: date", { status: 400 });
    }

    const startDate = `${date} 00:00:00`;
    const endDate = `${date} 23:59:59`;

    try {
        const ProdData = await db.productionData.findMany({
          where: {
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            obbOperation: {
              select: {
                id: true,
                seqNo: true,
                target: true,
                operation:{
                    select:{
                        name:true
                    }
                },
                obbSheet:{
                    select:{
                        id:true,
                        name:true,
                        buyer:true,
                        style:true,
                        totalSMV:true,
                        target100:true
                    }
                }
              },
            },
          },
        });
        return NextResponse.json({ data: ProdData, message: 'Production data fetched successfully' }, { status: 201 });
    } catch (error) {
        return new NextResponse("Error fetching production data", { status: 500 });
    }
}