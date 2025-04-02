"use client"

import * as z from "zod";
import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { getObb } from "./action";
// import { getObb } from "./actions";

interface SelectObbSheetAndDateProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    handleSubmit: (data: { obbSheetId: string; }) => void;
    units:{
        id: string;
        name: string;
    }[] | null;
};

const formSchema = z.object({
    obbSheetId: z.string().min(1, {
        message: "OBB Sheet is required"
    }),
    // date: z.date(),
    unit: z.string().min(1, {
        message: "Unit is required"
    }),
});


export type obb = {
    obbSheet: {
        id: string;
        name: string;
    }[] | null;
}



const SelectObbSheetAndDate = ({
    obbSheets,
    handleSubmit,
    units
}: SelectObbSheetAndDateProps) => {
    const [open, setOpen] = useState(false)

    const [unitOpen, setUnitOpen] = useState(false);
const [obbSheetOpen, setObbSheetOpen] = useState(false);
const [obbSheet, setObbSheet] = useState<{ id: string; name: string }[]>([]);

    

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            obbSheetId: "",
            
            unit:""
        },
    });

    const { isSubmitting, isValid } = form.formState;


    const handleChange = async (unit:any) => {

        const data = await getObb(unit);
        console.log("unit",unit)
        
        setObbSheet(data);

    }

    

    return (
        <div className='mt-10 mb-16 border px-12 pt-6 pb-10 rounded-lg bg-slate-100 shadow-md'>
            
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full flex flex-col lg:flex-row items-end gap-x-8 gap-y-6 mt-4"
                >
                    <div className="w-full flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/2">
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-base">
                                            Units
                                        </FormLabel>
                                        <Popover open={unitOpen} onOpenChange={setUnitOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-full justify-between font-normal"
                                                >
                                                    {units ?
                                                        <>
                                                            {field.value
                                                                ? units.find((sheet) => sheet.id === field.value)?.name
                                                                : "Select Units..."}
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
                                                            {units && units.map((sheet) => (
                                                                <CommandItem
                                                                    key={sheet.id}
                                                                    value={sheet.name}
                                                                    onSelect={() => {
                                                                        form.setValue("unit", sheet.id)
                                                                        setUnitOpen(false)
                                                                        handleChange(sheet.id)

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


                        <div className="md:w-1/2">
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
                                                    {obbSheet ?
                                                        <>
                                                            {field.value
                                                                ? obbSheet.find((sheet) => sheet.id === field.value)?.name
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
                                                            {obbSheet && obbSheet.map((sheet) => (
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


                    </div>
                    <Button
                        type="submit"
                        // disabled={!isValid || isSubmitting}
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

export default SelectObbSheetAndDate