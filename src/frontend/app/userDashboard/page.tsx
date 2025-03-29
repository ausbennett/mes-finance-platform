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

            <div className="flex flex-col items-center justify-start space-y-10 flex-grow w-full pt-10">
               {/* Heading container */}
               <div className="w-full md:w-3/4 px-4">
                  <p className="text-primary-text font-bold text-xl">
                     Hello {currentUser?.firstName}, Welcome to the MES Finance
                     Platform
                  </p>
               </div>
               {/* Card 1: New Request */}
               <div className="flex flex-col md:flex-row items-center justify-start bg-foreground text-primary-text p-4 md:px-10 space-y-5 md:space-y-0 md:space-x-5 w-[95%] md:w-3/4 h-auto md:h-32 rounded-xl mx-auto">
                  <div className="flex flex-none items-center justify-center md:justify-start w-full md:w-auto">
                     <Image
                        src="/document.png"
                        alt="Document"
                        width={70}
                        height={70}
                     />
                  </div>
                  <div className="flex flex-1 items-center justify-center md:justify-start">
                     <p className="text-primary-text font-bold text-md text-center md:text-left">
                        Submit a new reimbursement or payment request
                     </p>
                  </div>
                  <div className="flex flex-1 items-center justify-center md:justify-end w-full md:w-auto">
                     <button
                        className="bg-primary text-white font-semilbold p-2 rounded-lg w-full md:w-32 drop-shadow-lg"
                        onClick={() => router.push("/newRequest")}
                     >
                        New request
                     </button>
                  </div>
               </div>
               {/* Card 2: View Requests */}
               <div className="flex flex-col md:flex-row items-center justify-start bg-foreground text-primary-text p-4 md:px-10 space-y-5 md:space-y-0 md:space-x-5 w-[95%] md:w-3/4 h-auto md:h-32 rounded-xl mx-auto">
                  <div className="flex flex-none items-center justify-center md:justify-start w-full md:w-auto">
                     <Image
                        src="/box.png"
                        alt="Document"
                        width={70}
                        height={70}
                     />
                  </div>
                  <div className="flex flex-1 items-center justify-center md:justify-start">
                     <p className="text-primary-text font-bold text-md text-center md:text-left">
                        View your submitted reimbursement and payment requests
                     </p>
                  </div>
                  <div className="flex flex-1 items-center justify-center md:justify-end w-full md:w-auto">
                     <button
                        className="bg-primary text-white font-semilbold p-2 rounded-lg w-full md:w-32 drop-shadow-lg"
                        onClick={() => router.push("/viewRequest")}
                     >
                        View requests
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
