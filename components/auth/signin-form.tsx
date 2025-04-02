"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Zap } from "lucide-react";

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
import Image from "next/image";
import { Separator } from "../ui/separator";

const formSchema = z.object({
    email: z.string().min(1, {
        message: "Gender is required"
    }).email("This is not a valid email!"),
    password: z.string().min(1, 'Password is required').min(8, 'Password must have than 8 characters'),
});

const SignInForm = () => {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const res = await axios.post('/api/auth/sign-in', data);
            
            toast({
                title: res.data,
                variant: "success",
                description: (
                    <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                        <code className="text-slate-800">
                            You&apos;re authenticated, Please wait until redirect to dashboard
                        </code>
                    </div>
                ),
            });


            router.push('/dashboard');
            form.reset();
        } catch (error: any) {
            console.error("ERROR", error);
            toast({
                title: error.response.data || "Something went wrong! Try again",
                variant: "error"
            });
        }
    }

    return (
        <div className="mx-auto max-w-2xl border px-8 md:px-12 pt-8 pb-12 rounded-xl shadow-xl bg-white">
            <div className="w-full mb-8 flex flex-col justify-center items-center">
                <Image 
                    src="/eliot-logo.png"
                    alt="logo"
                    width={200}
                    height={200}
                />
                <p className="text-lg text-slate-900 font-medium">Signin your portal account</p>
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6 mt-6"
                >
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
                                        placeholder="Enter your email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base">
                                    Password
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        disabled={isSubmitting}
                                        placeholder="Enter your password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="w-full">
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="mt-12 flex gap-2 pr-5 w-full text-base"
                        >
                            <KeyRound className={cn("w-5 h-5", isSubmitting && "hidden")} />
                            <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                            Sign in
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default SignInForm