import * as z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Filter, Loader2, Search } from "lucide-react";
import { format } from "date-fns";

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
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { EmployeeRecord } from "./actions";

interface Operator {
    id: string;
    name: string;
    employeeId: string;
    rfid: string;
   
}

interface OperatorSearchProps {
    operators: EmployeeRecord[] | null;
    handleSubmit: (data: { operatorId: string; date: Date; endDate: Date }) => void;
}

const formSchema = z.object({
    operatorId: z.string().min(1, {
        message: "Operator selection is required"
    }),
    date: z.date({
        required_error: "Start date is required",
    }),
    endDate: z.date({
        required_error: "End date is required",
    })
});

const OperatorSearch = ({
    operators,
    handleSubmit
}: OperatorSearchProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredOperators, setFilteredOperators] = useState<EmployeeRecord[]>(operators || []);
    const [showResults, setShowResults] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            operatorId: "",
            date: undefined,
            endDate: undefined
        },
    });

    const { isSubmitting, isValid } = form.formState;

    // console.log("aaaa",operators)
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        if (!operators) return;

        const filtered = operators.filter(operator => 
            operator.name.toLowerCase().includes(value.toLowerCase()) ||
            operator.employeeId.toLowerCase().includes(value.toLowerCase()) ||
            operator.rfid.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredOperators(filtered);
        setShowResults(true);
    };

    const handleOperatorSelect = (operator: Operator) => {
        form.setValue("operatorId", operator.id);
        setSearchTerm(`${operator.name} (${operator.employeeId})`);
        setShowResults(false);
    };

    return (
        <div className='mt-16 border px-12 pt-6 pb-10 rounded-lg bg-slate-100 shadow-md'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full flex flex-col lg:flex-row items-end gap-x-8 gap-y-6 mt-4"
                >
                    <div className="w-full flex flex-col md:flex-row gap-6">
                        <div className="md:w-2/5">
                            <FormField
                                control={form.control}
                                name="operatorId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-base">
                                            Search Operator
                                        </FormLabel>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <Input
                                                value={searchTerm}
                                                onChange={(e) => handleSearch(e.target.value)}
                                                className="pl-10"
                                                placeholder="Search by name, ID, or RFID..."
                                            />
                                            {showResults && searchTerm && (
                                                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
                                                    <Command>
                                                        <CommandList>
                                                            <CommandEmpty>No operators found</CommandEmpty>
                                                            <CommandGroup>
                                                                {filteredOperators.map((operator) => (
                                                                    <CommandItem
                                                                        key={operator.id}
                                                                        onSelect={() => handleOperatorSelect(operator)}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <div className="flex flex-col">
                                                                            <span className="font-medium">{operator.name}</span>
                                                                            <span className="text-sm text-gray-500">
                                                                                ID: {operator.employeeId} | RFID: {operator.rfid}
                                                                            </span>
                                                                        </div>
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </div>
                                            )}
                                        </div>
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
                                            Starting Date
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
                                                />
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
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-base">
                                            Ending Date
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
                        Generate
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default OperatorSearch;