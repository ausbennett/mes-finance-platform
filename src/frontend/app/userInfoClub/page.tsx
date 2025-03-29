"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";

export default function UserInfoClubPage() {
   const router = useRouter();

   const [whoAreYou, setWhoAreYou] = useState<string>("");
   const [club, setClub] = useState<string>("");
   const [clubRole, setRole] = useState<string>("");

   const [clubRoles, setClubRoles] = useState<string[]>([]);
   const [clubNames, setClubNames] = useState<string[]>([]);

   useEffect(() => {
      const fetchClubs = async () => {
         try {
            const response = await axios.get(
               "http://localhost:3001/api/clubs/"
            );
            const data = response.data;

            const roles = data
               .filter(
                  (item: any) =>
                     item.whoAreYou === "MES Position" && item.clubRole
               )
               .map((item: any) => item.clubRole);

            const names = data
               .filter(
                  (item: any) =>
                     item.whoAreYou === "Club, Team, or Society" && item.name
               )
               .map((item: any) => item.name);

            setClubRoles(Array.from(new Set(roles)));
            setClubNames(Array.from(new Set(names)));
         } catch (error) {
            console.error("Error fetching clubs:", error);
         }
      };

      fetchClubs();
   }, []);

   const handleNext = (e: React.FormEvent) => {
      e.preventDefault();

      sessionStorage.setItem("whoAreYou", whoAreYou);
      sessionStorage.setItem("club", club);
      sessionStorage.setItem("clubRole", clubRole);
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
         <div className="flex flex-col items-start justify-center bg-foreground w-3/4 md:w-1/2 p-10 rounded-lg drop-shadow-lg space-y-5">
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
                     setClub("");
                     setRole("");
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
               </select>
            </label>

            {whoAreYou === "MES Position" && (
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
                     {clubRoles.map((role) => (
                        <option key={role}>{role}</option>
                     ))}
                  </select>
               </label>
            )}

            {whoAreYou === "Ratified Club, Team, Or Program Society" && (
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
                     {clubNames.map((name) => (
                        <option key={name}>{name}</option>
                     ))}
                  </select>
               </label>
            )}

            <div className="w-full pt-5">
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
