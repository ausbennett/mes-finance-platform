"use client";

import NavBar from "../components/navbar";
import { useEffect, useState, useMemo } from "react";
import PaymentRequest from "./paymentRequest";
import ReimbursementRequest from "./reimbursementRequest";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

export default function NewRequestPage() {
  const [user, setUser] = useState<any>(null);
  const [radio, setRadio] = useState<string>("reimbursement");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clubs, setClubs] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  // Get email from sessionStorage
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email") || "";
    setEmail(storedEmail);
  }, []);

  // Memoized club name lookup
  const clubsById = useMemo(() => 
    new Map(clubs.map(club => [club._id, club.name])),
    [clubs]
  );

  // Generate display name from email
  const getDisplayName = (email: string) => {
    if (!email) return "Unknown User";
    const [namePart] = email.split("@");
    return namePart
      .split(".")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Fetch user and club data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, clubsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/users/me`, {
            headers: { email: email }
          }),
          fetch(`${API_BASE_URL}/api/clubs`)
        ]);

        if (!userRes.ok || !clubsRes.ok) throw new Error("Failed to fetch data");
        
        const userData = await userRes.json();
        const clubsData = await clubsRes.json();

        setUser(userData);
        setClubs(clubsData);

        // Update form data with IDs but display names in UI
        setReimbursementFormData(prev => ({
          ...prev,
          requestor: userData._id,
          club: clubsById.get(userData.club) || "General Request" // Store name instead of ID
        }));
        
        setPaymentFormData(prev => ({
          ...prev,
          requestor: userData._id,
          club: clubsById.get(userData.club) || "General Request" // Store name instead of ID
        }));

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (email) fetchData();
  }, [email]);

  // Form data states (now storing names)
  const [reimbursementFormData, setReimbursementFormData] = useState({
    requestor: "",
    club: "", // Now stores club name
    recipients: [{ user: "", amount: "0.00" }],
    totalAmount: "",
    description: "",
  });

  const [paymentFormData, setPaymentFormData] = useState({
    requestor: "",
    club: "", // Now stores club name
    amount: "",
    description: "",
    paymentDate: new Date().toISOString().split("T")[0],
  });

  const handleRadioSelect = (value: string) => {
    setRadio(radio === value ? "" : value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = radio === "reimbursement"
        ? `${API_BASE_URL}/api/requests/reimbursement/`
        : `${API_BASE_URL}/api/requests/payment/`;

      // Use the club name directly from formData
      const requestData = radio === "reimbursement" ? {
        ...reimbursementFormData,
        requestor: user._id
      } : {
        ...paymentFormData,
        requestor: user._id
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          email: email
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) throw new Error("Failed to submit request");
      
      const result = await response.json();
      console.log("Request submitted successfully!", result);
      alert("Request submitted successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen min-w-screen bg-gray-200 space-y-10">
        <NavBar />

        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="flex flex-col w-2/3 flex-grow space-y-5">
            <div className="flex flex-row items-center justify-start ">
              <p className="text-primary-text font-bold text-lg">
                Request Form
              </p>
            </div>
            <div className="flex flex-col items-center justify-start flex-grow bg-foreground p-10 rounded-xl shadow-md space-y-10">
              <div className="flex flex-row items-center justify-between space-x-5">
                <div className="flex flex-row items-start justify-center space-x-2">
                  <div className="flex flex-col items-start justify-center pt-1">
                    <input
                      type="radio"
                      value="reimbursement"
                      checked={radio == "reimbursement"}
                      onChange={() => handleRadioSelect("reimbursement")}
                    />
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <p className="font-bold">Reimbursement Request</p>
                    <p>
                      You have already paid for something, and would
                      like the MES to pay you back
                    </p>
                  </div>
                </div>
                <div className="flex flex-row items-start justify-center space-x-2">
                  <div className="flex flex-col items-start justify-center pt-1">
                    <input
                      type="radio"
                      value="payment"
                      checked={radio == "payment"}
                      onChange={() => handleRadioSelect("payment")}
                    />
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <p className="font-bold">Payment Request</p>
                    <p>
                      You are requesting the MES pay someone on your
                      behalf
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-start justify-center w-1/3 space-y-2">
                  <p className="font-bold">Budget Line</p>
                  <select className="bg-foreground px-3 py-2 rounded-md w-full border-white drop-shadow-md cursor-pointer">
                    <option>option1</option>
                    <option>option1</option>
                    <option>option1</option>
                  </select>
                </div>
              </div>

              {/* FORM START */}
              <div className="flex flex-col flex-grow w-full bg-foreground rounded-xl shadow-lg border border-primary p-10 space-y-5">
                {radio === "payment" && (
                  <PaymentRequest 
                    user={{
                      ...user,
                      displayName: getDisplayName(email),
                      clubName: paymentFormData.club
                    }} 
                    formData={paymentFormData} 
                    setFormData={setPaymentFormData} 
                  />
                )}
                {radio === "reimbursement" && (
                  <ReimbursementRequest 
                    user={{
                      ...user,
                      displayName: getDisplayName(email),
                      clubName: reimbursementFormData.club
                    }} 
                    formData={reimbursementFormData} 
                    setFormData={setReimbursementFormData} 
                  />
                )}

                <div className="flex flex-row items-center justify-end">
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-primary text-white font-semibold p-2 rounded-lg w-32 drop-shadow-lg hover:bg-primary-dark disabled:bg-gray-400"
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}