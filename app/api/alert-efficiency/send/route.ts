import { NextResponse } from "next/server";
import moment from "moment-timezone";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";
import { sendSmsAlert } from "@/actions/send-sms-alert";
import sendEmailAlert from "@/actions/send-email-alert";

export async function POST(
    req: Request,
) {
    try {
            console.log("first")
            const requestData = await req.json();

            if (!Array.isArray(requestData) || requestData.length === 0) {
                return new NextResponse("Invalid request body!", { status: 400 });
            }

            console.log(requestData)

        let id = generateUniqueId();
        
        const date = new Date;
        const timezone: string = process.env.NODE_ENV === 'development' ? 'Asia/Colombo' : 'Asia/Dhaka'
        const timestamp = moment(date).tz(timezone).format('YYYY-MM-DD HH:mm:ss');

        const lineChiefId = requestData[0].lineChiefId;
        const verifiedKey = requestData[0].verifiedKey;

        const authorizedKey = process.env.AUTHORIZED_IOT_KEY;
        if (authorizedKey !== verifiedKey) {
            return new NextResponse("Unauthorized!", { status: 401 });
        }
        // Fetch employee data
        const recipient = await db.staff.findUnique({
            where: {
                id:lineChiefId
            }
        });

        // console.log(recipient)
        // Fetch machine data
        const firstOperator = requestData[0];
        const machine = await db.sewingMachine.findUnique({
            where: { machineId: firstOperator.machineId },
            include: {
                unit: { select: { name: true } },
                productionLines: { select: { name: true } }
            }
        });
        const operatorsInfo = requestData.map(({ operatorName, efficiency }) => 
            `  - ${operatorName}, ${efficiency}%`
        ).join("\n");

        if (recipient && machine && operatorsInfo) {
            // let recipientEmail: string[] = [];
            // recipientEmail.push(recipient?.email);

            const message: string = `-ELIoT Global SMS Alert-
-Low Efficiency Alert-
Unit: ${machine.unit.name},
Line: ${machine.productionLines[0].name},
Operators:
${operatorsInfo}
Time: ${timestamp}`

            const smsResponse = await sendSmsAlert({
                message,
                recipient: recipient?.phone
            });

            console.log(message)

            if (smsResponse.status === 200) {
                try {
                   
                    return NextResponse.json({ data: "success", message: 'SMS & Email alert sent successfully' }, { status: 201 });
                } catch (error) {
                    console.log("ERROR:", error);
                    return new NextResponse("Error to store the data in DB", { status: 409 });
                }
            }
            else if (smsResponse.status === 409) {
                return new NextResponse("SMS service unavailable!", { status: 503 });
            }
            else if (smsResponse.status === 502 || smsResponse.status === 500 ) {
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

