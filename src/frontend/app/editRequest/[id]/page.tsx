"use client";

import NavBar from "../../components/navbar";
import { useEffect, useState } from "react";
import PaymentRequest from "../../newRequest/paymentRequest";
import ReimbursementRequest from "../../newRequest/reimbursementRequest";
import { useParams } from "next/navigation";
import { useMemo } from "react";

const API_BASE_URL =
   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

type User = {
   _id: string;
   firstName: string;
   lastName: string;
   email: string;
   club: string;
   role?: string;
};

type Club = {
   _id: string;
   name: string;
};

type Receipient = {
   user: string;
   amount: string;
   status: string;
};

export default function EditRequestPage() {
   const { id } = useParams();
   const [radio, setRadio] = useState<"reimbursement" | "payment">(
      "reimbursement"
   );
   const [authToken] = useState<string>("67aa7568a95f30c1a91f8a0a");
   const [email, setEmail] = useState<string>("");
   const [status, setStatus] = useState<string>("Pending");
   const [isLoading, setIsLoading] = useState(true);
   const [users, setUsers] = useState<User[]>([]);
   const [clubs, setClubs] = useState<Club[]>([]);

   const [reimbursementFormData, setReimbursementFormData] = useState({
      requestor: "",
      club: "",
      recipients: [{ user: "", amount: "0.00", status: "pending" }],
      totalAmount: "",
      description: "",
      receipts: null as FileList | null,
      status: "Pending",
      reviewer: "",
   });

   const [paymentFormData, setPaymentFormData] = useState({
      requestor: "",
      club: "",
      amount: "",
      description: "",
      paymentDate: new Date().toISOString().split("T")[0],
      reviewer: "",
   });

   const usersById = useMemo(
      () => new Map(users.map((user) => [user._id, user])),
      [users]
   );

   const usersByEmail = useMemo(
      () => new Map(users.map((user) => [user.email, user._id])),
      [users]
   );

   const clubsById = useMemo(
      () => new Map(clubs.map((club) => [club._id, club])),
      [clubs]
   );

   const currentUser = useMemo(() => {
      return users.find((u) => u.email === email);
   }, [users, email]);

   const formatUserData = (requestorId: string, clubId: string): User => {
      const user = usersById.get(requestorId);
      const club = clubsById.get(clubId);

      return {
         _id: requestorId,
         firstName: user?.firstName || "Unknown",
         lastName: user?.lastName || "User",
         email: user?.email || "unknown@example.com",
         club: club?.name || "Unknown Club",
      };
   };

   const handleSaveChanges = async () => {
      try {
         const isAdmin = currentUser?.role === "admin";
         const isPayment = radio === "payment";
         const endpoint = `${API_BASE_URL}/api/requests/id/${id}`;

         const payload = isPayment
            ? {
                 ...paymentFormData,
                 amount: Number(paymentFormData.amount),
                 paymentDate: new Date(
                    paymentFormData.paymentDate
                 ).toISOString(),
                 status: status,
              }
            : {
                 ...reimbursementFormData,
                 totalAmount: Number(reimbursementFormData.totalAmount),
                 recipients: reimbursementFormData.recipients.map((r) => {
                    const userId = usersByEmail.get(r.user);
                    if (!userId) throw new Error(`Invalid email: ${r.user}`);

                    return {
                       user: userId,
                       amount: Number(r.amount),
                       status: r.status,
                    };
                 }),
                 status: status,
              };

         const finalPayload = isAdmin
            ? payload
            : {
                 ...payload,
                 reviewer: undefined,
              };

         const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               email: email,
            },
            body: JSON.stringify(finalPayload),
         });

         if (!response.ok) throw new Error("Save failed");
         alert("Changes saved!");
      } catch (error) {
         alert(
            `Error: ${error instanceof Error ? error.message : "Unknown error"}`
         );
      }
   };

   useEffect(() => {
      const fetchRequestData = async () => {
         try {
            const userEmail = sessionStorage.getItem("email") || "";
            setEmail(userEmail);

            const [requestRes, usersRes, clubsRes] = await Promise.all([
               fetch(`${API_BASE_URL}/api/requests/id/${id}`),
               fetch(`${API_BASE_URL}/api/users`),
               fetch(`${API_BASE_URL}/api/clubs`),
            ]);

            if (!requestRes.ok || !usersRes.ok || !clubsRes.ok) {
               throw new Error("Failed to fetch data");
            }

            const [requestData, usersData, clubsData] = await Promise.all([
               requestRes.json(),
               usersRes.json(),
               clubsRes.json(),
            ]);

            setUsers(usersData);
            setClubs(clubsData);

            const request = requestData.request || requestData;
            const usersMap = new Map(
               usersData.map((user: User) => [user._id, user])
            );

            const requestType =
               request.totalAmount !== undefined ? "reimbursement" : "payment";
            setRadio(requestType);
            setStatus(request.status);

            if (requestType === "reimbursement") {
               setReimbursementFormData({
                  ...reimbursementFormData,
                  requestor: request.requestor,
                  club: request.club || "",
                  reviewer: request.reviewer || "",
                  recipients: (request.recipients || []).map((r: any) => ({
                     user: usersMap.get(r.user)?.email || "",
                     amount: r.amount?.toString() || "0.00",
                     status: r.status || "pending",
                  })),
                  totalAmount: request.totalAmount?.toString() || "",
                  description: request.description || "",
                  status: request.status,
               });
            } else {
               setPaymentFormData({
                  ...paymentFormData,
                  requestor: request.requestor,
                  club: request.club || "",
                  reviewer: request.reviewer || "",
                  amount: request.amount?.toString() || "",
                  description: request.description || "",
                  paymentDate:
                     request.paymentDate?.split("T")[0] ||
                     new Date().toISOString().split("T")[0],
               });
            }
         } catch (error) {
            console.error("Error loading request:", error);
            alert(
               `Failed to load request: ${
                  error instanceof Error ? error.message : "Unknown error"
               }`
            );
         } finally {
            setIsLoading(false);
         }
      };

      if (id) fetchRequestData();
   }, [id]);

   const reimbursementUser = useMemo(
      () =>
         formatUserData(
            reimbursementFormData.requestor,
            reimbursementFormData.club
         ),
      [
         reimbursementFormData.requestor,
         reimbursementFormData.club,
         users,
         clubs,
      ]
   );

   const paymentUser = useMemo(
      () => formatUserData(paymentFormData.requestor, paymentFormData.club),
      [paymentFormData.requestor, paymentFormData.club, users, clubs]
   );

   if (isLoading) {
      return (
         <div className="flex items-center justify-center h-screen bg-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-900"></div>
         </div>
      );
   }

   return (
      <div className="flex flex-col min-h-screen bg-gray-200 space-y-10 pb-6 overflow-x-hidden">
         <NavBar />

         <div className="flex flex-col items-center flex-grow px-4 md:px-10">
            <div className="w-full max-w-6xl">
               <div className="flex flex-row justify-between items-center py-4 gap-4">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                     Edit Request Form
                  </h1>

                  {currentUser?.role !== "user" && (
                     <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="bg-red-900 text-white px-4 py-2 rounded-md shadow-md cursor-pointer hover:bg-red-800 md:w-48"
                     >
                        <option value="Approved">Approved</option>
                        <option value="Denied">Denied</option>
                        <option value="Pending">Pending</option>
                        <option value="Closed">Closed</option>
                     </select>
                  )}
               </div>

               <div className="bg-white rounded-xl shadow-md p-6 md:p-10 space-y-6">
                  {radio === "payment" ? (
                     <PaymentRequest
                        user={paymentUser}
                        formData={paymentFormData}
                        setFormData={setPaymentFormData}
                     />
                  ) : (
                     <ReimbursementRequest
                        user={reimbursementUser}
                        formData={reimbursementFormData}
                        setFormData={setReimbursementFormData}
                     />
                  )}
               </div>

               <div className="mt-8 flex justify-end">
                  <button
                     onClick={handleSaveChanges}
                     className="bg-red-900 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-800"
                  >
                     Save Changes
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}
