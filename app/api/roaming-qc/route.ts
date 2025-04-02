import { NextResponse } from "next/server";
import moment from 'moment-timezone';

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function GET(
    req: Request
) {
    const url = new URL(req.url);
    const obbSheetId = url.searchParams.get('obbSheetId');
    const date = url.searchParams.get('date');

    if (!obbSheetId || !date) {
        return new NextResponse("Missing required parameters: obbSheetId or date", { status: 409 })
    }

    const startDate = `${date} 00:00:00`; // Start of the day
    const endDate = `${date} 23:59:59`; // End of the day

    try {
        const roamingQC = await db.roamingQC.findMany({
            where: {
                obbOperation: {
                    obbSheetId
                },
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            },
            include: {
                operator: {
                    select: {
                        name: true,
                        employeeId: true,
                        rfid: true
                    }
                },
                obbOperation: {
                    select: {
                        id: true,
                        seqNo: true,
                        operation: {
                            select: {
                                name: true,
                                code: true,
                            }
                        }
                    }
                },
                sewingMachine: {
                    select: {
                        id: true,
                        brandName: true,
                        machineType: true,
                        machineId: true,
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json({ data: roamingQC, message: 'Roaming QC data fetched successfully'}, { status: 201 });
    } catch (error) {
        console.error("[FETCH_ROAMING_QC_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(
    req: Request,
) {
    try {
        const { machineId, unit, lineId, operatorRfid, obbOperationId, defects, inspectedQty, colorStatus } = await req.json();
        
        let id = generateUniqueId();

        const timezone: string = process.env.NODE_ENV === 'development' ? 'Asia/Colombo' : 'Asia/Dhaka'
        const formattedDate = moment().tz(timezone).format('YYYY-MM-DD HH:mm:ss');
        
        const hour = moment(formattedDate, 'YYYY-MM-DD HH:mm:ss').hour();
        const start = moment(formattedDate, 'YYYY-MM-DD HH:mm:ss').startOf('hour').format('YYYY-MM-DD HH:mm:ss');
        const end = moment(formattedDate, 'YYYY-MM-DD HH:mm:ss').endOf('hour').format('YYYY-MM-DD HH:mm:ss');

        const existingRecord = await db.roamingQC.findMany({
            where: {
                obbOperationId,
                machineId,
                timestamp: {
                    gte: start,
                    lte: end
                }
            }
        });

        if (existingRecord.length > 0) {
            return new NextResponse("Already updated the roaming QC for this hour", { status: 409 });
        }

        const newTLSRecord = await db.roamingQC.create({
            data: {
                id,
                machineId,
                unit,
                lineId,
                operatorRfid,
                obbOperationId,
                defects,
                inspectedQty,
                colorStatus,
                timestamp: formattedDate,
            }
        })

        return NextResponse.json({ data: newTLSRecord, message: 'Roaming QC recorded successfully' }, { status: 201 });

    } catch (error) {
        console.error("[ROAMING_QC_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}