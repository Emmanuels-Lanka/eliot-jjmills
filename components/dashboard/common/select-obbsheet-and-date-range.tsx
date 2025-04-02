"use client"

import * as z from "zod";
import { useState } from "react";
import { addDays, format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Check, ChevronsUpDown, Filter, Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

interface SelectObbSheetAndDateRangeProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    handleSubmit: (data: { obbSheetId: string; date: DateRange }) => void;
};

const formSchema = z.object({
    obbSheetId: z.string().min(1, {
        message: "OBB Sheet is required"
    }),
    date: z
        .object({
            from: z.date(),
            to: z.date(),
        })
        .refine((range) => range.from <= range.to, {
            message: "Invalid date range",
        })
});

const SelectObbSheetAndDateRange = ({
    obbSheets,
    handleSubmit
}: SelectObbSheetAndDateRangeProps) => {
    const defaultDateRange: DateRange = {
        from: addDays(new Date(), -4),
        to: new Date(),
    };

    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<DateRange | undefined>(defaultDateRange);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            obbSheetId: "",
            date: defaultDateRange,
        },
    });

    const { isSubmitting } = form.formState;

    const obbHasSelected = !!form.watch("obbSheetId");
    const dateHasSelected = !!form.watch("date");
    const isValid = (obbHasSelected && dateHasSelected);

    return (
        <div className='mt-6 mb-10 border px-10 pt-6 pb-12 rounded-lg bg-slate-100'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full flex flex-col lg:flex-row items-end gap-x-8 gap-y-6 mt-4"
                >
                    <div className="w-full flex flex-col md:flex-row gap-6">
                        <div className="md:w-2/3">
                            <FormField
                                control={form.control}
                                name="obbSheetId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-base">
                                            OBB Sheet
                                        </FormLabel>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-full justify-between font-normal"
                                                >
                                                    {obbSheets ?
                                                        <>
                                                            {field.value
                                                                ? obbSheets.find((sheet) => sheet.id === field.value)?.name
                                                                : "Select OBB Sheets..."}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </>
                                                        :
                                                        "No OBB sheets available!"
                                                    }
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search OBB sheet..." />
                                                    <CommandList>
                                                        <CommandEmpty>No OBB sheet found!</CommandEmpty>
                                                        <CommandGroup>
                                                            {obbSheets && obbSheets.map((sheet) => (
                                                                <CommandItem
                                                                    key={sheet.id}
                                                                    value={sheet.name}
                                                                    onSelect={() => {
                                                                        form.setValue("obbSheetId", sheet.id)
                                                                        setOpen(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value === sheet.id ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {sheet.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="md:w-1/3">
                        <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-base">Date Range</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"outline"}
                                                    className={cn(
                                                        "justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="size-5 mr-1 text-slate-600" />
                                                    {field.value?.from ? (
                                                        field.value.to ? (
                                                            <>
                                                                {format(
                                                                    field.value.from,
                                                                    "LLL dd, y"
                                                                )}{" "}
                                                                -{" "}
                                                                {format(
                                                                    field.value.to,
                                                                    "LLL dd, y"
                                                                )}
                                                            </>
                                                        ) : (
                                                            format(field.value.from, "LLL dd, y")
                                                        )
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    initialFocus
                                                    mode="range"
                                                    defaultMonth={date?.from}
                                                    selected={date}
                                                    onSelect={(newDate) => {
                                                        if (newDate?.from && newDate?.to) {
                                                            setDate(newDate);
                                                            form.setValue("date", { from: newDate.from, to: newDate.to });
                                                        }
                                                    }}
                                                    numberOfMonths={2}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="flex max-md:w-full w-32 gap-2 pr-5"
                    >
                        <Filter className={cn("w-5 h-5", isSubmitting && "hidden")} />
                        <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                        Genarate
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default SelectObbSheetAndDateRange