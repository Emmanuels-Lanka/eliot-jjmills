"use client"

import * as z from "zod";
import React, { useMemo } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Operation, SewingMachine, Staff } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Loader2, PlusCircle, Zap } from "lucide-react";
import axios from "axios";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
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
import ObbOperationsTable from "@/components/dashboard/common/obb-operations-table";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/app/(dashboard)/obb-sheets/[obbSheetId]/_components/data-table";

interface AddObbOperationFormProps {
    operations: Operation[] | null;
    machines: SewingMachine[] | null;
    // assignedMachinesToOperations: (string | undefined)[] | undefined;
    obbOperations: ObbOperationData[] | undefined;
    obbSheetId: string;
    supervisor1: Staff | null;
    supervisor2: Staff | null;
    
}



type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
    seqNo: z.number(),
    operationId: z.string().min(1, {
        message: "Operation is required",
    }),
    sewingMachineId: z.string().min(1, {
        message: "Sewing machine is required",
    }),
    smv: z.string(),
    target: z.number(),
    spi: z.number(),
    length: z.number(),
    totalStitches: z.number(),
    obbSheetId: z.string(),
    // supervisorId: z.string().min(1, {
    //     message: "Responsive supervisor is required",
    // }),
    part: z.string()
});

const AddObbOperationForm = ({
    operations,
    machines,
    // assignedMachinesToOperations,
    obbOperations,
    obbSheetId,
    supervisor1,
    supervisor2,
    
}: AddObbOperationFormProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatingData, setUpdatingData] = useState<ObbOperationData | undefined>();

    const [obbOperationData, setObbOperationData] = useState<ObbOperationData[]>([]);

    useEffect(() => {
        console.log("OBBSheet ID:", obbSheetId); 
    
        const fetchObbOperations = async () => {
            if (!obbSheetId) {
                console.warn("OBBSheet ID is not defined");
                return; 
            }
    
            try {
                const response = await axios.get(`/api/obb-operation?obbSheetId=${obbSheetId}`);
                const data = response.data;
                console.log("dataaaaaaa", data);
                console.log("Sequence Number:", data.data[0].seqNo);
                const nextseqNo=data.data[0].seqNo+1
                form.reset({
                    seqNo: nextseqNo,
                    operationId: "",
                    sewingMachineId: "",
                    smv: "0.1",
                    target: undefined,
                    spi: 0,
                    length: 0,
                    totalStitches: 0,
                    obbSheetId: obbSheetId,
                    part: ""
                });
                
                console.log("next seq No",nextseqNo)
            } catch (error) {
                console.error("Error fetching OBB Operations", error);
            }
        };
    
        fetchObbOperations();
    }, [obbSheetId]);
 
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            seqNo:0,
            operationId: "",
            sewingMachineId: "",
            smv: "0.1",
            target: undefined,
            spi: 0,
            length: 0,
            totalStitches: 0,
            obbSheetId: obbSheetId,
            part: ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    useEffect(() => {
        if (updatingData) {
            form.reset({
                operationId: updatingData.operationId,
                sewingMachineId: updatingData.sewingMachine?.id || '',
                smv: updatingData.smv.toString(),
                target: updatingData.target,
                spi: updatingData.spi,
                length: updatingData.length,
                totalStitches: updatingData.totalStitches,
                obbSheetId: updatingData.obbSheetId,
                // supervisorId: updatingData.supervisorId || '',
                part: updatingData.part || "",
            });
        }
    }, [updatingData, form]);

    const onSubmit = async (data: FormValues) => {
        if (!isUpdating) {
            try {
                console.log("dataaa",data)
                const res = await axios.post('/api/obb-operation', data);
                console.log("submited data ", res.data);

                toast({
                    title: "Successfully added new OBB operation",
                    variant: "success",
                });
                router.refresh();
                form.reset();
                setIsEditing(false);
            } catch (error: any) {
                console.error("ERROR", error);
                toast({
                    title: error.response.data || "Something went wrong! Try again",
                    variant: "error"
                });
            }
        } else {
            if (updatingData) {
                try {
                    const res = await axios.put(`/api/obb-operation/${updatingData?.id}`, data);
                    toast({
                        title: "Successfully updated",
                        variant: "success",
                    });
                    router.refresh();
                    form.reset();
                    setIsUpdating(false);
                } catch (error: any) {
                    console.error("ERROR", error);
                    toast({
                        title: error.response.data || "Something went wrong! Try again",
                        variant: "error"
                    });
                } finally {
                    setUpdatingData(undefined);
                }
            }
        }
    };

    const handleCancel = () => {
        setIsUpdating(false);
        setIsEditing(false);
        setUpdatingData(undefined);
        form.reset({
            seqNo:0,
            operationId: "",
            sewingMachineId: "",
            smv: undefined, 
            target: undefined,
            spi: undefined,
            length: undefined,
            totalStitches: undefined,
            obbSheetId: obbSheetId,
            
        });
    }

    return (
        <div className="mx-auto max-w-7xl border px-6 pt-4 pb-6 rounded-lg bg-slate-100">
            <div className="font-medium flex items-center justify-between">
                <h2 className="text-slate-800 text-lg font-medium">{isEditing ? 'Add OBB Operation' : isUpdating ? 'Update OBB Operations' : `OBB Operations (${obbOperations ? obbOperations?.length : '0'})`}</h2>
                <Button onClick={() => setIsEditing(true)} variant='ghost' className="text-base">
                    {!isUpdating && !isEditing && (
                        <>
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Create new
                        </>
                    )}
                </Button>
            </div>

            {(isUpdating || isEditing ||updatingData) && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6 mt-4"
                    >
                        <div className="flex flex-row gap-x-2">
                                <div className="w-14">
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
                                            value={field.value || ""} // Display empty string if value is 0 or falsy
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Set the value to 0 if the input is empty, else convert it to a number
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
                            <div className="w-5/12">
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
                            </div>
                            <div className="w-3/12">
                                <FormField
                                    control={form.control}
                                    name="sewingMachineId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Machine
                                            </FormLabel>
                                            {/* <Select onValueChange={field.onChange} defaultValue={updatingData?.sewingMachine?.id || field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select machine" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {assignedMachinesToOperations !== undefined ?
                                                        <>
                                                            {machines && machines.filter(machine => !assignedMachinesToOperations.includes(machine.id)).map((machine) => (
                                                                <SelectItem key={machine.id} value={machine.id}>
                                                                    {machine.brandName}-{machine.machineType}-{machine.machineId}
                                                                </SelectItem>
                                                            ))}
                                                        </>
                                                        :
                                                        <>
                                                            {machines && machines.map((machine) => (
                                                                <SelectItem key={machine.id} value={machine.id}>{machine.brandName}-{machine.machineType}-{machine.machineId}</SelectItem>
                                                            ))}
                                                        </>
                                                    }
                                                </SelectContent>
                                            </Select> */}
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
                                                                {/* {machines && machines.map((machine) => (
                                                                    <CommandItem
                                                                        key={machine.id}
                                                                        value={machine.machineId}
                                                                        onSelect={() => {
                                                                            form.setValue("sewingMachineId", machine.id)
                                                                            setOpen2(false)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                field.value === machine.id ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {machine.brandName}-{machine.machineType}-{machine.machineId}
                                                                    </CommandItem>
                                                                ))} */}
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
                            
                            <div className="w-2/12">
                                <FormField
                                    control={form.control}
                                    name="part"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                              Part
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={updatingData?.part ? updatingData.part : field.value}>
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
                            {/* <div className="w-3/12">
                                <FormField
                                    control={form.control}
                                    name="supervisorId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Responsible Supervisor
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={updatingData?.supervisorId ? updatingData.supervisorId : field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select supervisor" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {supervisor1 && <SelectItem value={supervisor1.id}>{supervisor1.name} - {supervisor1.employeeId}</SelectItem>}
                                                    {supervisor2 && <SelectItem value={supervisor2.id}>{supervisor2.name} - {supervisor2.employeeId}</SelectItem>}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div> */}
                            <div className="w-20">
                                <FormField
                                    control={form.control}
                                    name="smv"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                SMV
                                            </FormLabel>
                                            <FormControl>
                                                {/* <Input
                                                    type="number"
                                                    className="hide-steps-number-input"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const newValue: number = parseInt(e.target.value);
                                                        form.setValue('smv', newValue, { shouldValidate: true, shouldDirty: true });
                                                    }}
                                                /> */}
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
                            </div>
                            <div className="w-1/12">
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
                            </div>
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
                        <div className="mt-4 flex justify-between gap-2">
                            <Button variant='outline' className="flex gap-2 pr-5 text-red-600" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex gap-2 pr-5"
                            >
                                <Zap className={cn("w-5 h-5", isSubmitting && "hidden")} />
                                <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                                {isUpdating ? 'Update' : 'Add OBB Operation'}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}

            {isUpdating &&
                <Separator className="mt-8 h-0.5 bg-slate-300/80" />
            }

            {!isEditing && (
                <div className="space-y-2">
                    {obbOperations && obbOperations?.length > 0 ?
                        <DataTable
                            data={obbOperations}
                            obbSheetId={obbSheetId}
                            operations={operations}
                            machines={machines}
                        />
                        : (
                            <p className="text-sm mt-2 text-slate-500 italic">
                                No operations available
                            </p>
                        )}
                </div>
            )}
        </div>
    )
}

export default AddObbOperationForm