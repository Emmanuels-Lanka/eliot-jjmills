"use client"

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Loader2, Trash2, Edit, MoreHorizontal, Ban, Sparkle, Copy } from "lucide-react";
import axios from "axios";
import { ObbSheet, Staff } from "@prisma/client"
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table"
import moment from "moment-timezone";

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
import { handleDuplicateObb } from "../_actions/handle-duplicate-obb";

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

    const handleDuplicate = async (obbSheetId: string) => {
        // console.log("Duplicate:", obbSheet);
        try {
            const res = await handleDuplicateObb(obbSheetId);
            if (!res) {
                toast({
                    title: "Failed to duplicate OBB sheet!",
                    variant: "error",
                });
                return;
            } else {
                toast({
                    title: "Successfully duplicated OBB sheet!",
                    variant: "success",
                });
                router.push(`/obb-sheets/${res.id}`);
            }
        } catch (error: any) {
            console.error("DUPLICATE_OBB_ERROR", error);
            toast({
                title: error.response.data || "Something went wrong! Try again",
                variant: "error"
            });
        }
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
                        <DropdownMenuItem
                            disabled={isLoading}
                            onClick={() => handleDuplicate(row.original.id)}
                            className="gap-2 font-medium cursor-pointer"
                        >
                            <Copy className="w-4 h-4" />
                            Duplicate
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

export const columns: ColumnDef<ObbSheet>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-5"
                >
                    Name (line-style)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("name");
            return (
                <p className="capitalize">{value}</p>
            )
        }
    },
    {
        accessorKey: "style",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-5"
                >
                    Style
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("style");
            return (
                <p className="capitalize">{value}</p>
            )
        }
    },
    {
        accessorKey: "unit.name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 flex items-center gap-1 min-w-0"
          >
            Unit <ArrowUpDown className="h-3 w-3" />
          </Button>
        ),
        sortingFn: "alphanumeric",
    },
    {
        accessorKey: "productionLine.name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-1 flex items-center gap-1 min-w-0"
          >
            Line <ArrowUpDown className="h-3 w-3" />
          </Button>
        ),
        sortingFn: "alphanumeric",
    },
    {
        accessorKey: "buyer",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-5"
                >
                    Buyer
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("buyer");
            return (
                <p className="capitalize">{value}</p>
            )
        }
    },
    {
        accessorKey: "colour",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-5"
                >
                    Colour
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("colour");
            return (
                <p className="capitalize">{value}</p>
            )
        }
    },
    // {
    //     accessorKey: "name",
    //     header: "Name (line-style)",
    // },
    // {
    //     accessorKey: "style",
    //     header: "Style",
    // },
    // {
    //     accessorKey: "unit.name",
    //     header: "Unit",
    // },
    // {
    //     accessorKey: "productionLine.name",
    //     header: "Line",
    // },
    // {
    //     accessorKey: "buyer",
    //     header: "Buyer",
    // },
    // {
    //     accessorKey: "colour",
    //     header: "Color",
    // },
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
        accessorKey: "isActive",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-3"
                >
                    Action
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <ActionCell row={row} />,
        sortingFn: (rowA, rowB) => {
            const isActiveA = rowA.original.isActive;
            const isActiveB = rowB.original.isActive;
            if (isActiveA === isActiveB) return 0;
            return isActiveA ? 1 : -1;
        },
    },

    // {
    //     id: "actions",
    //     header: "Action",
    //     cell: ({ row }) => <ActionCell row={row} />
    // }
]
