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

  const [activeTab, setActiveTab] = useState<'requests' | 'need-action'>('requests');
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const [user, setUser] = useState<any>(null)
  const [email, setEmail] = "adam@mcmaster.ca"

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [plaidLoading, setPlaidLoading] = useState(true);


  // Define a global Axios instance within the component
  const apiClient = axios.create({
    baseURL: "http://localhost:3001", 
    headers: {
      "Content-Type": "application/json",
      "email": `${email}`,
    },
  });

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const response = await apiClient.get("/api/users/me");
        setUser(response.data);
        const accessToken = response.data?.plaid?.[0]?.access_token || null;
        accessToken ? setAccessToken(accessToken) : console.log("No existing access token");

        console.log("ACCESSTOKEN", accessToken)
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
      const plaidResponse = await apiClient.get(`/api/plaid/live-transactions?start=${startDate}&end=${endDate}&accessToken=${accessToken}`)
      setReqsData(reqsResponse.data || { reimbursements: [], payments: [] });
      setPlaidData(plaidResponse.data || []);
      console.log(plaidResponse.data)
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

  const handleDragStart = (e: React.DragEvent, item: any) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', item._id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    console.log(e.dataTransfer.getData('text/plain'))
    // const transactionId = e.dataTransfer.getData('text/plain');
    // 
    // // Implement your reconciliation logic here
    // try {
    //   await apiClient.post('/api/reconcile', {
    //     requestId: draggedItem._id,
    //     transactionId: transactionId
    //   });
    //   // Update local state or refetch data
    // } catch (err) {
    //   console.error('Reconciliation failed:', err);
    // }
  };


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

        <div role="tablist" className="tabs tabs-boxed mb-5">
            <a 
              role="tab"
              className={`tab ${activeTab === 'requests' && 'tab-active'}`} 
              onClick={() => setActiveTab('requests')}
            >
              Requests
            </a>
            <a 
              role="tab"
              className={`tab ${activeTab === 'need-action' && 'tab-active'}`}
              onClick={() => setActiveTab('need-action')}
            >
              Audit
              <span className="badge badge-sm badge-warning ml-2">
                {reqsData.reimbursements.filter(r => !r.plaid?.isReconciled).length + 
                 reqsData.payments.filter(p => !p.plaid?.isReconciled).length}
              </span>
            </a>
        </div>

     {activeTab === 'requests' && (
        <div className="space-y-8">
          {Object.entries(
            // Group by date
            [...reqsData.reimbursements, ...reqsData.payments].reduce((acc, item) => {
              const date = new Date(item.createdAt || item.paymentDate).toISOString().split('T')[0];
              if (!acc[date]) acc[date] = [];
              acc[date].push(item);
              return acc;
            }, {} as Record<string, any[]>)
          )
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()) // Reverse chronological order
          .map(([date, items]) => (
            <div key={date} className="space-y-4">
              {/* Date Header */}
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h2>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

                {/* Requests List */}
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className={`card shadow-lg border-l-4 ${
                        item.plaid?.isReconciled
                          ? 'border-success hover:border-success-focus'
                          : 'border-error hover:border-error-focus'
                      }`}
                    >
                      <div className="card-body py-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold">
                                {item.totalAmount ? 'Reimbursement' : 'Payment'}
                              </h3>
                              <span className={`badge ${
                                item.status === 'Approved' ? 'badge-success' : 
                                item.status === 'Pending' ? 'badge-warning' : 'badge-error'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-sm opacity-80">{item.description}</p>
                            )}
                            <div className="flex items-center gap-2 text-xs">
                              <span className="font-medium">Requestor:</span>
                              <span className="badge badge-outline">
                                {item.requestor?.slice(-8)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-xl font-bold">
                              ${item.totalAmount || item.amount}
                            </p>
                            <p className="text-xs opacity-70">
                              {new Date(item.createdAt || item.paymentDate).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}


        {activeTab === 'need-action' && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Unreconciled Requests */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-2">Unreconciled Requests ({[...reqsData.reimbursements, ...reqsData.payments].filter(item => !item.plaid?.isReconciled).length})</h3>
              <div className="space-y-2">
                {[...reqsData.reimbursements, ...reqsData.payments]
                  .filter(item => !item.plaid?.isReconciled)
                  .map((item, index) => (
                    <div 
                      key={index}
                      className="card foreground shadow relative"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add('bg-info/20');
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove('bg-info/20');
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove('bg-info/20');
                        const transaction = JSON.parse(e.dataTransfer.getData('transaction'));
                        setSelectedRequest(item);
                        setSelectedTransaction(transaction);
                        setShowConfirmation(true);
                      }}
                    >
                      <div className="card-body p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">
                              {item.totalAmount ? 'Reimbursement' : 'Payment'}
                            </h4>
                            <p className="text-sm">${item.totalAmount || item.amount}</p>
                          </div>
                          <span className="badge badge-error badge-sm">Unreconciled</span>
                        </div>
                        
                        {/* Preview of linked transaction */}
                        {item.plaid?.transactionId && (
                          <div className="mt-2 p-2 bg-info/10 rounded">
                            <p className="text-xs">
                              Linked Transaction: {item.plaid.transactionId?.slice(-8)}
                            </p>
                            <p className="text-xs">Amount: ${item.plaid.transactionAmount}</p>
                            <p className="text-xs">Account: ****{item.plaid.accountId?.slice(-4)}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Plaid Transactions */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-2">Plaid Transactions</h3>
              <div className="space-y-2">
                {plaidData.map((txn, index) => (
                  <div
                    key={index}
                    className="card bg-foreground shadow p-4 cursor-move"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('transaction', JSON.stringify({
                        transactionId: txn.transaction_id,
                        accountId: txn.account_id,
                        transactionAmount: txn.amount
                      }));
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">${txn.amount}</p>
                        <p className="text-sm">{txn.category?.join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs">{txn.date}</p>
                        <span className="badge badge-info badge-sm">
                          {txn.pending ? 'Pending' : 'Completed'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmation Modal */}
            <dialog open={showConfirmation} className="modal">
              <div className="modal-box bg-foreground">
                <h3 className="font-bold text-lg">Confirm Reconciliation</h3>
                <div className="py-4 space-y-4">
                  <div className="bg-foreground p-4 rounded">
                    <p className="font-semibold">Request Details:</p>
                    <p>Amount: ${selectedRequest?.totalAmount || selectedRequest?.amount}</p>
                    <p>Type: {selectedRequest?.totalAmount ? 'Reimbursement' : 'Payment'}</p>
                  </div>
                  
                  <div className="bg-foreground p-4 rounded">
                    <p className="font-semibold">Transaction Details:</p>
                    <p>Amount: ${selectedTransaction?.transactionAmount}</p>
                    <p>Account: ****{selectedTransaction?.accountId?.slice(-4)}</p>
                    <p>Transaction ID: ****{selectedTransaction?.transactionId?.slice(-8)}</p>
                  </div>
                </div>
                <div className="modal-action">
                  <button 
                    className="btn btn-error"
                    onClick={() => setShowConfirmation(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-success"
                    onClick={async () => {
                      if (!selectedRequest || !selectedTransaction) return;
                      
                      try {
                        const isReimbursement = "totalAmount" in selectedRequest;
                        const endpoint = isReimbursement 
                          ? `/api/requests/reimbursements/id/${selectedRequest._id}`
                          : `/api/requests/payments/id/${selectedRequest._id}`;

                        const updatedPlaid = {
                          ...selectedRequest.plaid, // Preserve existing data
                          transactionId: selectedTransaction.transactionId,
                          accountId: selectedTransaction.accountId,
                          transactionAmount: selectedTransaction.transactionAmount,
                          isReconciled: true,
                        };

                        // Send API request
                        await apiClient.put(endpoint, { plaid: updatedPlaid });

                        // Update local state
                        setReqsData(prev => ({
                          ...prev,
                          reimbursements: prev.reimbursements.map(req => 
                            req._id === selectedRequest._id ? { ...req, plaid: updatedPlaid } : req
                          ),
                          payments: prev.payments.map(pay => 
                            pay._id === selectedRequest._id ? { ...pay, plaid: updatedPlaid } : pay
                          ),
                        }));

                        console.log("Edit Request Complete")
                        setShowConfirmation(false);
                      } catch (err) {
                        console.error("Reconciliation failed:", err);
                        setError("Failed to save reconciliation. Please try again.");
                        setShowConfirmation(false);
                      }
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </dialog>
          </div>
        )}

      </div>
    </div>
  );
}
