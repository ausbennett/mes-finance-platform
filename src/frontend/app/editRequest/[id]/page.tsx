"use client";

import NavBar from "../../components/navbar";
import { useEffect, useState } from "react";
import PaymentRequest from "../../newRequest/paymentRequest";
import ReimbursementRequest from "../../newRequest/reimbursementRequest";
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  club: string;
};

type Club = {
  _id: string;
  name: string;
};

export default function EditRequestPage() {
  const { id } = useParams();
  const [radio, setRadio] = useState<"reimbursement" | "payment">("reimbursement");
  const [authToken] = useState<string>("67aa7568a95f30c1a91f8a0a");
  const [status, setStatus] = useState<string>("Pending");
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);

  // Add the missing state declarations
  const [reimbursementFormData, setReimbursementFormData] = useState({
    requestor: "",
    club: "",
    recipients: [{ user: "", amount: "0.00", status: "pending" }],
    totalAmount: "",
    description: "",
    receipts: null as FileList | null,
    status: "Pending"
  });

  const [paymentFormData, setPaymentFormData] = useState({
    requestor: "",
    club: "",
    amount: "",
    description: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  // Memoized maps for quick lookups
  const usersById = useMemo(() => 
    new Map(users.map(user => [user._id, user])),
    [users]
  );

  const clubsById = useMemo(() =>
    new Map(clubs.map(club => [club._id, club])),
    [clubs]
  );

  const formatUserData = (requestorId: string, clubId: string): User => {
    const user = usersById.get(requestorId);
    const club = clubsById.get(clubId);
    
    return {
      _id: requestorId,
      firstName: user?.firstName || "Unknown",
      lastName: user?.lastName || "User",
      email: user?.email || "unknown@example.com",
      club: club?.name || "Unknown Club"
    };
  };

// In page.tsx (EditRequestPage), update the handleSaveChanges function:

const handleSaveChanges = async () => {
  try {
    const isPayment = radio === "payment";
    const endpoint = `${API_BASE_URL}/api/requests/${id}`;
    const hardcodedToken = "67aa7568a95f30c1a91f8a0a"; 

    // Include 'status' in the payload
    const payload = isPayment
      ? {
          ...paymentFormData,
          amount: Number(paymentFormData.amount),
          paymentDate: new Date(paymentFormData.paymentDate).toISOString(),
          status: status, // Add current status
        }
      : {
          ...reimbursementFormData,
          totalAmount: Number(reimbursementFormData.totalAmount),
          recipients: reimbursementFormData.recipients.map(r => ({
            user: r.user,
            amount: Number(r.amount),
          })),
          status: status, // Add current status
        };

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${hardcodedToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Save failed");
    alert("Changes saved!");
  } catch (error) {
    alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
  
  // Helper function to avoid duplication
  const sendRequest = async (endpoint: string, payload: any, authToken: string) => {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.message || "Update failed");
    }
  };

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const [requestRes, usersRes, clubsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/requests/id/${id}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          }),
          fetch(`${API_BASE_URL}/api/users`),
          fetch(`${API_BASE_URL}/api/clubs`)
        ]);

        if (!requestRes.ok) throw new Error(`HTTP error! Status: ${requestRes.status}`);
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        if (!clubsRes.ok) throw new Error("Failed to fetch clubs");

        const data = await requestRes.json();
        const usersData = await usersRes.json();
        const clubsData = await clubsRes.json();

        setUsers(usersData);
        setClubs(clubsData);

        const request = data.request || data;
        if (!request._id) throw new Error("Invalid request format");

        const requestType = request.totalAmount !== undefined ? "reimbursement" : "payment";
        setRadio(requestType);
        setStatus(request.status);

        if (requestType === "reimbursement") {
          setReimbursementFormData({
            ...reimbursementFormData,
            requestor: request.requestor,
            club: request.club || "",
            recipients: (request.recipients || []).map((r: any) => ({
              user: r.user,
              amount: r.amount?.toString() || "0.00",
              status: r.status || "pending"
            })),
            totalAmount: request.totalAmount?.toString() || "",
            description: request.description || "",
            status: request.status
          });
        } else {
          setPaymentFormData({
            ...paymentFormData,
            requestor: request.requestor,
            club: request.club || "",
            amount: request.amount?.toString() || "",
            description: request.description || "",
            paymentDate: request.paymentDate?.split('T')[0] || new Date().toISOString().split("T")[0]
          });
        }

      } catch (error) {
        console.error("Error loading request:", error);
        alert(`Failed to load request: ${error instanceof Error ? error.message : "Unknown error"}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchRequestData();
  }, [id]);

  const reimbursementUser = useMemo(() =>
    formatUserData(reimbursementFormData.requestor, reimbursementFormData.club),
    [reimbursementFormData.requestor, reimbursementFormData.club, users, clubs]
  );

  const paymentUser = useMemo(() =>
    formatUserData(paymentFormData.requestor, paymentFormData.club),
    [paymentFormData.requestor, paymentFormData.club, users, clubs]
  );

  if (isLoading) return <div className="flex justify-center mt-10">Loading...</div>;

  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-gray-200 space-y-10">
      <NavBar />

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="flex flex-col w-2/3 flex-grow space-y-5">
          <div className="flex flex-row justify-between items-center">
            <p className="text-primary-text font-bold text-lg">Edit Request Form</p>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-red-900 text-white px-4 py-2 rounded-md shadow-md cursor-pointer hover:bg-red-800"
            >
              <option value="Approved">Approved</option>
              <option value="Denied">Denied</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex flex-col bg-white p-10 rounded-xl shadow-md space-y-5">
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
        </div>
      </div>

      <div className="fixed bottom-10 right-10">
        <button
          onClick={handleSaveChanges}
          className="bg-red-900 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-800"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}