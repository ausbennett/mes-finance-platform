"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function LoginPage() {
   const [email, setEmail] = useState<string>("");
   const [error, setError] = useState<string>("");
   const [users, setUsers] = useState<User[]>([]);
   const router = useRouter();

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

   const validateEmail = (email: string) => {
      return email.endsWith("@mcmaster.ca");
   };

   const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      if (!validateEmail(email)) {
         setError("Please enter a valid McMaster email address");
         return;
      }
      sessionStorage.setItem("email", email);

      console.log("session storage has stored email", email);

      const isUser = users.some((user) => user.email === email);
      const currentUser = users.find((user) => user.email === email);
      const isAdmin = currentUser?.role === "admin";
      sessionStorage.setItem("userRole", isAdmin ? "admin" : "user");

      if (isUser) {
         if (isAdmin) {
            router.push("/adminDashboard");
         } else {
            router.push("/userDashboard");
         }
      } else {
         router.push("/userInfoGeneral");
      }
   };

   return (
      <>
         <div
            id="loginScreenContainer"
            className="flex flex-col md:flex-row min-h-screen min-w-screen bg-background"
         >
            {/* Left grey div visible on tablet/desktop only */}
            <div
               id="loginScreenLeftContainer"
               className="hidden md:block bg-stone-800 md:w-2/5"
            ></div>
            <div
               id="loginScreenFormContainer"
               className="flex flex-col items-center justify-center h-screen w-full md:w-3/5 bg-transparent space-y-5 px-5"
            >
               <Image
                  src="/mesLogo.png"
                  alt="MES Logo"
                  width={150}
                  height={150}
               />

               <div className="flex flex-row w-full items-center justify-center px-5 text-center">
                  <p className="text-primary-text font-bold text-lg">
                     Welcome to the McMaster Engineering Society Reimbursement
                     Platform
                  </p>
               </div>

               <p className="text-secondary-text font-semibold text-sm">
                  Enter your McMaster email to continue
               </p>

               <input
                  type="email"
                  className="bg-foreground px-3 py-2 rounded-md w-full md:w-1/3 border-white drop-shadow-md"
                  placeholder="johnsmith@mcmaster.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onClick={() => setError("")}
               />

               {error && <p className="text-red-500 text-sm">{error}</p>}

               <div className="w-full md:w-1/3">
                  <button
                     onClick={handleSubmit}
                     className="bg-primary text-white font-semilbold p-2 rounded-lg w-full drop-shadow-lg"
                  >
                     Login
                  </button>
               </div>
            </div>
         </div>
      </>
   );
}
