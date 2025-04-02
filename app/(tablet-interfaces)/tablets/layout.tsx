import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";

const RootLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const cookieStore = cookies();
    const token: any = cookieStore.get('AUTH_TOKEN');

    return (
        <section className="min-h-screen w-full">
            <div className="mx-auto max-w-7xl p-4">
                {children}
            </div>
        </section>
    )
}

export default RootLayout;