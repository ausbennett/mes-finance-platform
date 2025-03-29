"use client";

import NavBar from "../components/navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

interface User {
   _id: string;
   firstName: string;
   lastName: string;
   email: string;
   role: string;
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
   const [searchQuery, setSearchQuery] = useState("");
   const [sortBy, setSortBy] = useState("");

   const usersMap = useMemo(
      () => new Map(users.map((user) => [user._id, user])),
      [users]
   );
   const clubsMap = useMemo(
      () => new Map(clubs.map((club) => [club._id, club])),
      [clubs]
   );

   const currentUser = useMemo(() => {
      return users.find((user) => user.email === email);
   }, [users, email]);

   const isAdmin = currentUser?.role === "admin";

   const filteredRequests = useMemo(() => {
      return requests.filter((request) => {
         const requesterId = request.requestor || request.user;
         const requester = usersMap.get(requesterId);
         const requesterName = requester
            ? `${requester.firstName} ${requester.lastName}`.toLowerCase()
            : "";
         if (!requesterName.includes(searchQuery.toLowerCase())) {
            return false;
         }
         if (!isAdmin && requester?.email !== email) {
            return false;
         }

         return true;
      });
   }, [requests, usersMap, searchQuery, isAdmin, email]);

   const reimbursements = useMemo(
      () => filteredRequests.filter((request) => "totalAmount" in request),
      [filteredRequests]
   );
   const payments = useMemo(
      () => filteredRequests.filter((request) => !("totalAmount" in request)),
      [filteredRequests]
   );

   const sortedReimbursements = useMemo(() => {
      const sorted = [...reimbursements];
      switch (sortBy) {
         case "Date":
            sorted.sort(
               (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
            );
            break;
         case "Amount":
            sorted.sort((a, b) => b.totalAmount - a.totalAmount);
            break;
         case "Status":
            sorted.sort((a, b) =>
               (a.status || "").localeCompare(b.status || "")
            );
            break;
      }
      return sorted;
   }, [reimbursements, sortBy]);

   const sortedPayments = useMemo(() => {
      const sorted = [...payments];
      switch (sortBy) {
         case "Date":
            sorted.sort(
               (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
            );
            break;
         case "Amount":
            sorted.sort((a, b) => b.amount - a.amount);
            break;
         case "Status":
            sorted.sort((a, b) =>
               (a.status || "").localeCompare(b.status || "")
            );
            break;
      }
      return sorted;
   }, [payments, sortBy]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [requestsRes, usersRes, clubsRes] = await Promise.all([
               fetch("http://localhost:3001/api/requests", {
                  headers: { email: email },
               }),
               fetch("http://localhost:3001/api/users"),
               fetch("http://localhost:3001/api/clubs"),
            ]);

            if (!requestsRes.ok) throw new Error("Failed to fetch requests");
            if (!usersRes.ok) throw new Error("Failed to fetch users");
            if (!clubsRes.ok) throw new Error("Failed to fetch clubs");

            setEmail(sessionStorage.getItem("email") || "");
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
            setError(
               err instanceof Error ? err.message : "Failed to fetch data"
            );
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

   if (loading) {
      return (
         <div className="flex items-center justify-center h-screen bg-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-900"></div>
         </div>
      );
   }

   if (error)
      return (
         <div className="flex justify-center mt-10 text-red-500">
            Error: {error}
         </div>
      );

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
                     placeholder="Search by requester name..."
                     className="flex-1 bg-white px-4 rounded-xl shadow-md h-10"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="bg-white px-3 rounded-md w-1/4 h-10 border-gray-300 drop-shadow-md cursor-pointer"
                  >
                     <option value="">Sort by:</option>
                     <option value="Date">Date</option>
                     <option value="Amount">Amount</option>
                     <option value="Status">Status</option>
                  </select>
               </div>

               {sortedReimbursements.length > 0 && (
                  <>
                     <div className="w-full">
                        <p className="font-bold text-lg pl-5">
                           Reimbursement Requests
                        </p>
                     </div>
                     {sortedReimbursements.map((request) => (
                        <RequestItem
                           key={request._id}
                           request={request}
                           usersMap={usersMap}
                           clubsMap={clubsMap}
                           formatDate={formatDate}
                           router={router}
                        />
                     ))}
                  </>
               )}

               {sortedPayments.length > 0 && (
                  <>
                     <div className="w-full">
                        <p className="font-bold text-lg pl-5">
                           Payment Requests
                        </p>
                     </div>
                     {sortedPayments.map((request) => (
                        <RequestItem
                           key={request._id}
                           request={request}
                           usersMap={usersMap}
                           clubsMap={clubsMap}
                           formatDate={formatDate}
                           router={router}
                        />
                     ))}
                  </>
               )}
            </div>
         </div>
      </div>
   );
}

function RequestItem({ request, usersMap, clubsMap, formatDate, router }: any) {
   const requester = usersMap.get(request.requestor);
   const club = clubsMap.get(request.club);
   const reviewer = usersMap.get(request.reviewer);

   return (
      <div className="flex flex-row items-center justify-between bg-white rounded-lg shadow-md w-full h-24 px-5 space-x-10">
         <div className="flex flex-1 flex-col">
            <p className="text-lg">
               <b>
                  Requester:{" "}
                  {requester
                     ? `${requester.firstName} ${requester.lastName}`
                     : "Unknown User"}
               </b>{" "}
               - {club?.name || "Unknown Club"}
            </p>
            <p className="text-md">
               <b>Amount:</b> ${request.totalAmount || request.amount}
            </p>
            <p className="text-sm">
               <b>Submitted:</b> {formatDate(request.createdAt)}
            </p>
         </div>
         <div className="flex flex-col items-end">
            <p className="text-lg">
               <b>Reviewer:</b>{" "}
               {reviewer
                  ? `${reviewer.firstName} ${reviewer.lastName}`
                  : "Unassigned"}
            </p>
            <p className="text-md">
               <b>Budget Line:</b> {club ? club.name : "General"}
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
}
