"use client";

import { useRouter } from "next/navigation";
import NavBar from "../components/navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserDashboardPage() {
   const router = useRouter();
   const [users, setUsers] = useState<User[]>([]);

   interface User {
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      whoAreYou: string;
      club: string;
      clubRole: string;
      role: string;
      plaid: any[]; // Replace `any` with the actual structure if you know it
      payment: {
         etransferEmail: string;
         etransferPhone: string;
      };
      createdAt: string;
      updatedAt: string;
      __v: number;
   }

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get(
               "http://localhost:3001/api/users/"
            );

            setUsers(response.data);
         } catch (error) {
            if (axios.isAxiosError(error)) {
               console.error(
                  "Axios error:",
                  error.response?.data || error.message
               );
            } else {
               console.error("Unexpected error:", error);
            }
         }
      };

      fetchData();
   }, []);

   const currentUser = users.find(
      (user) => user.email === sessionStorage.getItem("email")
   );
   return (
      <>
         <div className="flex flex-col min-h-screen min-w-screen bg-gray-200">
            <NavBar />

            <div className="flex flex-col items-center justify-start space-y-10 flex-grow w-full py-10">
               <div className="w-3/4">
                  <p className="text-primary-text font-bold text-xl">
                     Hello {currentUser?.firstName}, Welcome to the MES Finance
                     Platform
                  </p>
               </div>
               <div className="flex flex-row items-center justify-start bg-foreground text-primary-text px-10 space-x-5 w-3/4 h-32 rounded-xl">
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
               <div className="flex flex-row items-center justify-start bg-foreground text-primary-text px-10 space-x-5 w-3/4 h-32 rounded-xl">
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
               <div className="flex flex-row items-center justify-start bg-foreground text-primary-text px-10 space-x-5 w-3/4 h-32 rounded-xl">
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
               <div className="flex flex-row items-center justify-start bg-foreground text-primary-text px-10 space-x-5 w-3/4 h-32 rounded-xl">
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
                           router.push("/updateClubs");
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
