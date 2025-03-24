"use client";

import NavBar from "../../components/navbar";
import { useEffect, useState } from "react";
import PaymentRequest from "../../newRequest/paymentRequest";
import ReimbursementRequest from "../../newRequest/reimbursementRequest";
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

type MinimalUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  club?: string;
};

export default function EditRequestPage() {
  const { id } = useParams();
  const [radio, setRadio] = useState<"reimbursement" | "payment">("reimbursement");
  const [authToken] = useState<string>("67aa7568a95f30c1a91f8a0a");
  const [status, setStatus] = useState<string>("Pending");
  const [isLoading, setIsLoading] = useState(true);

  // Update state types to match component expectations
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

  const formatUserData = (requestorId: string, clubId: string): MinimalUser => ({
    _id: requestorId,
    firstName: "Loading...",
    lastName: "User",
    email: "user@example.com",
    club: clubId
  });

  const handleSaveChanges = async () => {
    try {
      const isPayment = radio === "payment";
      const endpoint = `${API_BASE_URL}/api/requests/${id}`;
      const requestData = isPayment ? paymentFormData : reimbursementFormData;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          ...requestData,
          type: radio,
          status: status
        }),
      });

      if (!response.ok) throw new Error("Failed to save changes");
      
      const result = await response.json();
      console.log("Changes saved successfully:", result);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Failed to save changes. Please try again.");
    }
  };

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
  
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        console.log("API Response:", data);
  
        // Handle nested request object structure
        const request = data.request || data;
        if (!request._id) throw new Error("Invalid request format");
  
        // Determine type based on presence of totalAmount field
        const requestType = request.totalAmount !== undefined ? "reimbursement" : "payment";
  
        setRadio(requestType);
        setStatus(request.status);
  
        if (requestType === "reimbursement") {
          setReimbursementFormData({
            requestor: request.requestor,
            club: request.club || "",
            recipients: (request.recipients || []).map((r: any) => ({
              user: r.user,
              amount: r.amount?.toString() || "0.00",
              status: r.status || "pending"
            })),
            totalAmount: request.totalAmount?.toString() || "",
            description: request.description || "",
            receipts: null,
            status: request.status
          });
        } else {
          setPaymentFormData({
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
  }, [id]); // Keep id as the only dependency
  
  const reimbursementUser = useMemo(() => ({
    _id: reimbursementFormData.requestor,
    firstName: "First",
    lastName: "Last",
    email: "user@example.com",
    club: reimbursementFormData.club
  }), [reimbursementFormData.requestor, reimbursementFormData.club]);
  
  const paymentUser = useMemo(() => ({
    _id: paymentFormData.requestor,
    firstName: "First",
    lastName: "Last",
    email: "user@example.com",
    club: paymentFormData.club
  }), [paymentFormData.requestor, paymentFormData.club]);

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