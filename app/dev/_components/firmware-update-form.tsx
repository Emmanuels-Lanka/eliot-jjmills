"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";
import { EliotDevice } from "@prisma/client";

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
import MultiSelectDevices from "./multi-select-devices";
import { updateFirmwareData } from "../_actions/update-firmware-data";

interface FirmwareUpdateFormProps {
    devices: EliotDevice[];
}

const formSchema = z.object({
    eliotSerialNo: z.string().array(),
    firmwareUrl: z.string().min(1, {
        message: "Firmware URL is required"
    }),
});

const FirmwareUpdateForm = ({
    devices
}: FirmwareUpdateFormProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            eliotSerialNo: [],
            firmwareUrl: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await updateFirmwareData(data);
            toast({
                title: "Successfully created new operation",
                variant: "success"
            });
            router.refresh();
            form.setValue("firmwareUrl", "");
            // form.reset();
        } catch (error: any) {
            console.error("ERROR", error);
            toast({
                title: error.response.data || "Something went wrong! Try again",
                variant: "error"
            });
        }
    }

    return (
        <div className={cn('border px-12 pt-6 pb-10 rounded-lg bg-slate-100')}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-8 mt-4"
                >
                    <div className="w-full md:flex gap-8">
                        <div className="md:w-3/5">
                            <FormField
                                control={form.control}
                                name="eliotSerialNo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            ELIoT Devices
                                        </FormLabel>
                                        <FormControl>
                                            <MultiSelectDevices
                                                devices={devices}
                                                onSelectionChange={(device) => {
                                                    field.onChange(device.map(c => c.serialNumber));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="md:w-2/5">
                            <FormField
                                control={form.control}
                                name="firmwareUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Firmware URL
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="Enter the firmware url"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="flex gap-2 pr-5 ml-auto right-0 w-36"
                    >
                        <Zap className={cn("w-5 h-5", isSubmitting && "hidden")} />
                        <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                        Update
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default FirmwareUpdateForm