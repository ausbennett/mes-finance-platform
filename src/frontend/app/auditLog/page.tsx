"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link";
import NavBar from "../components/navbar";
import axios from "axios";

export default function AuditPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reqsData, setReqsData] = useState<{ reimbursements: any[]; payments: any[] }>({ reimbursements: [], payments: []});
  const [plaidData, setPlaidData] = useState<any[]>([]);

  const [user, setUser] = useState<any>(null);
  const [plaidAccessToken, setPlaidAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [plaidLoading, setPlaidLoading] = useState(true);

  const authToken = sessionStorage.getItem("authToken") || "67aa7568a95f30c1a91f8a0a" ;

  // Define a global Axios instance within the component
  const apiClient = axios.create({
    baseURL: "http://localhost:3001", 
    headers: {
      "Content-Type": "application/json",
      Authorization: authToken ? `Bearer ${authToken}` : "",
    },
  });

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/api/users/me");
        setUser(response.data);
        
        const accessToken = response.data?.plaid?.[0]?.access_token || null;
        setPlaidAccessToken(accessToken);
        console.log("ACCESSTOKEN", plaidAccessToken)
      } catch (err) {
        console.error("Failed to fetch user data", err);
      }
    };

    const fetchLinkToken = async () => {
      try {
        const response = await apiClient.post("/api/plaid/link-token", { userID: "test-user"})
        const data = response.data
        console.log("Link Token:", data.linkToken); 
        setLinkToken(data.linkToken);
        setPlaidLoading(false);
      } catch (error) {
        console.error("Error fetching link token:", error);
        setPlaidLoading(false);
      }
    }
    
    fetchLinkToken();
    fetchUserData();
  }, []);

  const fetchData = async () => {
    if (!startDate || !endDate) {
      setError("Please provide both start and end dates.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const reqsResponse = await apiClient.get(`/api/requests/by-date?start=${startDate}&end=${endDate}`)
      const plaidResponse = await apiClient.get(`/api/plaid/transactions?start=${startDate}&end=${endDate}&accessToken=${plaidAccessToken}`)
      setReqsData(reqsResponse.data || { reimbursements: [], payments: [] });
      setPlaidData(plaidResponse.data || []);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const combinedData = Array.from(
    new Set([
      ...((reqsData.reimbursements || []).map(d => d.createdAt?.split("T")[0]) || []),
      ...((reqsData.payments || []).map(d => d.paymentDate?.split("T")[0]) || []),
      ...(plaidData?.map(d => d.date) || [])
    ])
  ).sort().map(date => ({
    date,
    reimbursements: (reqsData.reimbursements || []).filter(req => req.createdAt?.startsWith(date)),
    payments: (reqsData.payments || []).filter(pay => pay.paymentDate?.startsWith(date)),
    transactions: (plaidData || []).filter(txn => txn.date === date)
  }));

  //Plaid Link Stuff
  const onSuccess = async (publicToken: string) => {
    console.log("✅ Public Token:", publicToken);
    try {
      const response = await apiClient.post("/api/plaid/exchange-token", { publicToken }) 
      const { access_token, item_id } = response.data
      console.log("✅ Access Token Response:", access_token);
      setAccessToken(access_token); 
    } catch (error) {
      console.error("❌ Error exchanging public token:", error);
    }
  };

  const { open, ready } = usePlaidLink({
    token: linkToken || "",
    onSuccess,
  });



  return (
    <div>
      <NavBar />
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Audit Page</h1>
      <div className="flex gap-4 mb-4">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input bg-gray-300 input-bordered" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input bg-gray-300 input-bordered" />
        <button className="btn bg-primary text-white font-semilbold p-2 rounded-lg drop-shadow-lg" onClick={fetchData}>Fetch Data</button>
        {/* <button className="btn bg-secondary text-black font-semilbold p-2 rounded-lg  drop-shadow-lg" onClick={() => alert("Audit functionality TBD")}>Audit</button> */}
        {!plaidLoading && <button className="btn btn-accent font-semibold" onClick={() => open()}>Link Bank with Plaid</button>}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
      

      <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Reimbursements & Payments</th>
            <th className="border border-gray-300 p-2">Plaid Transactions</th>
          </tr>
        </thead>
        <tbody>
          {combinedData.length > 0 ? (
            combinedData.map((entry, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="border border-gray-300 p-2">{entry.date}</td>
                <td className="border border-gray-300 p-2">
                  {[...entry.reimbursements, ...entry.payments].length > 0 ? (
                    [...entry.reimbursements, ...entry.payments].map((req, idx) => (
                      <div key={idx} className="p-2 bg-gray-100 rounded mb-2">
                        <p><strong>{req.totalAmount ? "REIMBURSEMENT" : "PAYMENT"}</strong></p>
                        {req.description && <p>{req.description}</p>}
                        <p>Amount: {req.totalAmount || req.amount}</p>
                        <p className={`status-badge ${req.status?.toLowerCase() || "unknown"}`}>{req.status || "Unknown"}</p>
                        <button className="btn bg-primary text-white font-semilbold btn-xs btn-secondary">View {req.totalAmount ? "Reimbursement" : "Payment"}</button>
                      </div>
                    ))
                  ) : (
                    <p>No Requests or Payments</p>
                  )}
                </td>
                <td className="border border-gray-300 p-2">
                  {entry.transactions.length > 0 ? (
                    entry.transactions.map((txn, idx) => (
                      <div key={idx} className="p-2 bg-gray-100 rounded mb-2">
                        <p>Account ID: ****{txn.account_id.slice(-8)} </p>
                        <p>Transaction ID: ****{txn.transaction_id.slice(-8)} </p>
                        <p>Amount: {txn.amount}</p>
                        <p>Category: {txn.category?.join(", ") || "Unknown"}</p>
                        <p>Status: {txn.pending ? "Pending" : "Completed"}</p>
                      </div>
                    ))
                  ) : (
                    <p>No Transactions</p>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4">No data available, try fetching data.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}
