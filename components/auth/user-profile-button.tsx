'use client'

import Image from "next/image";
import { ArrowLeft, LogOut, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation";
import axios from "axios"; 

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface UserProfileButtonProps {
    email: string | undefined;
    role?: string | undefined;
}

const UserProfileButton = ({
    email,
    role,
}: UserProfileButtonProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            const res = await axios.post('/api/auth/sign-out');
            toast({
                title: "You are signed out!",
                variant: "success"
            });
            router.push('/sign-in');
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
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="hide-dropdown-ring">
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-xl"
                >
                    <Image
                        src="/icons/user-profile.svg"
                        width={48}
                        height={48}
                        alt="Avatar"
                        className="overflow-hidden rounded-full"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                { email &&
                    <DropdownMenuLabel>{email}</DropdownMenuLabel>
                }
                <DropdownMenuSeparator />
                <Link href='/'>
                    <DropdownMenuItem className="p-2">
                        <ArrowLeft className="h-4 w-4 dark-text"/>
                        <p className="ml-2">Back to home</p>
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={()=> window.location.reload()} className="p-2">
                    <RefreshCw className="h-4 w-4 dark-text"/>
                    <p className="ml-2">Refresh</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 p-2">
                    <LogOut className="ml-2 h-5 w-5"/>
                    <p className="ml-2 font-medium p-1">Logout</p>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserProfileButton