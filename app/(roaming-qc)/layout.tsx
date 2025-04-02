import React from "react";
import { cookies } from "next/headers";
import { JwtPayload, verify } from "jsonwebtoken";
import { redirect } from "next/navigation";
import UserProfileButton from "@/components/auth/user-profile-button";

const RoamingQcLayout = ({
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

    if (verified.role === 'roming-quality-inspector' || verified.role === 'admin') {
        return (
            <div className="mx-auto max-w-screen-xl p-4">
                <div className="mt-4 flex justify-between items-center gap-4">
                    <h2 className="text-xl font-medium text-slate-600">
                        Roaming Quality Inspection System
                    </h2>
                    <UserProfileButton email={verified.email}/>
                </div>
                {children}
            </div>
        )
    } else {
        return redirect('/');
    }
}

export default RoamingQcLayout;