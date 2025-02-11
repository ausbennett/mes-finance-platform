"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useFormContext } from "@/context/UserFormContext";

export default function LoginPage() {
   const { updateFormData } = useFormContext();

   const [email, setEmail] = useState<string>("");
   const [error, setError] = useState<string>("");
   const [authToken, setAuthToken] = useState<string>("");
   const router = useRouter();

   const validateEmail = (email: string) => {
      return email.endsWith("@mcmaster.ca");
   };

   const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      if (!validateEmail(email)) {
         setError("Please enter a valid McMaster email address");
         return;
      }
      setError("");
      if (authToken) {
         sessionStorage.setItem("authToken", authToken);
      }
      updateFormData({ email: { email } });
      router.push("/userInfoGeneral");
   };
    
    //dynamically set session storage auth token
    useEffect(()=>{
      sessionStorage.setItem("authToken",authToken)
      console.log("SESSION TOKEN:", authToken)
    },[authToken])

   return (
      <>
         <div
            id="loginScreenContainer"
            className="flex flex-row min-h-screen min-w-screen bg-background"
         >
            <div
               id="loginScreenLeftContainer"
               className="bg-stone-800 min-h-screen w-2/5"
            ></div>
            <div
               id="loginScreenFormContainer"
               className="flex flex-col items-center justify-center h-screen w-3/5 bg-transparent space-y-5"
            >
               <Image
                  src="/mesLogo.png"
                  alt="MES Logo"
                  width={150}
                  height={150}
               ></Image>

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
                  className="bg-foreground px-3 py-2 rounded-md w-1/3 border-white drop-shadow-md"
                  placeholder="johnsmith@mcmaster.ca"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onClick={() => setError("")}
               ></input>

               {error && <p className="text-red-500 text-sm">{error}</p>}

               <div className="w-1/3">
                  <button
                     onClick={handleSubmit}
                     className="bg-primary text-white font-semilbold p-2 rounded-lg w-full drop-shadow-lg"
                  >
                     Login
                  </button>
               </div>

               {/* Temporary Auth Token Dropdown */}
               <div className="w-1/3 mt-4">
                  <label className="text-secondary-text font-semibold text-sm">
                     Select Auth Token:
                  </label>
                  <select
                     className="bg-foreground px-3 py-2 rounded-md w-full border-white drop-shadow-md"
                     value={authToken}
                     onChange={(e) => setAuthToken(e.target.value)}
                  >
                     <option value="">Select Token</option>
                     <option value="67aa7568a95f30c1a91f8a0a">
                        Admin Token
                     </option>
                     <option value="67a9109e9b49fd74280caf86">
                        Student Token
                     </option>
                     <option value="67aa7568a95f30c1a91f8a0a">Evan Admin ****8a0a</option>
                  </select>
               </div>
            </div>
         </div>
      </>
   );
}
