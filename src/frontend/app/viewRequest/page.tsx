"use client";

import NavBar from "../components/navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ViewRequestsPage() {
   const router = useRouter();
   const [requests, setRequests] = useState<any[]>([]); // Use `any[]` temporarily
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await fetch("http://localhost:3002/api/requests", {
               headers: {
                  Authorization: `Bearer 67aa7568a95f30c1a91f8a0a`, // Add the token here
               },
            });
            if (!response.ok) throw new Error("Failed to fetch requests");
            const data = await response.json();
            setRequests([
               ...(data.reimbursements || []),
               ...(data.payments || []),
            ]);
         } catch (err) {
            setError(
               err instanceof Error ? err.message : "Failed to fetch requests"
            );
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   };

   if (loading)
      return <div className="flex justify-center mt-10">Loading...</div>;
   if (error)
      return (
         <div className="flex justify-center mt-10 text-red-500">
            Error: {error}
         </div>
      );

   return (
      <>
         <div className="flex flex-col min-h-screen min-w-screen bg-gray-200 space-y-10">
            <NavBar />
            <div className="flex flex-col items-center justify-start flex-grow">
               <div className="flex flex-row items-start justify-start w-3/4">
                  <p className="font-bold text-xl">Submitted Requests</p>
               </div>
               <div className="flex flex-col items-center justify-start flex-grow w-3/4 pt-5 space-y-4">
                  <div className="flex flex-row items-center justify-between w-full space-x-2">
                     <input
                        type="search"
                        placeholder="Search"
                        className="flex-1 bg-foreground px-4 rounded-xl shadow-md h-10"
                     />
                     <select className="bg-foreground px-3 rounded-md w-1/4 h-10 border-white drop-shadow-md cursor-pointer">
                        <option>Sort by:</option>
                        <option>Date</option>
                        <option>Amount</option>
                        <option>Status</option>
                     </select>
                  </div>
                  {requests.map((request) => (
                     <div
                        key={request._id}
                        className="flex flex-row items-center justify-between bg-foreground rounded-lg shadow-md w-full h-24 px-5 space-x-10"
                     >
                        <div className="flex flex-1 flex-col">
                           <p className="text-lg">
                              <b>Requester: {request.requestor}</b> -{" "}
                              {request.club || "General Request"}
                           </p>
                           <p className="text-md">
                              <b>Amount:</b> $
                              {request.totalAmount || request.amount}
                           </p>
                           <p className="text-sm">
                              <b>Submitted:</b> {formatDate(request.createdAt)}
                           </p>
                        </div>
                        <div className="flex flex-col items-end">
                           <p className="text-lg">
                              <b>Reviewer:</b>{" "}
                              {request.reviewer || "Unassigned"}
                           </p>
                           <p className="text-md">
                              <b>Budget Line:</b>{" "}
                              {request.club ? "Clubs" : "General"}
                           </p>
                           <p className="text-sm">
                              <b>Status:</b> {request.status}
                           </p>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-4">
                           <button
                              className="bg-primary text-white font-semilbold p-2 rounded-lg w-32 drop-shadow-lg"
                              onClick={() => {
                                 router.push(`/editRequest/`);
                              }}
                           >
                              View Request
                           </button>
                           <p className="text-sm">
                              <b>ID:</b> {request._id.slice(-4)}
                           </p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </>
   );
}
