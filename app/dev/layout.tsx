import { JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardFooter from "@/components/dashboard/dashboard-footer";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import SignOutButton from "@/components/auth/signout-button";

const QcDashboardLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const cookieStore = cookies();
    const token = cookieStore.get('AUTH_TOKEN');

    if (!token) {
        return redirect('/sign-in');
    }

    const { value } = token;
    const secret = process.env.JWT_SECRET || "";

    let verifiedUser = verify(value, secret) as JwtPayload;
        
    // if (typeof verifiedUser === 'object' && ('email' || 'role') in verifiedUser) {      // Assuming email and role are properties in the payload
    //     if (verifiedUser.email !== 'vinojan02abhimanyu@gmail.com') {
    //         return redirect('/dashboard');
    //     }
    // }
    
    return (
        <div className="h-screen w-full">
            <div className="sticky top-0 w-full h-16 px-4 md:px-20 z-10 flex justify-between items-center border-b shadow-sm bg-white">
                <div className="flex flex-row justify-center items-center gap-3">
                    <Image
                        src="/eliot-logo.png"
                        alt="logo"
                        width={180}
                        height={180}
                        className="w-[120px] ml-2 cursor-pointer"
                    />
                    <Separator className="h-10 w-0.5 max-md:hidden" />
                    <p className="font-medium text-slate-600 text-lg max-md:hidden">Eliot Firmware Update</p>
                </div>
                <p className="text-sm text-slate-600 max-lg:hidden">{verifiedUser.email}</p>
                <SignOutButton mode='qc' />
            </div>
            <main className="mx-auto max-w-7xl dashboard-body-height p-4 mb-10">
                {children}
            </main>
            <div className="sticky bottom-0 w-full h-10 border-t max-sm:hidden">
                <DashboardFooter />
            </div>
        </div>
    )
}

export default QcDashboardLayout;