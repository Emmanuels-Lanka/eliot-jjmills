"use client"

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Loader2, Zap } from "lucide-react";
import { Operator, SewingMachine, TrafficLightSystem } from "@prisma/client";
import Link from "next/link";
import { ComboBox, Item, Provider, lightTheme } from '@adobe/react-spectrum';
import type { Key } from '@adobe/react-spectrum';

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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface AddQCRecordFormProps {
    machines: SewingMachine[];
    qcEmail: string;
}

type Operators = {
    operatorRfid: string;
    operator: Operator;
}

const formSchema = z.object({
    machineId: z.string().min(1, {
        message: "Sewing machine is required"
    }),
    colour: z.string().min(1, {
        message: "Colour is required"
    }),
    operatorRfid: z.string(),
    obbOperationId: z.string(),
    qcEmail: z.string(),
    roundNo: z.number(),
});

const AddQCRecordForm = ({
    machines,
    qcEmail,
}: AddQCRecordFormProps) => {
    const { toast } = useToast();
    const router = useRouter();
    
    const [selectedColour, setSelectedColour] = useState<string>('');
    const [currentRound, setCurrentRound] = useState<number>(1);
    const [lastRoundColour, setLastRoundColour] = useState<string>('');
    const [tslRecords, setTSLRecords] = useState<TrafficLightSystem[]>([]);
    const [operators, setOperators] = useState<Operators[]>([]);
    const [obbOperationId, setObbOperationId] = useState<string>('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            machineId: "",
            colour: "",
            operatorRfid: "",
            obbOperationId: "",
            qcEmail: qcEmail,
            roundNo: undefined,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await axios.post('/api/quality-control', data);
            toast({
                title: "Created new TLS record",
                variant: "success",
            });
        } catch (error: any) {
            console.error("ERROR", error);
            toast({
                title: error.response.data || "Something went wrong! Try again",
                variant: "error"
            });
        } finally {
            setCurrentRound(currentRound + 1);
            setLastRoundColour(data.colour);
            // form.reset();
        }
    }

    const handleMachineSelection = async (key: Key | null) => {
        const value = key?.toString()
        if (value !== undefined) {
            form.setValue('machineId', value);

            try {
                const response = await axios.get(`/api/quality-control/fetch-tls-and-op?machineId=${value}`);
                setTSLRecords(response.data.tls);
                setOperators(response.data.operators);
                setObbOperationId(response.data.obbOperationId);

                if (response.data.tls.length !== 0) {
                    setCurrentRound(response.data.tls[0].roundNo + 1);
                    setLastRoundColour(response.data.tls[0].colour)
                }
            } catch (error: any) {
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
            } finally {
                router.refresh();
            }
        }
    };

    const handleOperatorSelection = (key: Key | null) => {
        const value = key?.toString()
        if (value !== undefined) {
            form.setValue('operatorRfid', value);
        }
                
        form.setValue('obbOperationId', obbOperationId);

        const currentRound: number = tslRecords.length !== 0 ? tslRecords[0].roundNo + 1 : 1;
        form.setValue('roundNo', currentRound);
    }

    return (
        <section>
            <div className='px-8 py-6 mb-4 border rounded-lg flex justify-between'>
                <p className='text-slate-700'>
                    Current Round : <span className='font-semibold'>{currentRound}</span>
                </p>
                {tslRecords.length !== 0 && 
                    <div className='flex flex-row items-center gap-3'>
                        <p className='text-slate-500 text-sm'>Last round status</p>
                        <div 
                            className={cn(
                                'h-4 w-4 rounded-full border',
                                lastRoundColour === 'red' ? 'bg-[#FF3333]/70 border-red-500' : lastRoundColour === 'orange' ? 'bg-[#FD853A] border-orange-500' : lastRoundColour === 'green' && 'bg-[#17dcb5] border-green-600'
                            )} 
                        />
                    </div>
                }
            </div>
            <Provider theme={lightTheme} colorScheme="light">
                <div className="w-full px-10 pt-6 pb-8 border rounded-lg bg-slate-100">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="w-full space-y-8 mt-4"
                        >
                            <div className="flex flex-col justify-end items-end lg:flex-row gap-x-6 gap-y-8">
                                <div className="max-lg:w-full flex flex-col md:flex-row items-start gap-6">
                                    <FormField
                                        control={form.control}
                                        name="machineId"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-base font-medium">
                                                    Machine
                                                </FormLabel>
                                                <ComboBox
                                                    aria-label="Machine"
                                                    width={260}
                                                    defaultItems={machines}
                                                    selectedKey={field.value}
                                                    onSelectionChange={handleMachineSelection}
                                                    // placeholder="Select a machine"
                                                >
                                                    {machine => {
                                                        const name: string = `${machine.machineId} (${machine.brandName})`
                                                        return (
                                                            <Item key={machine.id}>{name}</Item>
                                                        )
                                                    }}
                                                </ComboBox>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="operatorRfid"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-base font-medium">
                                                    Operator
                                                </FormLabel>
                                                <ComboBox
                                                    aria-label="Operator"
                                                    width={260}
                                                    defaultItems={operators}
                                                    selectedKey={field.value}
                                                    onSelectionChange={handleOperatorSelection}
                                                    // placeholder="Select a machine"
                                                >
                                                    {operator => {
                                                        const name: string = `${operator.operator.name} (${operator.operatorRfid})`
                                                        return (
                                                            <Item key={operator.operatorRfid}>{name}</Item>
                                                        )
                                                    }}
                                                </ComboBox>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="w-full pr-20">
                                    <FormField
                                        control={form.control}
                                        name="colour"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-medium">
                                                    Colour Status
                                                </FormLabel>
                                                <Select 
                                                    onValueChange={(value) => {
                                                        field.onChange(value);
                                                        setSelectedColour(value);
                                                    }} 
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className={cn(
                                                            selectedColour === 'red' ? 'bg-[#FF3333]/5 border-[#FF3333]/80' : 
                                                            selectedColour === 'orange' ? 'bg-[#FD853A]/10 border-[#FD853A]' : 
                                                            selectedColour === 'green' && 'bg-[#17dcb5]/10 border-[#17dcb5]'
                                                        )}
                                                        >
                                                            <SelectValue placeholder="Select colour" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="red">Red</SelectItem>
                                                        <SelectItem value="orange">Orange</SelectItem>
                                                        <SelectItem value="green">Green</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className={cn(
                                    "w-14 h-14 bg-slate-500 rounded-lg absolute",
                                    selectedColour === 'red' ? 'bg-red-500' : selectedColour === 'orange' ? 'bg-[#FD853A]' : selectedColour === 'green' && 'bg-green-500'
                                )}/>
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <Link href='/qc-dashboard'>
                                    <Button variant='outline' className="flex gap-2 pr-5" onClick={() => { router.refresh() }}>
                                        Reset Line
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    className="flex items-center gap-2 pr-5 md:w-40 text-base font-medium"
                                >
                                    <Zap className={cn("w-5 h-5", isSubmitting && "hidden")} />
                                    <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </Provider>
        </section>
    )
}

export default AddQCRecordForm