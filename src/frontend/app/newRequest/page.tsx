"use client";

import NavBar from "../components/navbar";
import { useState } from "react";

export default function NewRequestPage() {
   const [radio, setRadio] = useState<string>("");

   const handleRadioSelect = (value: string) => {
      if (radio == value) {
         setRadio("");
      } else {
         setRadio(value);
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
                        <p className="text-primary-text font-bold text-xl">
                           Reimbursement Request
                        </p>
                        <label className="form-control w-full">
                           <div className="label">
                              <span className="label-text">Recipient</span>
                           </div>

                           <input
                              type="text"
                              placeholder="should be autofilled"
                              className="bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
                           />
                        </label>
                        <label className="form-control w-full">
                           <div className="label">
                              <span className="label-text">Payment Date</span>
                           </div>

                           <input
                              type="date"
                              placeholder="01/01/2025"
                              className="bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
                           />
                        </label>
                        <label className="form-control w-full">
                           <div className="label">
                              <span className="label-text">
                                 Description of Payment
                              </span>
                           </div>

                           <input
                              type="text"
                              placeholder="description"
                              className="bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
                           />
                        </label>
                        <label className="form-control w-full">
                           <div className="label">
                              <span className="label-text">Subtotal</span>
                           </div>

                           <input
                              type="text"
                              placeholder="19.99"
                              className="bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
                           />
                        </label>
                        <label className="form-control w-full">
                           <div className="label">
                              <span className="label-text">HST</span>
                           </div>

                           <input
                              type="text"
                              placeholder="we should auto calculate this"
                              className="bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
                           />
                        </label>
                        <label className="form-control w-full">
                           <div className="label">
                              <span className="label-text">Receipts</span>
                           </div>

                           <input
                              type="file"
                              accept=".png, .jpg, .jpeg, .pdf"
                              multiple
                              placeholder=".png, .jpg, .jpeg, .pdf"
                              className="bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md 
                                         file:bg-primary file:rounded-md file:cursor-pointer"
                           />
                        </label>
                        <div className="flex flex-row items-center justify-end">
                           <button className="bg-primary text-white font-semilbold p-2 rounded-lg w-32 drop-shadow-lg">
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
