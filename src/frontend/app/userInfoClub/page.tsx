"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/context/UserFormContext";
import { useState } from "react";

export default function UserInfoClubPage() {
   const router = useRouter();

   const { updateFormData } = useFormContext();

   const [whoAreYou, setWhoAreYou] = useState<string>("");
   const [club, setClub] = useState<string>("");
   const [clubRole, setRole] = useState<string>("");

   const handleNext = (e: React.FormEvent) => {
      e.preventDefault();
      updateFormData({ club: { whoAreYou, club, clubRole } });
      router.push("/userInfoPayment");
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
               <li className="font-bold">Club</li>
               <li>Payment</li>
            </ul>
         </div>
         <div className="flex flex-col items-start justify-center bg-foreground w-1/2 p-10 rounded-lg drop-shadow-lg space-y-5">
            <p className="text-primary-text font-bold">Club Info</p>
            <label className="form-control w-full">
               <div className="label">
                  <span className="label-text">Who are you? *</span>
               </div>
               <select
                  className="bg-foreground px-3 py-2 rounded-md w-full border-white drop-shadow-md cursor-pointer"
                  defaultValue=""
                  onChange={(e) => {
                     setWhoAreYou(e.target.value);
                  }}
               >
                  <option
                     disabled
                     value=""
                  >
                     Choose one
                  </option>
                  <option>MES Position</option>
                  <option>Ratified Club, Team, Or Program Society</option>
                  <option>Student Projects and New Club Seed Funding</option>
                  <option>Intramurals Funding</option>
                  <option>
                     Conference/Competition Delegate (Open or Affiliate)
                  </option>
               </select>
            </label>
            <label className="form-control w-full">
               <div className="label">
                  <span className="label-text">Club *</span>
               </div>
               <select
                  className="bg-foreground px-3 py-2 rounded-md w-full border-white drop-shadow-md cursor-pointer"
                  defaultValue=""
                  onChange={(e) => {
                     setClub(e.target.value);
                  }}
               >
                  <option
                     disabled
                     value=""
                  >
                     Choose one
                  </option>
                  <option>Software Engineering Society</option>
                  <option>DeltaHacks</option>
                  <option>Engineers Without Borders</option>
                  <option>Women in Engineering, McMaster</option>
               </select>
            </label>
            <label className="form-control w-full">
               <div className="label">
                  <span className="label-text">Role *</span>
               </div>
               <select
                  className="bg-foreground px-3 py-2 rounded-md w-full border-white drop-shadow-md cursor-pointer"
                  defaultValue=""
                  onChange={(e) => {
                     setRole(e.target.value);
                  }}
               >
                  <option
                     disabled
                     value=""
                  >
                     Choose one
                  </option>
                  <option>member</option>
                  <option>president</option>
                  <option>vice-president</option>
                  <option>treasurer</option>
                  <option>secretary</option>
               </select>
            </label>
            <div className="w-full  pt-5">
               <button
                  className="bg-primary text-white font-semilbold p-2 rounded-lg w-full drop-shadow-lg"
                  onClick={handleNext}
               >
                  Next
               </button>
            </div>
         </div>
      </div>
   );
}
