"use client";

import NavBar from "../components/navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface Club {
  _id: string;
  name: string;
}

export default function ViewRequestsPage() {
   const router = useRouter();
   const [requests, setRequests] = useState<any[]>([]);
   const [users, setUsers] = useState<User[]>([]);
   const [clubs, setClubs] = useState<Club[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [email, setEmail] = useState<string>("");

   // Create memoized maps for quick lookups
   const usersMap = useMemo(() => new Map(users.map(user => [user._id, user])), [users]);
   const clubsMap = useMemo(() => new Map(clubs.map(club => [club._id, club])), [clubs]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            // Fetch all required data in parallel
            const [requestsRes, usersRes, clubsRes] = await Promise.all([
               fetch("http://localhost:3001/api/requests", { headers: { email: email } }),
               fetch("http://localhost:3001/api/users"),
               fetch("http://localhost:3001/api/clubs") // Add your clubs endpoint
            ]);

            if (!requestsRes.ok) throw new Error("Failed to fetch requests");
            if (!usersRes.ok) throw new Error("Failed to fetch users");
            if (!clubsRes.ok) throw new Error("Failed to fetch clubs");

            const requestsData = await requestsRes.json();
            const usersData = await usersRes.json();
            const clubsData = await clubsRes.json();

            setRequests([
               ...(requestsData.reimbursements || []),
               ...(requestsData.payments || []),
            ]);
            setUsers(usersData);
            setClubs(clubsData);

         } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch data");
         } finally {
            setLoading(false);
         }
      };

      setEmail(sessionStorage.getItem("email") || "");
      fetchData();
   }, []);

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   };

   if (loading) return <div className="flex justify-center mt-10">Loading...</div>;
   if (error) return <div className="flex justify-center mt-10 text-red-500">Error: {error}</div>;

   return (
      <div className="flex flex-col min-h-screen min-w-screen bg-gray-200 space-y-10">
         <NavBar />
         <div className="flex flex-col items-center justify-start flex-grow">
            <div className="flex flex-row items-start justify-start w-full px-10">
               <p className="font-bold text-xl">Submitted Requests</p>
            </div>
            <div className="flex flex-col items-center justify-start flex-grow w-full pt-5 space-y-4 px-10">
               <div className="flex flex-row items-center justify-between w-full space-x-2">
                  <input
                     type="search"
                     placeholder="Search"
                     className="flex-1 bg-white px-4 rounded-xl shadow-md h-10"
                  />
                  <select className="bg-white px-3 rounded-md w-1/4 h-10 border-gray-300 drop-shadow-md cursor-pointer">
                     <option>Sort by:</option>
                     <option>Date</option>
                     <option>Amount</option>
                     <option>Status</option>
                  </select>
               </div>
               {requests.map((request) => {
                  const requester = usersMap.get(request.requestor);
                  const club = clubsMap.get(request.club);
                  const reviewer = usersMap.get(request.reviewer);

                  return (
                     <div
                        key={request._id}
                        className="flex flex-row items-center justify-between bg-white rounded-lg shadow-md w-full h-24 px-5 space-x-10"
                     >
                        <div className="flex flex-1 flex-col">
                           <p className="text-lg">
                              <b>Requester: {requester ? `${requester.firstName} ${requester.lastName}` : "Unknown User"}</b> -{" "}
                              {club?.name || "Unknown Club"}
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
                              {reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : "Unassigned"}
                           </p>
                           <p className="text-md">
                              <b>Budget Line:</b>{" "}
                              {club ? club.name : "General"}
                           </p>
                           <p className="text-sm">
                              <b>Status:</b> {request.status}
                           </p>
                        </div>
                        <div className="flex flex-col items-center justify-center pt-4">
                           <button
                              className="bg-red-900 text-white font-semibold p-2 rounded-lg w-32 drop-shadow-lg hover:bg-red-800"
                              onClick={() => {
                                 router.push(`/editRequest/${request._id}`);
                              }}
                           >
                              View Request
                           </button>
                           <p className="text-sm">
                              <b>ID:</b> {request._id.slice(-4)}
                           </p>
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>
      </div>
   );
}