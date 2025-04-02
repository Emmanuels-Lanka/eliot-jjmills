"use client"

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Loader2, Trash2, Edit } from "lucide-react";
import axios from "axios";
import { Operation } from "@prisma/client"
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table"

import { cn } from "@/lib/utils";
import ConfirmModel from "@/components/model/confirm-model";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ActionCell = ({ row }: { row: any }) => {
    const { id } = row.original;

    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async (staffId: string) => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/operation/${staffId}`);
            router.refresh();
            toast({
                title: "Successfully removed staff!",
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

    return (
        <div className="flex gap-2">
            <Link href={`/operations/${id}`}>
                <Button
                    size='sm'
                    disabled={isLoading}
                    variant='outline'
                >
                    <Edit className="w-4 h-4" />
                </Button>
            </Link>
            <ConfirmModel onConfirm={() => onDelete(id)}>
                <Button
                    size='sm'
                    disabled={isLoading}
                    variant='outline'
                >
                    <Loader2 className={cn("animate-spin w-4 h-4 hidden", isLoading && "flex")} />
                    <Trash2 className={cn("w-4 h-4 text-destructive", isLoading && 'hidden')} />
                </Button>
            </ConfirmModel>
        </div>
    )
}

export const columns: ColumnDef<Operation>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "code",
        header: "Operation Code",
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-6"
                >
                    Created Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date: Date = row.getValue("createdAt");
            const options: Intl.DateTimeFormatOptions = {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            };
            const formattedDate: string = new Intl.DateTimeFormat('en-US', options).format(date);

            return (
                <p>{formattedDate}</p>
            )
        }
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => <ActionCell row={row} />
    }
]
