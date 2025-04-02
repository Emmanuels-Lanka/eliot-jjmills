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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
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
    })

    return (
      <div>
        <div className='mb-10 border px-12 pt-6 pb-6 rounded-lg bg-slate-100 shadow-md'>



          <div className="w-full flex flex-col lg:flex-row items-end gap-x-8 gap-y-6 ">
            <div className="flex items-center py-4">
                <Input
                placeholder="Search By Machine ID..."
                value={
                    (table.getColumn("machineId")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                    table.getColumn("machineId")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
                />
            </div>

            <div className="flex items-center py-4 px-4">
                <Input
                placeholder="Search By Employee Id..."
                value={
                    (table.getColumn("employeeId")?.getFilterValue() as string) ??
                    ""
                }
                onChange={(event) =>
                    table
                    .getColumn("employeeId")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
                />
            </div>

            <div className="flex items-center w-1/3 py-4 px-4">
                <Popover>
                <PopoverTrigger asChild>
                    <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                    >
                    {(table
                        .getColumn("reqTimestamp")
                        ?.getFilterValue() as string) ?? "Pick a date"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Calendar
                    mode="single"
                    selected={
                        (table
                        .getColumn("reqTimestamp")
                        ?.getFilterValue() as Date) ?? null
                    }
                    onSelect={(date: any) =>
                        table.getColumn("reqTimestamp")?.setFilterValue(
                        date.toLocaleDateString("en-CA", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                        })
                        )
                    }
                    disabled={(date) =>
                        date > new Date() || date < new Date("2024-01-01")
                    }
                    initialFocus
                    className=" w-[400px] px-3 py-2"
                    />
                </PopoverContent>
                </Popover>
            </div>
          </div>


          </div>

        {/* Table */}
        <div className="rounded-md border  bg-white box-shadow " >
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
                    );
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
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
    );
}
