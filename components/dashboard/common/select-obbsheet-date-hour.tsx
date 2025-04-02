"use client"

import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { CalendarIcon, Check, ChevronsUpDown, Filter, Loader2 } from "lucide-react";

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface SelectObbSheetDateHourProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    handleSubmit: (data: { obbSheetId: string; date: Date, hourGroup: string }) => void;
};

const formSchema = z.object({
    obbSheetId: z.string().min(1, {
        message: "OBB Sheet is required"
    }),
    date: z.date(),
    hourGroup: z.string().min(1, {
        message: "Hour group is required"
    }),
});

const SelectObbSheetDateHour = ({
    obbSheets,
    handleSubmit
}: SelectObbSheetDateHourProps) => {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            obbSheetId: "",
            date: undefined,
            hourGroup: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    return (
        <div className='mt-16 border px-12 pt-6 pb-10 rounded-lg bg-slate-100'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full flex flex-col lg:flex-row items-end gap-x-8 gap-y-6 mt-4"
                >
                    <div className="w-full flex flex-col md:flex-row gap-6">
                        <div className="md:w-3/5">
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
                        <div className="md:w-1/5">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-base">
                                            Date
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className="w-full justify-start text-left font-normal"
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("2024-01-01")
                                                    }
                                                    initialFocus
                                                    className="w-full"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="md:w-1/5">
                            <FormField
                                control={form.control}
                                name="hourGroup"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Hour Group
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select hour group" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">7:00 AM - 8:00 AM</SelectItem>
                                                <SelectItem value="2">8:00 AM - 9:00 AM</SelectItem>
                                                <SelectItem value="3">9:00 AM - 10:00 AM</SelectItem>
                                                <SelectItem value="4">10:00 AM - 11:00 AM</SelectItem>
                                                <SelectItem value="5">11:00 AM - 12:00 PM</SelectItem>
                                                <SelectItem value="6">12:00 PM - 1:00 PM</SelectItem>
                                                <SelectItem value="7">1:00 PM - 2:00 PM</SelectItem>
                                                <SelectItem value="8">2:00 PM - 3:00 PM</SelectItem>
                                                <SelectItem value="9">3:00 PM - 4:00 PM</SelectItem>
                                                <SelectItem value="10">4:00 PM - 5:00 PM</SelectItem>
                                                <SelectItem value="11">5:00 PM - 6:00 PM</SelectItem>
                                                <SelectItem value="12">6:00 PM - 7:00 PM</SelectItem>
                                            </SelectContent>
                                        </Select>
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

export default SelectObbSheetDateHour