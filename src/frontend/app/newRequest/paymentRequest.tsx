
import React from "react";
import { useEffect } from "react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  whoAreYou?: string; // Optional because it's an enum
  club?: string; // Reference to Club
  clubRole?: "member" | "president" | "vice-president" | "treasurer" | "secretary"; // Optional enum
  payment?: {
    etransferEmail?: string;
    etransferPhone?: string;
  };
  role?: "admin" | "standard"; // Optional user role
}

interface PaymentFormData {
  requestor: string;
  club: string;
  reviewer?: string;
  amount: string;
  description: string;
  paymentDate: string;
}

interface Props {
  user: User;
  formData: PaymentFormData;
  setFormData: React.Dispatch<React.SetStateAction<PaymentFormData>>;
}

const PaymentRequest: React.FC<Props> = ({ user, formData, setFormData }) => {

   useEffect(() => {
      setFormData((prev) => {
      if (prev.requestor && prev.club) return prev; // ✅ Do not overwrite if already set
      return {
        ...prev,
        requestor: prev.requestor || user?._id || "",
        club: prev.club || user?.club || "",
      };
      });
    }, [user]);

  return (
    <div className="space-y-5">
      <p className="text-primary-text font-bold text-xl">Payment Request</p>


      <label className="form-control w-full">
        <span className="label-text">Requestor</span>
        <input
          type="text"
          className="input text-secondary-text bg-gray-100 px-3 py-2 rounded-md w-full border border-tertiary drop-shadow-md"
          value={`${user?.firstName || ""} ${user?.lastName || ""}`}
          readOnly
        />
        <span className="text-sm text-gray-400">{user?._id || ""}</span> 
      </label>

      <label className="form-control w-full">
        <span className="label-text">Club</span>
        <input
          type="text"
          className="input bg-gray-100 px-3 py-2 rounded-md w-full border border-tertiary drop-shadow-md"
          value={user?.club || ""}
          readOnly
        />
      </label>

      <label className="form-control w-full">
        <span className="label-text">Payment Date</span>
        <input
          type="date"
          className="input bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
          value={formData.paymentDate}
          onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
        />
      </label>

      <label className="form-control w-full">
        <span className="label-text">Amount</span>
        <input
          type="text"
          className="input bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
      </label>

      
      <label className="form-control w-full">
        <span className="label-text">Description</span>
        <input
          type="text"
          className="input bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
        />
      </label>

    </div>
  );
};

export default PaymentRequest;
