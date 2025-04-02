import Image from "next/image"

import SidebarRoutes from "./sidebar-routes"
import SignOutButton from "../auth/signout-button"
import Link from "next/link"

const Sidebar = ({ role }: { role: string }) => {
    return (
        <div className="flex flex-col justify-between top-0 bottom-0 left-0 min-h-screen w-full z-50 text-white bg-dark">
            <div className="flex flex-col items-start">
                <div className="w-full px-6 py-3 border-b border-white/15">
                    <Link href="/dashboard">
                        <Image
                            src='/eliot-logo.png'
                            alt="logo"
                            width={140}
                            height={140}
                            className="w-[110px]"
                        />
                    </Link>
                </div>
                <div className=" w-full overflow-y-auto sidebar-routes">
                    <SidebarRoutes role={role}/>
                </div>
            </div>
            <SignOutButton />
        </div>
    )
}

export default Sidebar