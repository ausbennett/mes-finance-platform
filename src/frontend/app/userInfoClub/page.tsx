"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserInfoClubPage() {
   const router = useRouter();

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
               >
                  <option
                     disabled
                     value=""
                  >
                     Choose one
                  </option>
                  <option>test</option>
                  <option>test</option>
                  <option>test</option>
               </select>
            </label>
            <label className="form-control w-full">
               <div className="label">
                  <span className="label-text">Club *</span>
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
                  <option>test</option>
                  <option>test</option>
                  <option>test</option>
               </select>
            </label>
            <label className="form-control w-full">
               <div className="label">
                  <span className="label-text">Role *</span>
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
                  <option>test</option>
                  <option>test</option>
                  <option>test</option>
               </select>
            </label>
            <div className="w-full  pt-5">
               <button
                  className="bg-primary text-white font-semilbold p-2 rounded-lg w-full drop-shadow-lg"
                  onClick={() => router.push("/userInfoPayment")}
               >
                  Next
               </button>
            </div>
         </div>
      </div>
   );
}
