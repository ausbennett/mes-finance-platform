
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

interface Recipient {
  user: string;
  amount: string;
  status: string;
}

interface ReimbursementFormData {
  requestor: string;
  reviewer?: string;
  club: string;
  recipients: Recipient[];
  totalAmount: string;
  description: string;
  receipts: FileList | null;
  status: string;
}

interface Props {
  user: User;
  formData: ReimbursementFormData;
  setFormData: React.Dispatch<React.SetStateAction<ReimbursementFormData>>;
}

const ReimbursementRequest: React.FC<Props> = ({ user, formData, setFormData }) => {

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

  const handleAddRecipient = () => {
    setFormData((prev) => ({
      ...prev,
      recipients: [...prev.recipients, { user: "", amount: "", status: "pending" }],
    }));
  };

  const handleRemoveRecipient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index),
    }));
  };

  const handleRecipientChange = (index: number, key: keyof Recipient, value: string) => {
    setFormData((prev) => {
      const updatedRecipients = [...prev.recipients];
      updatedRecipients[index] = { ...updatedRecipients[index], [key]: value };
      return { ...prev, recipients: updatedRecipients };
    });
  };

  return (
    <div className="space-y-5">
      <p className="text-primary-text font-bold text-xl">Reimbursement Request</p>

      <label className="form-control w-full">
        <span className="label-text">Requestor</span>
        <input
          type="text"
          className="input text-secondary-text bg-gray-100 px-3 py-2 rounded-md w-full border border-primary drop-shadow-md"
          value={`${user?.firstName || ""} ${user?.lastName || ""}`}
          readOnly
        />
        <span className="text-sm text-gray-400">{user?._id || ""}</span> 
      </label>

      <label className="form-control w-full">
        <span className="label-text">Club</span>
        <input
          type="text"
          className="input bg-gray-100 px-3 py-2 rounded-md w-full border border-primary drop-shadow-md"
          value={user?.club || ""}
          readOnly
        />
      </label>

      {formData.recipients.map((recipient, index) => (
        <div key={index} className="flex flex-col space-y-3 border-b pb-4">
          <label className="form-control w-full">
            <span className="label-text">Recipient {index + 1}</span>
            <input
              type="text"
            className="input bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
              value={recipient.user}
              onChange={(e) => handleRecipientChange(index, "user", e.target.value)}
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text">Amount</span>
            <input
              type="text"
            className="input bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
              value={recipient.amount}
              onChange={(e) => handleRecipientChange(index, "amount", e.target.value)}
            />
          </label>

          {formData.recipients.length > 1 && (
            <button
              className="bg-gray-500 text-white px-2 py-1 rounded-md self-end"
              onClick={() => handleRemoveRecipient(index)}
            >
              Remove Recipient
            </button>
          )}
        </div>
      ))}

      <button
        className="bg-primary text-white font-semilbold p-2 rounded-lg drop-shadow-lg"
        onClick={handleAddRecipient}
      >
        + Add Recipient
      </button>

      <label className="form-control w-full">
        <span className="label-text">Total Amount</span>
        <input
          type="text"
          className="input bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
          value={formData.totalAmount}
          onChange={(e) => setFormData((prev) => ({ ...prev, totalAmount: e.target.value }))}
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

      <label className="form-control w-full">
        <span className="label-text">Receipts</span>
        <input
          type="file"
          multiple
          accept=".png, .jpg, .jpeg, .pdf"
          className="bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md 
                     file:bg-primary file:rounded-md file:cursor-pointer"
          onChange={(e) => setFormData((prev) => ({ ...prev, receipts: e.target.files }))}
        />
      </label>



    </div>
  );
};

export default ReimbursementRequest;
