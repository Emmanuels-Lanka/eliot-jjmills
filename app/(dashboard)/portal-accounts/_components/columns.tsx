"use client"

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Loader2, Trash2, Edit, ShieldCheck } from "lucide-react";
import axios from "axios";
import { User } from "@prisma/client"
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";

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

    const onDelete = async (userId: string) => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/auth/update/${userId}`);
            router.refresh();
            toast({
                title: "Successfully removed account!",
                variant: 'success',
            });
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                toast({
                    title: error.response.data,
                    variant: "error"
                });
            } else {
                toast({
                    title: "Something went wrong! Try again",
                    variant: "error",
                    description: (
                        <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                            <code className="text-slate-800">
                                ERROR: {error.message}
                            </code>
                        </div>
                    ),
                });
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex gap-2">
            <Link href={`/portal-accounts/${id}`}>
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

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => {
            const value: string = row.getValue("email");
            return (
                <a href={`mailto:${value}`} className="italic hover:text-blue-800">{value}</a>
            )
        }
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        accessorKey: "role",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="-ml-2"
                >
                    Role
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const value: string = row.getValue("role");
            return (
                <>
                {value === "admin" ? 
                    <Badge className="capitalize flex justify-center items-center w-fit gap-1 px-2 bg-green-600">
                        <ShieldCheck className="w-4 h-4"/>
                        {value}
                    </Badge>
                : 
                    <p className="capitalize">{value}</p>
                }
                </>
            )
        }
    },
    {
        accessorKey: "employeeId",
        header: "Emp ID",
    },
    {
        id: "actions",
        header: "Action",
        cell: ({ row }) => <ActionCell row={row} />
    }
]
