"use client";

import NavBar from "../components/navbar";
import { useRouter } from "next/navigation";

export default function ViewRequestsPage() {
   const user: string = "Adam Podolak";

   const router = useRouter();

   return (
      <>
         <div className="flex flex-col min-h-screen min-w-screen bg-gray-200 space-y-10">
            <NavBar />
            <div className="flex flex-col items-center justify-start flex-grow">
               <div className="flex flex-row items-start justify-start w-3/4">
                  <p className="font-bold text-xl">
                     {user}&apos;s submitted Requests
                  </p>
               </div>
               <div className="flex flex-col items-center justify-start flex-grow w-3/4 pt-5 space-y-4">
                  <div className="flex flex-row items-center justify-between w-full space-x-2">
                     <input
                        type="Search"
                        placeholder="search"
                        className="flex-1 bg-foreground px-4 rounded-xl shadow-md h-10"
                     ></input>
                     <select className="bg-foreground px-3 rounded-md w-1/4 h-10 border-white drop-shadow-md cursor-pointer">
                        <option>Sort by:</option>
                     </select>
                  </div>
                  <div className="flex flex-row items-center justify-between bg-foreground rounded-lg shadow-md w-full h-24 px-5 space-x-10">
                     <div className="flex flex-1 flex-col">
                        <p className="text-lg">
                           <b>Requester: John Smith</b> - Baja Racing, Team Lead
                        </p>
                        <p className="text-md">
                           <b>Amount:</b> $12.30
                        </p>
                        <p className="text-sm">
                           <b>Submitted:</b> January 8, 2025
                        </p>
                     </div>
                     <div className="flex flex-col items-end">
                        <p className="text-lg">
                           <b>Reviewer:</b> Adam Podolak
                        </p>
                        <p className="text-md">
                           <b>Budget Line:</b> Clubs
                        </p>
                        <p className="text-sm">
                           <b>Status:</b> pending
                        </p>
                     </div>
                     <div className="flex flex-col items-center justify-center pt-4">
                        <button
                           className="bg-primary text-white font-semilbold p-2 rounded-lg w-32 drop-shadow-lg"
                           onClick={() => {
                              router.push("/newRequest");
                           }}
                        >
                           View Request
                        </button>
                        <p className="text-sm">
                           <b>ID:</b> 42069
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
