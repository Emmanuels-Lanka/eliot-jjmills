import { JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DashboardFooter from "@/components/dashboard/dashboard-footer";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import Sidebar from "@/components/dashboard/sidebar";

const DashboardLayout = ({
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
    
    const verified = verify(value, secret) as JwtPayload;
    // console.log("ROLE", verified.role);
        
    if (verified.role === 'quality-controller') {
        return redirect('/qc-dashboard');
    } else if (verified.role === 'roming-quality-inspector') {
        return redirect('/roaming-qc');
    } else {
        return (
            <div className="h-screen w-full">
                <div className="flex felx-col h-full w-64 fixed inset-y-0 z-50">
                    <Sidebar role={verified.role}/>
                </div>
                <div className="ml-64 h-full">
                    <div className="sticky top-0 w-full z-10 border-b shadow-sm">
                        <DashboardHeader />
                       
                    </div>
                    <main className="dashboard-body-height px-4">
                        {children}
                    </main>
                    <div className="sticky bottom-0 w-full border-t">
                        <DashboardFooter />
                    </div>
                </div>
            </div>
        )
    }

}

export default DashboardLayout;