"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface AddProductionLineFormProps {
    units: {
        id: string;
        name: string;
    }[];
}

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Production line name is required"
    }).refine((value) => !/[\/@]/.test(value), {
        message: 'Line Name should not include these characters (? , /, #)',
      }),
    unitId: z.string().min(1, {
        message: "Production line unit is required"
    }),
});

const AddProductionLineForm = ({
    units
}: AddProductionLineFormProps) => {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "LINE-113-114",
            unitId: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await axios.post('/api/production-line', data);
            toast({
                title: "Successfully created new line",
                variant: "success",
                description: (
                    <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                        <code className="text-slate-800">
                            Line name: {res.data.data.name}
                        </code>
                    </div>
                ),
            });
            router.refresh();
            form.reset();
            setIsOpen(false)
        } catch (error: any) {
            console.error("ERROR", error);
            toast({
                title: error.response.data || "Something went wrong! Try again",
                variant: "error"
            });
        }
    }

    return (
        <Dialog open={isOpen}>
            <DialogTrigger asChild>
                <Button className="flex gap-2 pr-5" onClick={() => setIsOpen(true)}>
                    <Plus className="w-5 h-5" />
                    Add new line
                </Button>
            </DialogTrigger>
            <DialogContent className="max-md:py-8 md:p-8">
                <DialogHeader className="mt-2">
                    <DialogTitle>
                        Add Production Line
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Add new poduction line for the unit. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-4 mt-4"
                    >
                        <div className="flex gap-2">
                            <div className="w-2/3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                Line name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isSubmitting}
                                                    placeholder="LINE-113-114"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-1/3">
                                <FormField
                                    control={form.control}
                                    name="unitId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base">
                                                Unit
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select the unit" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {units.map((unit) => (
                                                        <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <div className="mt-4 mb-2 flex gap-4">
                                <Button variant='secondary' className="flex gap-2 pr-5" onClick={() => setIsOpen(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    className="flex gap-2 pr-5"
                                >
                                    <Check className={cn("w-5 h-5", isSubmitting && "hidden")} />
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

export default AddProductionLineForm