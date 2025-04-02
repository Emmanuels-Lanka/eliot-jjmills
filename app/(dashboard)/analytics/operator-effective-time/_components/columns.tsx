"use client"

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Loader2, Trash2, Edit, MoreHorizontal, Ban, Sparkle } from "lucide-react";
import axios from "axios";
import { ObbSheet, OperatorEffectiveTime, Staff } from "@prisma/client"
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import ConfirmModel from "@/components/model/confirm-model";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ActionCell = ({ row }: { row: any }) => {
    const { id } = row.original;

    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async (obbSheetId: string) => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/obb-sheet/${obbSheetId}`);
            router.refresh();
            toast({
                title: "Successfully removed OBB sheet!",
                variant: 'success',
            });
        } catch (error: any) {
            console.error("ERROR", error);
            toast({
                title: error.response.data || "Something went wrong! Try again",
                variant: "error"
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleStatus = async (obbSheetId: string) => {
        if (row.original.isActive === true) {
            try {
                setIsLoading(true);
                await axios.patch(`/api/obb-sheet/${obbSheetId}/deactive`);
                router.refresh();
                toast({
                    title: `Successfully deactivated OBB operation!`,
                    variant: "success",
                });
            } catch (error: any) {
                console.error("STATUS_DEACTIVATE_ERROR", error);
                toast({
                    title: error.response.data || "Something went wrong! Try again",
                    variant: "error"
                });
            }
        } else {
            try {
                setIsLoading(true);
                await axios.patch(`/api/obb-sheet/${obbSheetId}/active`);
                router.refresh();
                toast({
                    title: `Successfully activated OBB operation!`,
                    variant: "success",
                });
            } catch (error: any) {
                console.error("STATUS_ACTIVATE_ERROR", error);
                toast({
                    title: error.response.data || "Something went wrong! Try again",
                    variant: "error"
                });
            }
        }
        setIsLoading(false);
    }

    return (
        <div className="flex gap-2">

            <div className="w-full flex justify-between items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                        <Link href={`/obb-sheets/${id}`}>
                            <DropdownMenuItem
                                disabled={isLoading}
                                className="gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            disabled={isLoading}
                            onClick={() => handleStatus(id)}
                            className={cn(
                                "gap-2 font-medium",
                                row.original.isActive === true ? "text-red-500 hover:text-red-500" : "text-green-600"
                            )}
                        >
                            {row.original.isActive === true ?
                                <Ban className="w-4 h-4" />
                                :
                                <Sparkle className="w-4 h-4" />
                            }
                            {row.original.isActive === true ? "Deactive" : "Active"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <ConfirmModel onConfirm={() => onDelete(id)}>
                            <Button
                                size='sm'
                                disabled={isLoading}
                                variant='destructive'
                                className="w-full gap-2 justify-start"
                            >
                                <Loader2 className={cn("animate-spin w-4 h-4 hidden", isLoading && "flex")} />
                                <Trash2 className={cn("w-4 h-4", isLoading && 'hidden')} />
                                Delete
                            </Button>
                        </ConfirmModel>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className={cn("w-2.5 h-2.5 bg-orange-600 rounded-full", row.original.isActive === true && "w-2 h-2 bg-green-600 animate-ping")} />
            </div>
        </div>
    )
}

export const columns: ColumnDef<OperatorEffectiveTime>[] = [
    {
        accessorKey: "operator.name",
        header: "Operator Name",
    },
    {
        accessorKey: "operator.employeeId",
        header:  "Emp ID",
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
                    Login <br></br>Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "logoutTimestamp",
        header: () => {
            return (
                <>
                 Logout <br></br>Time
                </>
                
            )
        },
    },
    {
        accessorKey: "totalTime",
        header:()=>(
            <>
            Total<br/>Available<br/>Time
            </>
        ) ,
    },
    {
        accessorKey: "mechanicDownTime",
        header: "Mechanic Down Time",
    },
    {
        accessorKey: "productionDownTime",
        header: "Production Down Time",
    },
    {
        accessorKey: "lunchBreakTime",
        header: "Lunch Break Time",
    },
    {
        accessorKey: "offStandTime",
        header: "Offstand Time",
    },
    {
        accessorKey: "nonEffectiveTime",
        header: "Non-Productive Time",
    },
    {
        accessorKey: "effectiveTime",
        header: "Productive Time",
    },
]
