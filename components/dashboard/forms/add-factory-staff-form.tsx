"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";
import { Staff } from "@prisma/client";
import Link from "next/link";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface AddSewingOperatorFormProps {
    initialData?: Staff | null;
    staffId?: string;
    mode?: string;
}

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z.object({
    designation: z.string().min(1, {
        message: "Designation is required"
    }),
    rfid: z.string().nullable(),
    name: z.string().min(1, {
        message: "Name is required"
    }),
    employeeId: z.string().min(1, {
        message: "Employee ID is required"
    }),
    phone: z.string().regex(phoneRegex, 'Invalid Phone Number!'),
    email: z.string().min(1, {
        message: "Email is required"
    }).email("This is not a valid email!"),
    gender: z.string().min(1, {
        message: "Gender is required"
    }),
});

const AddFactoryStaffForm = ({
    initialData,
    staffId,
    mode
}: AddSewingOperatorFormProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            designation: initialData?.designation || "",
            rfid: initialData?.rfid || "",
            name: initialData?.name || "",
            employeeId: initialData?.employeeId || "",
            phone: initialData?.phone || "",
            email: initialData?.email || "",
            gender: initialData?.gender || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (mode && mode === 'create') {
            try {
                const res = await axios.post('/api/factory-staff', data);
                toast({
                    title: "Successfully created new account",
                    variant: "success",
                    description: (
                        <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                            <code className="text-slate-800">
                                Staff name: {res.data.user.name}
                            </code>
                        </div>
                    ),
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
                const res = await axios.put(`/api/factory-staff/${staffId}`, data);
                toast({
                    title: "Updated successfully",
                    variant: "success",
                });
                router.refresh();
                router.push('/factory-staffs');
            } catch (error: any) {
                console.error("ERROR", error);
                toast({
                    title: error.response.data || "Something went wrong! Try again",
                    variant: "error"
                });
            }
        }
    }

    // Function to update RFID default value based on designation
    const updateRFIDDefaultValue = (designation: string) => {
        let defaultRFID: string = "";
        switch (designation) {
            case "supervisor":
                defaultRFID = "SU-";
                break;
            case "mechanics":
                defaultRFID = "ME-";
                break;
            case "quality-inspector":
                defaultRFID = "QI-";
                break;
        }
        form.setValue("rfid", defaultRFID);
    };

    // Function to disable RFID input for other options
    const shouldDisableRFID = (designation: string) => {
        return !["supervisor", "mechanics", "quality-inspector"].includes(designation);
    };

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
                            name="designation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Designation
                                    </FormLabel>
                                    <Select
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            updateRFIDDefaultValue(value);
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select designation" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="supervisor">Supervisor</SelectItem>
                                            <SelectItem value="line-chief">Line Chief</SelectItem>
                                            <SelectItem value="mechanics">Mechanics</SelectItem>
                                            <SelectItem value="quality-inspector">Quality Inspector</SelectItem>
                                            <SelectItem value="accessories-input-man">Accessories Input man</SelectItem>
                                            <SelectItem value="fabric-input-man">Fabric Input man</SelectItem>
                                            <SelectItem value="production-manager">Production Manager</SelectItem>
                                            <SelectItem value="mechanics-manager">Mechanics Manager</SelectItem>
                                            <SelectItem value="industrial-engineer">Industrial Engineer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rfid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        RFID
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting || shouldDisableRFID(form.getValues("designation"))}
                                            placeholder="e.g. 'SU-XXXXX'"
                                            value={field.value ?? ''}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Name with Initial
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'V. Vinojan'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="employeeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Employee ID
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="Enter employee ID"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Phone
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            disabled={isSubmitting}
                                            placeholder="e.g. '8801XXXNNNNNN'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'example@gmail.com'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Gender
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select gender" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                                Add Staff
                            </Button>
                        </div>
                        :
                        <div className="mt-4 flex justify-between gap-2">
                            <Link href="/factory-staffs">
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

export default AddFactoryStaffForm