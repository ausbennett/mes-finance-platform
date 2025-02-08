"use client";

import { useRouter } from "next/navigation";
import NavBar from "../components/navbar";
import Image from "next/image";

export default function UserDashboardPage() {
   const router = useRouter();

   const user: string = "Joe";

   return (
      <>
         <div className="flex flex-col min-h-screen min-w-screen bg-gray-200">
            <NavBar />
            <div className="ml-10 mt-5">
               <p className="text-primary-text font-bold text-xl">
                  Hello {user}, Welcome to the MES Finance Platform
               </p>
            </div>
            <div className="flex flex-col space-y-10 m-10 flex-grow">
               <div className="flex flex-row items-center justify-start bg-foreground text-primary-text px-10 space-x-5 h-32 rounded-xl">
                  <div className="flex flex-none items-center justify-start h-full">
                     <Image
                        src="/document.png"
                        alt="Document"
                        width={70}
                        height={70}
                     />
                  </div>
                  <div className="flex flex-1 items-center justify-start h-full">
                     <p className="text-primary-text font-bold text-md">
                        Submit a new reimbursement or payment request
                     </p>
                  </div>
                  <div className="flex flex-1 items-center justify-end h-full">
                     <button
                        className="bg-primary text-white font-semilbold p-2 rounded-lg w-32 drop-shadow-lg"
                        onClick={() => {
                           router.push("/newRequest");
                        }}
                     >
                        New request
                     </button>
                  </div>
               </div>
               <div className="flex flex-row items-center justify-start bg-foreground text-primary-text px-10 space-x-5 h-32 rounded-xl">
                  <div className="flex flex-none items-center justify-start h-full">
                     <Image
                        src="/box.png"
                        alt="Document"
                        width={70}
                        height={70}
                     />
                  </div>
                  <div className="flex flex-1 items-center justify-start h-full">
                     <p className="text-primary-text font-bold text-md">
                        View your submitted reimbursement and payment requests
                     </p>
                  </div>
                  <div className="flex flex-1 items-center justify-end h-full">
                     <button
                        className="bg-primary text-white font-semilbold p-2 rounded-lg w-32 drop-shadow-lg"
                        onClick={() => {
                           router.push("/viewRequest");
                        }}
                     >
                        View requests
                     </button>
                  </div>
               </div>
               <div className="flex flex-row items-center justify-start bg-foreground text-primary-text px-10 space-x-5 h-32 rounded-xl">
                  <div className="flex flex-none items-center justify-start h-full">
                     <Image
                        src="/audit.png"
                        alt="Document"
                        width={70}
                        height={70}
                     />
                  </div>
                  <div className="flex flex-1 items-center justify-start h-full">
                     <p className="text-primary-text font-bold text-md">
                        Access the audit log for ledger tracking
                     </p>
                  </div>
                  <div className="flex flex-1 items-center justify-end h-full">
                     <button
                        className="bg-primary text-white font-semilbold p-2 rounded-lg w-32 drop-shadow-lg"
                        onClick={() => {
                           router.push("/auditLog");
                        }}
                     >
                        Audit log
                     </button>
                  </div>
               </div>
               <div className="flex flex-row items-center justify-start bg-foreground text-primary-text px-10 space-x-5 h-32 rounded-xl">
                  <div className="flex flex-none items-center justify-start h-full">
                     <Image
                        src="/database.png"
                        alt="Document"
                        width={70}
                        height={70}
                     />
                  </div>
                  <div className="flex flex-1 items-center justify-start h-full">
                     <p className="text-primary-text font-bold text-md">
                        Make changes to club, team or society information
                     </p>
                  </div>
                  <div className="flex flex-1 items-center justify-end h-full">
                     <button
                        className="bg-primary text-white font-semilbold p-2 rounded-lg w-32 drop-shadow-lg"
                        onClick={() => {
                           router.push("/newRequest");
                        }}
                     >
                        Update info
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
