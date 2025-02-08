"use client";

import NavBar from "../components/navbar";
import Image from "next/image";
import { useState } from "react";

export default function AccountInfoPage() {
   const [editMode, setEditMode] = useState<boolean>(false);

   //these will be pull from db initially
   const [userInfo, setUserInfo] = useState({
      firstName: "Joe",
      lastName: "Shmo",
      phoneNumber: "905-123-4567",
      whoAreYou: "Club Member",
      club: "Formula Electric",
      role: "Technical Lead",
      eTransferEmail: "123@gmail.com",
      eTransferPhoneNumber: "905-123-4567",
   });

   const [tempData, setTempData] = useState(userInfo);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setTempData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSave = () => {
      setUserInfo(tempData);
      setEditMode(false);
   };

   return (
      <>
         <div className="flex flex-col min-h-screen min-w-screen bg-gray-200 space-y-10">
            <NavBar />
            <div className="flex flex-col items-center justify-center flex-grow">
               <div className="flex flex-col w-2/3 flex-grow space-y-5">
                  <div className="flex flex-row items-center justify-start ">
                     <p className="text-primary-text font-bold text-lg">
                        Your Account Information
                     </p>
                  </div>

                  <div className="flex flex-col item-center justify-center space-y-5 bg-foreground p-10 rounded-lg">
                     <div className="flex flex-row items-center justify-between">
                        <div className="flex-1">
                           <p className="text-primary-text font-bold text-xl">
                              Hello, {userInfo.firstName}
                           </p>
                        </div>
                        <div>
                           {!editMode && (
                              <Image
                                 src="/pencil.png"
                                 alt="Edit"
                                 height={25}
                                 width={25}
                                 className="cursor-pointer"
                                 onClick={() => {
                                    setEditMode(true);
                                 }}
                              />
                           )}
                        </div>
                     </div>

                     {/* GENERAL INFO */}
                     <div className="space-y-3">
                        <u>General Information</u>
                        {["firstName", "lastName", "phoneNumber"].map(
                           (field) => (
                              <label
                                 key={field}
                                 className="form-control w-full"
                              >
                                 <div className="label">
                                    <span className="label-text capitalize">
                                       {field.replace(/([A-Z])/g, " $1")}
                                    </span>
                                 </div>

                                 {editMode ? (
                                    <input
                                       type="text"
                                       name={field}
                                       value={
                                          tempData[
                                             field as keyof typeof tempData
                                          ]
                                       }
                                       onChange={handleChange}
                                       className="bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
                                       placeholder={field}
                                    />
                                 ) : (
                                    <div className="bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md text-primary-text">
                                       {
                                          userInfo[
                                             field as keyof typeof userInfo
                                          ]
                                       }
                                    </div>
                                 )}
                              </label>
                           )
                        )}
                     </div>

                     {/* CLUB INFO */}
                     <div className="space-y-3">
                        <u>Club Information</u>
                        {["whoAreYou", "club", "role"].map((field) => (
                           <label
                              key={field}
                              className="form-control w-full"
                           >
                              <div className="label">
                                 <span className="label-text capitalize">
                                    {field.replace(/([A-Z])/g, " $1")}
                                 </span>
                              </div>

                              {editMode ? (
                                 <input
                                    type="text"
                                    name={field}
                                    value={
                                       tempData[field as keyof typeof tempData]
                                    }
                                    onChange={handleChange}
                                    className="bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
                                    placeholder={field}
                                 />
                              ) : (
                                 <div className="bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md text-primary-text">
                                    {userInfo[field as keyof typeof userInfo]}
                                 </div>
                              )}
                           </label>
                        ))}
                     </div>

                     {/* PAYMENT INFO */}
                     <div className="space-y-3">
                        <u>Payment Information</u>
                        {["eTransferEmail", "eTransferPhoneNumber"].map(
                           (field) => (
                              <label
                                 key={field}
                                 className="form-control w-full"
                              >
                                 <div className="label">
                                    <span className="label-text capitalize">
                                       {field.replace(/([A-Z])/g, " $1")}
                                    </span>
                                 </div>

                                 {editMode ? (
                                    <input
                                       type="text"
                                       name={field}
                                       value={
                                          tempData[
                                             field as keyof typeof tempData
                                          ]
                                       }
                                       onChange={handleChange}
                                       className="bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md"
                                       placeholder={field}
                                    />
                                 ) : (
                                    <div className="bg-foreground px-3 py-2 rounded-md w-full border border-white drop-shadow-md text-primary-text">
                                       {
                                          userInfo[
                                             field as keyof typeof userInfo
                                          ]
                                       }
                                    </div>
                                 )}
                              </label>
                           )
                        )}
                     </div>

                     <div className="flex flex-row items-center justify-end">
                        {editMode && (
                           <button
                              className="bg-primary text-white font-semilbold p-2 rounded-lg w-32 drop-shadow-lg"
                              onClick={handleSave}
                           >
                              Save
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}
