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
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [selectedRequestDetails, setSelectedRequestDetails] = useState<any>(null);

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
  

  const groupedUnreconciled = Object.entries(
  [...reqsData.reimbursements, ...reqsData.payments]
    .filter(item => !item.plaid?.isReconciled)
    .reduce((acc, item) => {
      const date = new Date(item.createdAt || item.paymentDate).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    }, {} as Record<string, any[]>)
  );

  const groupedPlaidData = Object.entries(
  plaidData.reduce((acc, txn) => {
    if (!acc[txn.date]) acc[txn.date] = [];
    acc[txn.date].push(txn);
    return acc;
  }, {} as Record<string, any[]>)
  );

  const handleRemoveReconciliation = async (request: any) => {
    try {
      const isReimbursement = "totalAmount" in request;
      const endpoint = isReimbursement 
        ? `/api/requests/reimbursements/id/${request._id}`
        : `/api/requests/payments/id/${request._id}`;

      // Preserve existing plaid data but set isReconciled to false
      const updatedPlaid = {
        ...request.plaid,
        isReconciled: false,
      };

      await apiClient.put(endpoint, { plaid: updatedPlaid });

      // Update local state
      setReqsData(prev => ({
        ...prev,
        reimbursements: prev.reimbursements.map(req => 
          req._id === request._id ? { ...req, plaid: updatedPlaid } : req
        ),
        payments: prev.payments.map(pay => 
          pay._id === request._id ? { ...pay, plaid: updatedPlaid } : pay
        ),
      }));

      // Update details modal if open
      if (selectedRequestDetails?._id === request._id) {
        setSelectedRequestDetails(prev => ({
          ...prev,
          plaid: updatedPlaid
        }));
      }

      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (err) {
      console.error("Failed to remove reconciliation:", err);
      setError("Failed to remove reconciliation. Please try again.");
    }
  };

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

        {showSuccessAlert && (
          <div className="toast toast-top toast-end">
            <div className="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Reconciliation successful!</span>
            </div>
          </div>
        )}

        {selectedRequestDetails && (
          <dialog open className="modal modal-bottom sm:modal-middle">
            <div className="modal-box max-w-2xl bg-foreground">
              <h3 className="font-bold text-lg mb-4">
                Request Details - {selectedRequestDetails._id.slice(-8)}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Type:</span>
                    <span>{selectedRequestDetails.totalAmount ? 'Reimbursement' : 'Payment'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Date:</span>
                    <span>
                      {new Date(
                        selectedRequestDetails.createdAt || 
                        selectedRequestDetails.paymentDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Requestor:</span>
                    <span>{selectedRequestDetails.requestor || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Club:</span>
                    <span>{selectedRequestDetails.club?.toUpperCase() || 'N/A'}</span>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Amount:</span>
                    <span className="text-xl font-bold">
                      ${selectedRequestDetails.totalAmount || selectedRequestDetails.amount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Status:</span>
                    <span className={`badge ${
                      selectedRequestDetails.status === 'Approved' ? 'badge-success' : 
                      selectedRequestDetails.status === 'Pending' ? 'badge-warning' : 'badge-error'
                    }`}>
                      {selectedRequestDetails.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Payment Type:</span>
                    <span>
                      {selectedRequestDetails.paymentType || 
                       selectedRequestDetails.reimbursementType || 
                       'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              {selectedRequestDetails.description && (
                <div className="mt-4 p-3 bg-gray-100 rounded">
                  <p className="font-semibold mb-1">Description:</p>
                  <p className="text-sm">{selectedRequestDetails.description}</p>
                </div>
              )}

              <div className="modal-action">
                <button 
                  className="btn"
                  onClick={() => setSelectedRequestDetails(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        )}

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

                            {item.plaid.isReconciled && (
                              <button 
                                className="btn btn-xs btn-ghost"
                                onClick={() => setExpandedRequestId(
                                  expandedRequestId === item._id ? null : item._id
                                )}
                              >
                                {expandedRequestId === item._id ? '▲' : '▼'} Plaid Details
                              </button>
                            )}

                          </div>
                          
                          {/* Right side buttons and details */}
                              <div className="flex flex-col items-end gap-2">
                                <p className="text-xs opacity-70">
                                  {new Date(item.createdAt || item.paymentDate).toLocaleTimeString()}
                                </p>
                                <p className="text-xl font-bold">
                                  ${item.totalAmount || item.amount}
                                </p>

                                <div className="flex gap-2">
                                  <Link 
                                    href={`/editRequest/${item._id}`}
                                    className="btn btn-xs btn-ghost"
                                  >
                                    View Request
                                  </Link>
                                </div>
                              </div>

                        </div>

                      {/* Plaid Details Dropdown */}
                        {expandedRequestId === item._id && item.plaid && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2">Plaid Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p>Transaction ID: {item.plaid.transactionId?.slice(-8)}</p>
                                <p>Account: ****{item.plaid.accountId?.slice(-4)}</p>
                              </div>
                              <div>
                                <p>Amount: ${item.plaid.transactionAmount}</p>
                                <p>Status: {item.plaid.isReconciled ? 'Reconciled' : 'Pending'}</p>
                              </div>
                            </div>
                            <button
                              className="btn btn-error btn-sm mt-3"
                              onClick={() => handleRemoveReconciliation(item)}
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'need-action' && (
          <div className="mt-4">
            {Array.from(
              new Set([
                ...([...reqsData.reimbursements, ...reqsData.payments]
                  .filter(item => !item.plaid?.isReconciled)
                  .map(item => new Date(item.createdAt || item.paymentDate).toISOString().split('T')[0])),
                ...plaidData.map(txn => txn.date)
              ])
            )
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map(date => (
              <div key={date} className="space-y-4 mb-8">
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

                {/* Two-column grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Requests Column */}
                  <div className="col-span-1">
                    <h3 className="text-lg font-semibold mb-2">Unreconciled Requests</h3>
                    <div className="space-y-2">
                      {[...reqsData.reimbursements, ...reqsData.payments]
                        .filter(item => 
                          !item.plaid?.isReconciled && 
                          new Date(item.createdAt || item.paymentDate).toISOString().split('T')[0] === date
                        )
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
                              <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <h4 className="font-semibold">
                                      {item.totalAmount ? 'Reimbursement' : 'Payment'}
                                    </h4>
                                    <span className="badge badge-error badge-sm">Unreconciled</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium opacity-70">Requestor:</span>
                                      <span className="badge badge-outline badge-sm">
                                        {item.requestor || 'Unknown'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium opacity-70">Club:</span>
                                      <span className="text-secondary">
                                        {item.club?.toUpperCase() || 'N/A'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium opacity-70">Amount:</span>
                                      <span className="text-primary font-semibold">
                                        ${item.totalAmount || item.amount}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button 
                                  className="btn btn-xs btn-ghost"
                                  onClick={() => setSelectedRequestDetails(item)}
                                >
                                  View Request
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      {[...reqsData.reimbursements, ...reqsData.payments]
                        .filter(item => 
                          !item.plaid?.isReconciled && 
                          new Date(item.createdAt || item.paymentDate).toISOString().split('T')[0] === date
                        ).length === 0 && (
                          <div className="text-center text-sm text-gray-500 py-4">
                            No unreconciled requests for this date
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Transactions Column */}
                  <div className="col-span-1">
                    <h3 className="text-lg font-semibold mb-2">Plaid Transactions</h3>
                    <div className="space-y-2">
                      {plaidData
                        .filter(txn => txn.date === date)
                        .map((txn, index) => (
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
                      {plaidData.filter(txn => txn.date === date).length === 0 && (
                        <div className="text-center text-sm text-gray-500 py-4">
                          No transactions for this date
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Reconciliation Confirmation Modal */}
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
                          ...selectedRequest.plaid,
                          transactionId: selectedTransaction.transactionId,
                          accountId: selectedTransaction.accountId,
                          transactionAmount: selectedTransaction.transactionAmount,
                          isReconciled: true,
                        };

                        await apiClient.put(endpoint, { plaid: updatedPlaid });

                        setReqsData(prev => ({
                          ...prev,
                          reimbursements: prev.reimbursements.map(req => 
                            req._id === selectedRequest._id ? { ...req, plaid: updatedPlaid } : req
                          ),
                          payments: prev.payments.map(pay => 
                            pay._id === selectedRequest._id ? { ...pay, plaid: updatedPlaid } : pay
                          ),
                        }));

                        setShowConfirmation(false);
                        setShowSuccessAlert(true);
                        setTimeout(() => setShowSuccessAlert(false), 3000);
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
