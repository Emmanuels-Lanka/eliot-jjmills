"use client"

import { ArrowUpDown } from "lucide-react";
import { AlertLog } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { cn } from "../../../../lib/utils";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";

function calculateTimeDifference(startTime: string, endTime: string) {
    if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        // Calculate the difference in milliseconds and convert to minutes
        const difference = (end.getTime() - start.getTime()) / 1000 / 60; // Milliseconds to seconds to minutes
        const hours = Math.floor(difference / 60);
        const minutes = Math.round(difference % 60);

        if (hours > 0 && minutes > 0) {
            return `${hours}hour ${minutes}min`;
        } else if (hours > 0) {
            return `${hours}hour`;
        } else {
            return `${minutes}min`;
        }
    }
}

export const columns: ColumnDef<AlertLog>[] = [
    {
        accessorKey: "operatorRfid",
        header: "Operator",
    },
    {
        accessorKey: "employeeId",
        header: "Employee",
    },
    {
        accessorKey: "machineId",
        header: "Machine ID",
    },
    {
        accessorKey: "alertType",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Alert <br></br>Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("alertType");
            return (
                <p className="capitalize">{value}</p>
            )
        }
    },
    {
        accessorKey: "smsStatus",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-6"
                >
                    Alert Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status: string = row.getValue("smsStatus");

            return (
                <Badge className={cn(
                    "bg-green-600 font-normal",
                    status === 'SENDING' ? "bg-orange-600" : status === 'FAILED' && "bg-red-600"
                )}>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "loginTimestamp",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Response<br></br>Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const reqTime: string = row.getValue("reqTimestamp");
            const loginTime: string = row.getValue("loginTimestamp");
            const responseTime = calculateTimeDifference(reqTime, loginTime);

            return (
                <Badge className={cn(
                    "bg-[#0374BB] rounded-sm text-sm font-normal ml-3"
                )}>
                    {responseTime}
                </Badge>
            )
        }
    },
    {
        accessorKey: "logoutTimestamp",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Working <br></br>Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const loginTime: string = row.getValue("loginTimestamp");
            const logoutTime: string = row.getValue("logoutTimestamp");
            const workingTime = calculateTimeDifference(loginTime, logoutTime);

            return (
                <>
                    {workingTime ?
                        <Badge className={cn(
                            "bg-[#0374BB] rounded-sm text-sm font-normal ml-2"
                        )}>
                            {workingTime}
                        </Badge>
                        :
                        <p>-{logoutTime}</p>
                    }
                </>
            )
        },
    },
    {
        accessorKey: "reqTimestamp",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Request<br></br>Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("reqTimestamp");
            return (
                <p className="capitalize">{value}</p>
            )
        }
    },
]
