"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import NavBar from "../components/navbar";

export default function UserDashboardPage() {
   interface ClubEntry {
      _id: string;
      whoAreYou: string;
      name?: string;
      clubRole?: string;
   }

   const [entries, setEntries] = useState<ClubEntry[]>([]);
   const [editId, setEditId] = useState<string | null>(null);
   const [newEntry, setNewEntry] = useState({
      whoAreYou: "",
      name: "",
      clubRole: "",
   });

   const [editEntry, setEditEntry] = useState({
      whoAreYou: "",
      name: "",
      clubRole: "",
   });

   const fetchEntries = async () => {
      const res = await axios.get("http://localhost:3001/api/clubs");
      setEntries(res.data);
   };

   useEffect(() => {
      fetchEntries();
   }, []);

   const handleAdd = async () => {
      const payload =
         newEntry.whoAreYou === "MES Position"
            ? { whoAreYou: newEntry.whoAreYou, clubRole: newEntry.clubRole }
            : { whoAreYou: newEntry.whoAreYou, name: newEntry.name };

      await axios.post("http://localhost:3001/api/clubs", payload);
      setNewEntry({ whoAreYou: "", name: "", clubRole: "" });
      fetchEntries();
   };

   const handleEdit = async (id: string) => {
      const payload =
         editEntry.whoAreYou === "MES Position"
            ? { clubRole: editEntry.clubRole }
            : { name: editEntry.name };

      await axios.put(`http://localhost:3001/api/clubs/${id}`, payload);
      setEditId(null);
      fetchEntries();
   };

   const handleDelete = async (id: string) => {
      await axios.delete(`http://localhost:3001/api/clubs/${id}`);
      fetchEntries();
   };

   return (
      <div className="space-y-10 bg-gray-100 min-h-screen">
         <NavBar />
         <div className="px-10 pb-10 space-y-10">
            <h1 className="text-2xl font-bold text-primary-text">
               Manage Clubs and Positions
            </h1>
            {/* Add New Entry */}
            <div className="bg-white rounded-lg p-5 shadow-md space-y-3">
               <h2 className="font-semibold">Add New Club or Position Entry</h2>
               <select
                  className="border rounded p-2 w-full bg-white"
                  value={newEntry.whoAreYou}
                  onChange={(e) =>
                     setNewEntry({
                        ...newEntry,
                        whoAreYou: e.target.value,
                        name: "",
                        clubRole: "",
                     })
                  }
               >
                  <option value="">Select who you are</option>
                  <option value="MES Position">MES Position</option>
                  <option value="Club, Team, or Society">
                     Club, Team, or Society
                  </option>
               </select>

               {newEntry.whoAreYou === "MES Position" && (
                  <input
                     className="border rounded p-2 w-full bg-white"
                     placeholder="Role (e.g. President)"
                     value={newEntry.clubRole}
                     onChange={(e) =>
                        setNewEntry({ ...newEntry, clubRole: e.target.value })
                     }
                  />
               )}

               {newEntry.whoAreYou === "Club, Team, or Society" && (
                  <input
                     className="border rounded p-2 w-full bg-white"
                     placeholder="Club Name"
                     value={newEntry.name}
                     onChange={(e) =>
                        setNewEntry({ ...newEntry, name: e.target.value })
                     }
                  />
               )}

               <button
                  className="bg-primary text-white px-4 py-2 rounded"
                  onClick={handleAdd}
                  disabled={
                     !newEntry.whoAreYou ||
                     (!newEntry.name && !newEntry.clubRole)
                  }
               >
                  Add
               </button>
            </div>

            {/* Table of Entries */}
            <div className="bg-white rounded-lg p-5 shadow-md">
               <h2 className="font-semibold mb-4">All Entries</h2>
               <table className="w-full table-auto border-collapse">
                  <thead>
                     <tr className="border-b">
                        <th className="text-left py-2">Who Are You</th>
                        <th className="text-left py-2">Club Name / Role</th>
                        <th className="text-left py-2">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {entries.map((entry) => (
                        <tr
                           key={entry._id}
                           className="border-b"
                        >
                           <td className="py-2">{entry.whoAreYou}</td>
                           <td className="py-2">
                              {editId === entry._id ? (
                                 <input
                                    className="border rounded p-1 w-full bg-white"
                                    value={
                                       entry.whoAreYou === "MES Position"
                                          ? editEntry.clubRole
                                          : editEntry.name
                                    }
                                    onChange={(e) =>
                                       setEditEntry(
                                          entry.whoAreYou === "MES Position"
                                             ? {
                                                  ...editEntry,
                                                  clubRole: e.target.value,
                                               }
                                             : {
                                                  ...editEntry,
                                                  name: e.target.value,
                                               }
                                       )
                                    }
                                 />
                              ) : (
                                 entry.clubRole || entry.name
                              )}
                           </td>
                           <td className="py-2 space-x-2">
                              {editId === entry._id ? (
                                 <>
                                    <button
                                       className="text-green-600"
                                       onClick={() => handleEdit(entry._id)}
                                    >
                                       Save
                                    </button>
                                    <button onClick={() => setEditId(null)}>
                                       Cancel
                                    </button>
                                 </>
                              ) : (
                                 <>
                                    <button
                                       className="text-blue-600"
                                       onClick={() => {
                                          setEditId(entry._id);
                                          setEditEntry({
                                             whoAreYou: entry.whoAreYou,
                                             name: entry.name || "",
                                             clubRole: entry.clubRole || "",
                                          });
                                       }}
                                    >
                                       Edit
                                    </button>
                                    <button
                                       className="text-red-600"
                                       onClick={() => handleDelete(entry._id)}
                                    >
                                       Delete
                                    </button>
                                 </>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
}
