"use client";

import Link from "next/link";
import { useState } from "react";
import axios from "axios";

/*
 * I need states for the list of plaid transactions, payments, and reimbursements
 * the axios getters will set these states
 * I can also pass these states onto the reconciler function to reconcile
 * the reconciler will update the current state 
 *
 * I need 
 * */

export default function AuditLogPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = () => {};
return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Audit Page</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="input input-bordered"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="input input-bordered"
        />
        <button onClick={fetchData} className="btn btn-primary">Fetch Data</button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
      
      <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Requests</th>
            <th className="border border-gray-300 p-2">Payments</th>
            <th className="border border-gray-300 p-2">Plaid Transactions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 || requests.length > 0 ? (
            transactions.map((t, index) => (
              <tr key={index} className="border border-gray-300">
                <td className="border border-gray-300 p-2">{t.date}</td>
                <td className="border border-gray-300 p-2">{requests[index]?.count || 0}</td>
                <td className="border border-gray-300 p-2">{t.payments || 0}</td>
                <td className="border border-gray-300 p-2">{t.plaidTransactions || 0}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">No data available.</td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="btn btn-accent mt-4" onClick={() => alert("Audit functionality TBD")}>Audit</button>
    </div>
  );
}
