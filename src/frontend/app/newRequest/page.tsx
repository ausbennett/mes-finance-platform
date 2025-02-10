"use client";

import NavBar from "../components/navbar";
import { useEffect, useState } from "react";

import PaymentRequest from "./paymentRequest";
import ReimbursementRequest from "./reimbursementRequest";


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"; // Load from environment

export default function NewRequestPage() {
  const [user,setUser] = useState(null)
  const [radio, setRadio] = useState<string>("reimbursement");
  const [authToken, setAuthToken] = useState<string>("67a92f773eaf8368041ae608");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reimbursementFormData, setReimbursementFormData] = useState({
    requestor: "", 
    club: "", 
    recipients: [{ user: "", amount: "0.00", }],
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

  // Get a token
  useEffect(() => {
      // if (typeof window !== "undefined") {
      //   const storedToken = sessionStorage.getItem("authToken");
      //   if (storedToken) {
      //     setAuthToken(storedToken);
      //   }
      // }
      
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/me`, {
            headers: {
                Authorization: `Bearer ${authToken}`
              }
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();
          setUser(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
    fetchUserData();
    }, []);

  
  const handleRadioSelect = (value: string) => {
    setRadio(radio === value ? "" : value);
  };



  useEffect(() => {
    if (isSubmitting) {
      console.log("latest reimbursementFormData:", reimbursementFormData);
      console.log("latest paymentFormData:", paymentFormData);
      setIsSubmitting(false);
    }
  }, [isSubmitting, reimbursementFormData, paymentFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!radio) {
      alert("Please select a request type (Reimbursement or Payment).");
      return;
    }

    const endpoint = radio === "reimbursement"
      ? `${API_BASE_URL}/api/requests/reimbursement/`
      : `${API_BASE_URL}/api/requests/payment/`;

    const requestData = radio === "reimbursement" ? reimbursementFormData : paymentFormData;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      const result = await response.json();
      console.log("Request submitted successfully!", result);
      alert("Request submitted successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to submit request. Please try again.");
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
                                 onChange={() =>
                                    handleRadioSelect("reimbursement")
                                 }
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
                          <PaymentRequest user={user} formData={paymentFormData} setFormData={setPaymentFormData} />
                        )}
                        {radio === "reimbursement" && (
                          <ReimbursementRequest user={user} formData={reimbursementFormData} setFormData={setReimbursementFormData} />
                        )}
                
                        <div className="flex flex-row items-center justify-end">
                           <button onClick={handleSubmit} className="bg-primary text-white font-semilbold p-2 rounded-lg w-32 drop-shadow-lg">
                              Submit
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
