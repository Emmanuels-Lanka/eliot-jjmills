"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Edit, Loader2, Plus, PlusCircle, Zap } from "lucide-react";
import { ObbOperation, Operation, SewingMachine } from "@prisma/client";
import { useWatch } from 'react-hook-form';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { fetchCurrentOperationsCount } from "../../_actions/fetch-current-operations-count";

interface ObbOperationsFormProps {
    defaultData?: ObbOperation;
    obbSheetId: string;
    operations: Operation[] | null;
    machines: SewingMachine[] | null;
}

const formSchema = z.object({
    seqNo: z.number(),
    operationId: z.string().min(1, "Operation is required"),
    sewingMachineId: z.string(),
    smv: z.string(),
    target: z.number(),
    spi: z.number(),
    length: z.number(),
    totalStitches: z.number(),
    obbSheetId: z.string(),
    part: z.string()
});

const ObbOperationsForm = ({
    defaultData,
    obbSheetId,
    operations,
    machines,
}: ObbOperationsFormProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // seqNo: defaultData?.seqNo,
            seqNo: defaultData?.seqNo || 0,
            operationId: defaultData?.operationId || "",
            sewingMachineId: defaultData?.sewingMachineId || "",
            smv: defaultData?.smv.toString() || "",
            target: defaultData?.target,
            spi: defaultData?.spi || 0,
            length: defaultData?.length || 0,
            totalStitches: defaultData?.totalStitches || 0,
            obbSheetId: obbSheetId,
            part: defaultData?.part || ''
        },
    });

    const { register, handleSubmit, reset, formState: { isSubmitting, isValid } } = form;

    useEffect(() => {
        const fetchObbOperations = async () => {
            const operationsCount = await fetchCurrentOperationsCount(obbSheetId);
            form.setValue("seqNo", operationsCount + 1);
        };
        if (!defaultData) {
            fetchObbOperations();
        }
    }, [obbSheetId, form, defaultData, isDialogOpen]);


    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log("Form Data on Submit:", data);
        try {
            const endpoint = defaultData ? `/api/obb-operation/${defaultData.id}` : '/api/obb-operation';
            const method = defaultData ? axios.put : axios.post;

            const response = await method(endpoint, data);
            console.log("end point Data", endpoint)
            toast({
                title: `Successfully ${defaultData ? 'updated' : 'created'} OBB operation`,
                variant: "success",
            });
            router.refresh();
            form.reset();
            setIsDialogOpen(false);
            window.location.reload();
        } catch (error: any) {
            toast({
                title: error.response?.data || "Something went wrong! Try again",
                variant: "error"
            });
        }
    }

    const handleUnassign = async () => {
        if (defaultData && defaultData.sewingMachineId) {
            try {
                await axios.put(`/api/obb-operation/${defaultData.id}/unassign-machine?machineId=${defaultData.sewingMachineId}`);
                toast({
                    title: "Successfully unassigned",
                    variant: "success",
                });
            } catch (error: any) {
                toast({
                    title: error.response?.data || "Something went wrong! Try again",
                    variant: "error"
                });
            } finally {
                router.refresh();
                setIsDialogOpen(false);
            }
        }
    }

    const handleCancel = () => {
        setIsDialogOpen(false);
        form.reset({
            seqNo: defaultData?.seqNo || 0,
            operationId: defaultData?.operationId || "",
            sewingMachineId: defaultData?.sewingMachineId || "",
            smv: defaultData?.smv.toString() || "",
            target: defaultData?.target || 0,
            spi: defaultData?.spi || 0,
            length: defaultData?.length || 0,
            totalStitches: defaultData?.totalStitches || 0,
            obbSheetId: obbSheetId,
            part: defaultData?.part || ''
        });
    }

    return (
        <Dialog open={isDialogOpen}>
            <DialogTrigger asChild>
                {defaultData ?
                    <Button className="w-full flex justify-start gap-2 pr-5" variant="ghost" onClick={() => setIsDialogOpen(true)}>
                        <Edit className="w-4 h-4" />
                        Edit
                    </Button>
                    :
                    <Button onClick={() => setIsDialogOpen(true)} variant='ghost' className="text-base">
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Create new
                    </Button>
                }
            </DialogTrigger>
            <DialogContent className="max-md:py-8 md:p-8 w-full">
                <DialogHeader className="mt-2">
                    <DialogTitle>
                        {defaultData ? "Update " : "Create new "} OBB Operation
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full space-y-6 mt-4"
                    >
                        <div className="w-full flex gap-x-4 items-end">
                            <FormField
                                control={form.control}
                                name="operationId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Operation
                                        </FormLabel>
                                        <Popover open={open1} onOpenChange={setOpen1}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open1}
                                                    className="w-full justify-between font-normal"
                                                >
                                                    {operations ?
                                                        <>
                                                            {field.value
                                                                ? operations.find((operation) => operation.id === field.value)?.name
                                                                : "Select Operation..."}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </>
                                                        :
                                                        "No operation available!"
                                                    }
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search operation..." />
                                                    <CommandList>
                                                        <CommandEmpty>No operation found!</CommandEmpty>
                                                        <CommandGroup>
                                                            {operations && operations.map((operation) => (
                                                                <CommandItem
                                                                    key={operation.id}
                                                                    value={operation.name}
                                                                    onSelect={() => {
                                                                        form.setValue("operationId", operation.id)
                                                                        setOpen1(false)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value === operation.id ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {operation.name}
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
                            <FormField
                                control={form.control}
                                name="sewingMachineId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Machine
                                        </FormLabel>
                                        <Popover open={open2} onOpenChange={setOpen2}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open2}
                                                    className="w-full justify-between font-normal"
                                                >
                                                    {machines ?
                                                        <>
                                                            {field.value
                                                                ? machines.find((machine) => machine.id === field.value)?.machineId
                                                                : "Select machine ID..."}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </>
                                                        :
                                                        "No machine available!"
                                                    }
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search machine..." />
                                                    <CommandList>
                                                        <CommandEmpty>No machine found!</CommandEmpty>
                                                        <CommandGroup>
                                                            {/* {machines?.filter(machine => !assignedMachinesToOperations?.includes(machine.id)).map((machine) => ( */}
                                                            {machines?.map((machine) => (
                                                                <CommandItem
                                                                    key={machine.id}
                                                                    value={machine.machineId}
                                                                    onSelect={() => {
                                                                        form.setValue("sewingMachineId", machine.id);
                                                                        setOpen2(false);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value === machine.id ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {`${machine.brandName}-${machine.machineType}-${machine.machineId}`}
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
                            {defaultData && defaultData.sewingMachineId &&
                                <Button type="button" variant="outline" onClick={handleUnassign}>
                                    Unassign
                                </Button>
                            }
                        </div>
                        <div className="w-full flex gap-x-2">
                            <div className="w-28">
                                <FormField
                                    control={form.control}
                                    name="seqNo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Seq
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    value={field.value || ""}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        form.setValue("seqNo", value === "" ? 0 : Number(value));
                                                    }}
                                                    onBlur={(e) => {
                                                        const value = e.target.value;
                                                        form.setValue("seqNo", value === "" ? 0 : Number(value));
                                                    }}
                                                    placeholder="seqNo"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-2/3">
                                <FormField
                                    control={form.control}
                                    name="part"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Part
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={defaultData ? defaultData.part as string : field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select part" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="front">FRONT</SelectItem>
                                                    <SelectItem value="back">BACK</SelectItem>
                                                    <SelectItem value="assembly">ASSEMBLY</SelectItem>
                                                    <SelectItem value="line-end">LINE END</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="smv"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            SMV
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="smv"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="target"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Target
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                {...field}
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('target', newValue, { shouldValidate: true, shouldDirty: true });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <div className="w-16">
                                <FormField
                                    control={form.control}
                                    name="spi"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                spi
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="hide-steps-number-input"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const newValue: number = parseInt(e.target.value);
                                                        form.setValue('spi', newValue, { shouldValidate: true, shouldDirty: true });
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-16">
                                <FormField
                                    control={form.control}
                                    name="length"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Length
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="hide-steps-number-input"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const newValue: number = parseInt(e.target.value);
                                                        form.setValue('length', newValue, { shouldValidate: true, shouldDirty: true });
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-44">
                                <FormField
                                    control={form.control}
                                    name="totalStitches"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="max-lg:line-clamp-1">
                                                Total Stitches
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="hide-steps-number-input"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const newValue: number = parseInt(e.target.value);
                                                        form.setValue('totalStitches', newValue, { shouldValidate: true, shouldDirty: true });
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div> */}
                        </div>
                        {/* <Input {...register("operationId")} placeholder="Operation ID" /> */}

                        <DialogFooter>
                            <div className="mt-4 flex justify-between gap-2">
                                <Button
                                    type="button"
                                    variant='outline'
                                    className="flex gap-2 pr-5 text-red-600"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !isValid}
                                    className="flex gap-2 pr-5 w-40"
                                >
                                    <Zap className={cn("w-5 h-5", isSubmitting && "hidden")} />
                                    <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                                    Save
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default ObbOperationsForm