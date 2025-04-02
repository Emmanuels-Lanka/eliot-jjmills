import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AuthFooter from "@/components/auth/auth-footer";

const AuthLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const cookieStore = cookies();
    const token = cookieStore.get('AUTH_TOKEN');

    if (token) {
        return redirect('/dashboard');
    } else {
        return (
            <div className="h-full md:h-screen flex flex-col justify-between w-full bg-slate-900">
                <div className="auth-form flex items-center">
                    {children}
                </div>
                <AuthFooter />
            </div>
        )
    }
}

export default AuthLayout;