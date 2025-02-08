"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function NavBar() {
   const router = useRouter();

   const currPage = usePathname();

   const user: string = "user";

   const handleDashNav = () => {
      if (user == "admin") {
         router.push("/adminDashboard");
      } else {
         router.push("/userDashboard");
      }
   };

   return (
      <div className="navbar bg-foreground shadow-md px-5 py-3 rounded-xl">
         <div className="flex-1 cursor-pointer">
            <Image
               src="/mesLogo.png"
               alt="MES Logo"
               width={50}
               height={50}
               onClick={handleDashNav}
            />
         </div>
         <div className="flex-none space-x-4">
            {!(
               currPage == "/adminDashboard" || currPage == "/userDashboard"
            ) && <button onClick={handleDashNav}>Dashboard</button>}
            <div
               className="avatar cursor-pointer"
               onClick={() => router.push("/accountInfo")}
            >
               <Image
                  src="/profileIcon.png"
                  alt="Profile"
                  width={40}
                  height={40}
               />
            </div>
         </div>
      </div>
   );
}
