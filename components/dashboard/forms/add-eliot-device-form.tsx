"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";
import { EliotDevice } from "@prisma/client";
import Link from "next/link";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface AddEliotDeviceFormProps {
    initialData?: EliotDevice | null;
    deviceId?: string;
    mode?: string;
}

const formSchema = z.object({
    serialNumber: z.string().min(1, {
        message: "Serial Number is required"
    }),
    modelNumber: z.string().min(1, {
        message: "Model Number is required"
    }),
    installedDate: z.date(),
});

const AddEliotDeviceForm = ({
    initialData,
    deviceId,
    mode
}: AddEliotDeviceFormProps) => {
    const { toast } = useToast();
    const router = useRouter();

    // Type: String to Date
    const formatedDate = initialData?.installedDate ? new Date(initialData.installedDate) : undefined

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serialNumber: initialData?.serialNumber || "ELIoT-",
            modelNumber: initialData?.modelNumber || "",
            installedDate: formatedDate || undefined,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (mode && mode === 'create') {
            try {
                const res = await axios.post('/api/eliot-device', data);
                toast({
                    title: "Successfully created new device",
                    variant: "success"
                });
                form.reset();
                router.refresh();
            } catch (error: any) {
                console.error("ERROR", error);
                toast({
                    title: error.response.data || "Something went wrong! Try again",
                    variant: "error"
                });
            }
        } else {
            try {
                const res = await axios.put(`/api/eliot-device/${deviceId}`, data);
                toast({
                    title: "Updated successfully",
                    variant: "success",
                });
                router.push('/eliot-devices');
                router.refresh();
            } catch (error: any) {
                console.error("ERROR", error);
                toast({
                    title: error.response.data || "Something went wrong! Try again",
                    variant: "error"
                });
            }
        }
    }

    return (
        <div className='mx-auto max-w-7xl mt-16 border px-12 pt-6 pb-10 rounded-lg shadow-xl'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6 mt-4"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                        <FormField
                            control={form.control}
                            name="serialNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Serial Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'ELIoT-xxx'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="modelNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Model Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'ELIOTXXXX'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="installedDate"
                            render={({ field }: { field: FieldValues['fields']['date'] }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Installed Date
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            disabled={isSubmitting}
                                            placeholder="Enter installed date."
                                            {...field}
                                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                            onChange={(e) => {
                                                const selectedDate = new Date(e.target.value);
                                                form.setValue('installedDate', selectedDate, { shouldValidate: true, shouldDirty: true });
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {mode && mode === 'create' ? 
                        <div className="mt-4 flex justify-between gap-2">
                            <Button variant='outline' className="flex gap-2 pr-5" onClick={() => form.reset()}>
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className="flex gap-2 pr-5"
                            >
                                <Zap className={cn("w-5 h-5", isSubmitting && "hidden")} />
                                <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                                Add Device
                            </Button>
                        </div>
                        :
                        <div className="mt-4 flex justify-between gap-2">
                            <Link href="/eliot-devices">
                                <Button variant='outline' className="flex gap-2 pr-5 text-red-600">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className="flex gap-2 pr-5"
                            >
                                <Zap className={cn("w-5 h-5", isSubmitting && "hidden")} />
                                <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                                Update
                            </Button>
                        </div>
                    }
                </form>
            </Form>
        </div>
    )
}

export default AddEliotDeviceForm