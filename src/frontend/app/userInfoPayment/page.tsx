"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/UserFormContext";
import { useState } from "react";
import axios from "axios";

export default function UserInfoPaymentPage() {
   const router = useRouter();

   const { formData, updateFormData, clearFormData } = useFormContext();

   const [etransferEmail, setETransferEmail] = useState<string>("");
   const [etransferPhone, setETransferPhone] = useState<string>("");

   const [responseID, setReponseID] = useState<string>("");

   const handleFinish = async () => {
      updateFormData({ payment: { etransferEmail, etransferPhone } });

      const token = sessionStorage.getItem("authToken");

      const payload = {
         ...formData.email,
         ...formData.general,
         ...formData.club,
         payment: {
            etransferEmail,
            etransferPhone,
         },
         role: "admin",
      };

      console.log(payload);

      try {
         const response = await axios.post(
            "http://localhost:3002/api/users/",
            payload
         );

         console.log("Form submitted successfully:", response.data);

         sessionStorage.setItem("authToken", response.data._id);

         //clearFormData();

         router.push("/userDashboard");
      } catch (error) {
         console.error("Error submitting form:", error);
      }
   };

   return (
      <div
         id="screenContainer"
         className="flex flex-col items-center justify-center min-h-screen min-w-screen space-y-5 bg-background py-5"
      >
         <Image
            src="/mesLogo.png"
            alt="MES Logo"
            width={100}
            height={100}
         ></Image>
         <p className="text-primary-text font-bold text-lg">
            {"Let's get you started"}
         </p>
         <div className="breadcrumbs text-md">
            <ul>
               <li>General</li>
               <li>Club</li>
               <li className="font-bold">Payment</li>
            </ul>
         </div>
         <div className="flex flex-col items-start justify-center bg-foreground w-1/2 p-10 rounded-lg drop-shadow-lg space-y-5">
            <p className="text-primary-text font-bold">Payment Info</p>
            <label className="form-control w-full">
               <div className="label">
                  <span className="label-text">Payment Method *</span>
               </div>
               <select
                  className="bg-foreground px-3 py-2 rounded-md w-full border-white drop-shadow-md cursor-pointer"
                  defaultValue=""
               >
                  <option
                     disabled
                     value=""
                  >
                     Choose one
                  </option>
                  <option>Interac E-Transfer</option>
                  <option>Direct Deposit</option>
               </select>
            </label>
            <label className="form-control w-full">
               <div className="label">
                  <span className="label-text">E-transfer email *</span>
               </div>
               <input
                  type="email"
                  placeholder="johnsmith@gmail.com"
                  className="bg-foreground px-3 py-2 rounded-md w-full border-white drop-shadow-md"
                  onChange={(e) => {
                     setETransferEmail(e.target.value);
                  }}
               />
            </label>
            <label className="form-control w-full">
               <div className="label">
                  <span className="label-text">E-transfer phone number *</span>
               </div>
               <input
                  type="tel"
                  placeholder="123-456-7890"
                  className="bg-foreground px-3 py-2 rounded-md w-full border-white drop-shadow-md"
                  onChange={(e) => {
                     setETransferPhone(e.target.value);
                  }}
               />
            </label>
            <div className="flex flex-col w-full space-y-3 pt-5">
               <button className="bg-stone-400 text-white font-semilbold p-2 rounded-lg w-full drop-shadow-lg">
                  Add payment method +
               </button>
               <button
                  className="bg-primary text-white font-semilbold p-2 rounded-lg w-full drop-shadow-lg"
                  onClick={handleFinish}
               >
                  Finish
               </button>
            </div>
         </div>
      </div>
   );
}
