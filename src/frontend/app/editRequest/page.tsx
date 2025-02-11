"use client";

import NavBar from "../components/navbar";
import { useEffect, useState } from "react";
import PaymentRequest from "../newRequest/paymentRequest";
import ReimbursementRequest from "../newRequest/reimbursementRequest";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"; // Load from environment

export default function EditRequestPage() {
  const [user, setUser] = useState(null);
  const [radio, setRadio] = useState<string>("reimbursement");
  const [authToken, setAuthToken] = useState<string>("67a92f773eaf8368041ae608");
  const [status, setStatus] = useState<string>("Pending"); // Status dropdown state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for request data
  const [reimbursementFormData, setReimbursementFormData] = useState({
    requestor: "", 
    club: "", 
    recipients: [{ user: "", amount: "0.00" }],
    totalAmount: "",
    description: "",
  });

  const [paymentFormData, setPaymentFormData] = useState({
    requestor: "", 
    club: "", 
    amount: "",
    description: "",
    paymentDate: new Date().toISOString().split("T")[0], // Default to today's date
  });

  // Fetch existing request data (replace "requestId" with actual ID when integrating)
  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const requestId = "12345"; // Replace with actual request ID (from router params)
        const response = await fetch(`${API_BASE_URL}/api/requests/${requestId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!response.ok) throw new Error("Failed to fetch request data");

        const data = await response.json();
        setRadio(data.type); // Set type (reimbursement or payment)
        setStatus(data.status); // Set status from request
        if (data.type === "reimbursement") {
          setReimbursementFormData(data);
        } else {
          setPaymentFormData(data);
        }
      } catch (error) {
        console.error("Error fetching request data:", error);
      }
    };

    fetchRequestData();
  }, []);

  const handleSaveChanges = () => {
    // Add your save functionality here, e.g., send data to the server
    console.log("Saving changes...");
  };

  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-gray-200 space-y-10">
      <NavBar />

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="flex flex-col w-2/3 flex-grow space-y-5">
          
          {/* Header with Status Dropdown */}
          <div className="flex flex-row justify-between items-center">
            <p className="text-primary-text font-bold text-lg">Edit Request Form</p>
            
            {/* Status Dropdown */}
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

          {/* Form Section */}
          <div className="flex flex-col bg-white p-10 rounded-xl shadow-md space-y-5">
            {radio === "payment" && (
              <PaymentRequest user={user} formData={paymentFormData} setFormData={setPaymentFormData} />
            )}
            {radio === "reimbursement" && (
              <ReimbursementRequest user={user} formData={reimbursementFormData} setFormData={setReimbursementFormData} />
            )}
          </div>
        </div>
      </div>

      {/* Save Changes Button */}
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
