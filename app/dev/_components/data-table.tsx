"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { pendingToCancelledStatus } from "../_actions/pending-to-cancelled"
import { useToast } from "@/components/ui/use-toast"
import ConfirmModel from "@/components/model/confirm-model"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const { toast } = useToast();
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 50,
            },
        },
    })

    const handlePendingToCancelledStatus = async () => {
        const res = await pendingToCancelledStatus();
        // console.log("RES: ", res);
        if (res?.count !== 0) {
            toast({
                title: `Status updated for ${res?.count} device(s).`,
                variant: "success"
            });
        } else {
            toast({
                title: "Nothing 'pending' to update!",
                variant: "error"
            });
        }
    }

    return (
        <div>
            {/* Search bar */}
            <div className="flex justify-between items-center py-4 gap-2">
                <Input
                    placeholder="Search serial number..."
                    value={(table.getColumn("eliotSerialNo")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("eliotSerialNo")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <div>
                    <ConfirmModel
                        subTitle="This action cannot be undone. It will change the status 'pending' to 'cancelled'."
                        onConfirm={handlePendingToCancelledStatus}
                    >
                        <Button
                            variant="secondary"
                        >
                            Pending ➜ Cancelled
                        </Button>
                    </ConfirmModel>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border bg-white box-shadow">
                <Table>
                    <TableHeader className="bg-slate-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="bg-white"
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="bg-white"
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
