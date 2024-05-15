import { NextResponse } from "next/server";
import moment from 'moment';
import { Operator, TrafficLightSystem } from "@prisma/client";

import { db } from "@/lib/db";

interface OperatorSession {
    operatorRfid: string;
    operator: Operator;
}

interface ObbOperationData {
    operatorSessions: OperatorSession[];
}

export async function GET(
    req: Request
) {
    const url = new URL(req.url);
    const machineId = url.searchParams.get('machineId');
    
    if (!machineId) {
        return new NextResponse("Missing required parameters: machineId", { status: 409 })
    }

    const date = new Date;          // Today date-time
    const formattedDate = moment(date).format('YYYY-MM-DD')
    
    const startDate = `${formattedDate} 00:00:00`; // Start of the day
    const endDate = `${formattedDate} 23:59:59`; // End of the day

    let obbOperationId: string = '';
    let operators: OperatorSession[] = []

    try {
        // Get the TLS for today
        const tls: TrafficLightSystem[] = await db.trafficLightSystem.findMany({
            where: {
                machineId,
                timestamp: {
                    gte: startDate,
                    lte: endDate
                }
            }, 
            orderBy: {
                createdAt: "desc",
            },
        });

        // Get the ObbOperationId using the machineId
        const machine: MachineDataWithObbOperation | null = await db.sewingMachine.findUnique({
            where: {
                id: machineId
            },
            select: {
                obbOperation: {
                    select: {
                        id: true,
                        target: true,
                    }
                }
            }
        });
        
        if (machine?.obbOperation?.id) {
            // Assign the id to ObbOperationId
            obbOperationId = machine?.obbOperation?.id

            const obbOperation: ObbOperationData | null = await db.obbOperation.findUnique({
                where: {
                    id: obbOperationId
                },
                select: {
                    operatorSessions: {
                        where: {
                            isLoggedIn: true,
                            LoginTimestamp: {
                                gte: startDate,
                                lte: endDate
                            }
                        },
                        select: {
                            operatorRfid: true,
                            operator: true
                        }
                    }
                }
            });
            
            if (obbOperation?.operatorSessions) {
                operators = obbOperation?.operatorSessions;
            }
        }

        return NextResponse.json({ 
            tls: tls, 
            obbOperationId, 
            operators,
            message: 'Details fetched successfully'
        }, { status: 201 });

    } catch (error) {
        console.error("[FETCH_TLS_RECORDS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}