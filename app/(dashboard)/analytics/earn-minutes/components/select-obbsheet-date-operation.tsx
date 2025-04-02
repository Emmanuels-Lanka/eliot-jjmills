"use client"

import axios from "axios";
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
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { ObbOperation } from "@prisma/client";

interface SelectObbSheetDateOperationProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    handleSubmit: (data: { obbSheetId: string; timeSlot: number; date: Date; }) => void;
};

type ObbOperationsType = {
    id: string;
    seqNo: number;
    operation: {
        name: string;
        code: string
    };
}
type timeSlots = {
    key:number;
    value:string;
}
const formSchema = z.object({
    obbSheetId: z.string().min(1, {
        message: "OBB Sheet is required"
    }),
    // obbOperationId: z.string().min(1, {
    //     message: "OBB Sheet is required"
    // }),
    date: z.date(),
    // operationName: z.string().min(1),
    timeSlot: z.number().min(1)
});

const SelectObbSheetDateOperation = ({
    obbSheets,
    handleSubmit
}: SelectObbSheetDateOperationProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [obbOperations, setObbOperations] = useState<ObbOperationsType[]>([]);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [times,setTimes] = useState<timeSlots []> ([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            obbSheetId: "",
            // obbOperationId: "",
            date: undefined,
            timeSlot:undefined
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const setTime = () => {

        const timeValues =[];

    for (let hour = 8 ; hour<=18; hour++)
    {
        const key = hour ; 
        const startTime = `${hour}:00`;
        const endTime = `${hour+1}:00`;
        const value = `${startTime} - ${endTime}`;
        timeValues.push({key,value});

    }
    // console.log(timeValues)
    setTimes(timeValues)
    console.log(times)

       
    }

    useEffect (()=> {
        
       setTime();
    },[])



    const handleFetchObbOperations = async (obbSheetId: string) => {
        try {
            const response = await axios.get(`/api/obb-operation/fetch-by-obb-sheet?obbSheetId=${obbSheetId}`);
            console.log("RESULT", response.data.data);
            setObbOperations(response.data.data);
            router.refresh();
        } catch (error: any) {
            console.error("Error fetching obb operations:", error);
            toast({
                title: error.response.data || "Something went wrong! Try again",
                variant: "error"
            });
        }
    }

    return (
        <div className='mt-16 border px-12 pt-6 pb-10 rounded-lg bg-slate-100'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full flex flex-col lg:flex-row items-end gap-6 mt-4"
                >
                    <div className="w-full flex flex-col md:flex-row gap-4">
                        <div className="md:w-2/5">
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
                                                                        form.setValue("obbSheetId", sheet.id);
                                                                        handleFetchObbOperations(sheet.id)
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

                        
                        <div className="md:w-2/5">
            <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel className="text-base">Time Slot</FormLabel>
                        <Popover open={open2} onOpenChange={setOpen2}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open2}
                                    className="w-full justify-between font-normal"
                                >
                                    {times.length > 0 ? (
                                        <>
                                            {field.value
                                                ? times.find((time) => time.key === field.value)?.value
                                                : "Select Time Slot..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </>
                                    ) : (
                                        "Loading time slots..."
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                                <Command>
                                    <CommandInput placeholder="Search Time Slot..." />
                                    <CommandList>
                                        <CommandEmpty>No time slots found!</CommandEmpty>
                                        <CommandGroup>
                                            {times.map((time) => (
                                                <CommandItem
                                                    key={time.key}
                                                    value={time.value}
                                                    onSelect={() => {
                                                        form.setValue("timeSlot", time.key);
                                                        setOpen2(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            field.value === time.key ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {time.value}
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
                        <div className="md:w-2/5">
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

export default SelectObbSheetDateOperation