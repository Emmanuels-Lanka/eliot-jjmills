import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";
import { sendSmsAlert } from "@/actions/send-sms-alert";
import sendEmailAlert from "@/actions/send-email-alert";

export async function POST(
    req: Request,
) {
    try {
        const { verifiedKey, machineId, operatorRfid, employeeId, alertType, timestamp } = await req.json();

        let id = generateUniqueId();
        // const timestamp = new Date();
        const authorizedKey = process.env.AUTHORIZED_IOT_KEY;

        if (authorizedKey !== verifiedKey) {
            return new NextResponse("Unauthorized!", { status: 401 })
        }

        // Fetch employee data
        const recipient = await db.staff.findUnique({
            where: {
                employeeId
            }
        });

        // Fetch machine data
        const machine = await db.sewingMachine.findUnique({
            where: {
                machineId
            }
        });

        const operator = await db.operator.findUnique({
            where: {
                rfid: operatorRfid
            }
        });
        
        if (recipient && machine && operator) {
            let recipientEmail:string[] = [];
            recipientEmail.push(recipient?.email);

            const message: string = `Hello ${recipient.name} 👋, We received a ${alertType} request from ${operator.name} regarding the following machine. Machine ID: ${machine.machineId}, Machine Type: ${machine.machineType}, Brand Name: ${machine.brandName}, Serial Number: ${machine.serialNumber}`

            const smsResponse = await sendSmsAlert({
                message,
                recipient: recipient?.phone
            });

            const emailResponse = await sendEmailAlert({
                to: recipientEmail,
                recipient,
                machine,
                operator,
                alertType
            });
            
            if (smsResponse.status === 200 && emailResponse.status === 200) {
                try {
                    const alertLog = await db.alertLog.create({
                        data: {
                            id,
                            machineId,
                            operatorRfid,
                            employeeId,
                            alertType,
                            smsStatus: 'SENT',
                            emailStatus: 'SENT',
                            timestamp
                        }
                    });
                    return NextResponse.json({ data: alertLog, message: 'SMS & Email alert sent successfully'}, { status: 201 });
                } catch (error) {
                    console.log("ERROR:", error);
                    return new NextResponse("Error to store the data in DB", { status: 409 });
                }
            }
            else if (smsResponse.status === 409) {
                return new NextResponse("SMS service unavailable!", { status: 503 });
            } 
            else if (smsResponse.status === 502 || smsResponse.status === 500 || emailResponse.status === 500) {
                return new NextResponse("Internal Service error!", { status: 500 });
            }
        } else {
            return new NextResponse("Bad request! Please send the correct request body.", { status: 400 });
        }
        
    } catch (error) {
        console.error("[SEND_ALERT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}