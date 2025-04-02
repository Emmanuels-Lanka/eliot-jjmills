"use client"

import moment from "moment-timezone";
import { ArrowUpDown } from "lucide-react";
import { EliotFirmwareUpdate } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<EliotFirmwareUpdate>[] = [
    {
        accessorKey: "eliotSerialNo",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Serial No.
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        }
    },
    {
        accessorKey: "firmwareUrl",
        header: "Firmware URL",
    },
    {
        accessorKey: "firmwareVersion",
        header: "Firmware Version",
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Last Update
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const dateValue: Date = row.getValue("updatedAt");
            const date = new Date(dateValue);
            const formattedDate = moment(date).format('DD MMM, YYYY');
            const formattedTime = moment(date).format('hh:mm A');

            return (
                <p>{formattedTime} ({formattedDate})</p>
            )
        }
    },
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const status: string = row.getValue("status") || "";
            // const status = "failed";

            return (
                <Badge
                    variant={status.toLowerCase() === "cancelled" ? "destructive" : "outline"}
                    className={cn("text-sm capitalize",
                        status.toLowerCase() === "pending" && "text-yellow-600",
                        status.toLowerCase() === "done" && "text-green-600",
                        status.toLowerCase() === "failed" && "text-red-600",
                    )}
                >
                    {status}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const status: string = row.getValue("status") || "";

            return (
                <>
                    {status.toLowerCase() !== "pending" ?
                        status.toLowerCase() !== "done" ?
                            status.toLowerCase() === "failed" && <div className={cn("rounded-full w-2.5 h-2.5 bg-red-600")} />
                            :
                            <div className={cn("rounded-full w-2.5 h-2.5 bg-green-600")} />
                        :
                        <div className={cn("rounded-full w-2 h-2 bg-green-600 animate-ping")} />
                    }
                </>
            )
        }
    }
]
