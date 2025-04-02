"use server"

import moment from 'moment-timezone';

import { db } from '@/lib/db';

export async function fetchDataForRoamingQC(obbSheetId: string, machineId: string): Promise<DataTypesForRoamingQC | null> {
    try {
        // console.log("Working 1");
        
        const timezone: string = process.env.NODE_ENV === 'development' ? 'Asia/Colombo' : 'Asia/Dhaka'
        const today = moment().tz(timezone).format('YYYY-MM-DD');
        const startDate = `${today} 00:00:00`;
        const endDate = `${today} 23:59:59`;

        const operatorSession = await db.operatorSession.findMany({
            where: {
                obbOperation: {
                    sewingMachine: {
                        machineId
                    }
                },
                LoginTimestamp: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                obbOperation: {
                    select: {
                        id: true,
                        operation: {
                            select: {
                                name: true,
                                code: true
                            }
                        },
                        obbSheet: {
                            select: {
                                style: true,
                                buyer: true
                            }
                        }
                    }
                },
                operator: {
                    select: {
                        name: true,
                        rfid: true
                    }
                }
            }
        })

        if (operatorSession.length === 0) {
            return null;
        }
        // console.log("Working 2");

        const formattedData = {
            style: operatorSession[0].obbOperation.obbSheet.style,
            buyerName: operatorSession[0].obbOperation.obbSheet.buyer,
            obbOperationId: operatorSession[0].obbOperation.id,
            operationName: operatorSession[0].obbOperation.operation.name,
            operationCode: operatorSession[0].obbOperation.operation.code,
            operatorName: operatorSession[0].operator.name,
            operatorRfid: operatorSession[0].operator.rfid,
        };

        // console.log("DATAA:", formattedData);

        return new Promise((resolve) => resolve(formattedData as DataTypesForRoamingQC));
    } catch (error) {
        console.error("[FETCH_GMT_DEFECTS_ERROR]", error);
        return null;
    }
}