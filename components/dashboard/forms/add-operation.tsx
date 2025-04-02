"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";
import { Operation } from "@prisma/client";
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
import { useState } from "react";

interface AddOperationProps {
    initialData?: Operation | null;
    operationId?: string;
    mode?: string;
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Operation name is required"
    }),
    code: z.string().min(1, {
        message: "Operation code is required"
    }),
});

const AddOperation = ({
    initialData,
    operationId,
    mode
}: AddOperationProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            code: initialData?.code || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const inputValue = event.target.value.toUpperCase();
    //     form.setValue("name", inputValue);
    // };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (mode && mode === 'create') {
            try {
                const res = await axios.post('/api/operation', data);
                toast({
                    title: "Successfully created new operation",
                    variant: "success"
                });
                router.refresh();
                form.reset();
            } catch (error: any) {
                console.error("ERROR", error);
                toast({
                    title: error.response.data || "Something went wrong! Try again",
                    variant: "error"
                });
            }
        } else {
            try {
                const res = await axios.put(`/api/operation/${operationId}`, data);
                toast({
                    title: "Updated successfully",
                    variant: "success",
                });
                router.refresh();
                router.push('/operations');
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
        <div className={cn('mx-auto max-w-7xl mt-16 border px-12 pt-6 pb-10 rounded-lg', mode === 'create' ? "bg-slate-100" : "shadow-xl")}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-8 mt-4"
                >
                    <div className="w-full md:flex gap-4">
                        <div className="md:w-3/4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Operation name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="Enter the operation name"
                                                {...field}
                                                // onChange={handleChange}
                                                className="border-slate-300 bg-white"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="md:w-1/4">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Operation code
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="Enter the operation code"
                                                {...field}
                                                // onChange={handleChange}
                                                className="border-slate-300 bg-white"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    {mode && mode === 'create' ?
                        <div className="flex justify-between gap-2">
                            <Button variant='outline' className="flex gap-2 pr-5 text-slate-600 hover:border-slate-300" onClick={() => form.reset()}>
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className="flex gap-2 pr-5"
                            >
                                <Zap className={cn("w-5 h-5", isSubmitting && "hidden")} />
                                <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                                Add Operation
                            </Button>
                        </div>
                        :
                        <div className="flex justify-between gap-2">
                            <Link href="/operations">
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

export default AddOperation