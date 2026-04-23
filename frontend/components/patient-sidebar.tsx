// "use client"
// import React from 'react'
// import { Search, User, Activity } from "lucide-react"
// import { Input } from "@/components/ui/input"
// // import { ScrollArea } from "@/components/ui/scroll-area"
// // import { Badge } from "@/components/ui/badge"
// // interface Patient {
// //   patient_id: string;
// //   name: string;
// //   diagnosis: string;
// //   status?: string;
// //   ward?: string;
// // }

// // interface SidebarProps {
// //   patients: Patient[];
// //   onSelect: (patient: Patient) => void;
// //   activeId?: string;
// // }

// // export default function PatientSidebar({ patients, onSelect, activeId }: SidebarProps) {
// //   return (
// //     <div className="w-80 border-r bg-white h-screen flex flex-col">
// //       <div className="p-6 border-b">
// //         <div className="flex items-center gap-2 mb-6">
// //           <div className="bg-blue-600 p-2 rounded-lg text-white">
// //             <Activity size={20} />
// //           </div>
// //           <h2 className="text-xl font-bold tracking-tight text-slate-800">CareFlow AI</h2>
// //         </div>
// //         <div className="relative">
// //           <Search className="absolute left-3 top-3 text-slate-400" size={18} />
// //           <Input placeholder="Search patients..." className="pl-10 bg-slate-50 border-none rounded-xl" />
// //         </div>
// //       </div>
      
// //       <ScrollArea className="flex-1">
// //         <div className="p-4 space-y-2">
// //           {patients.map((p) => (
// //             <div
// //               key={p.patient_id}
// //               onClick={() => onSelect(p)}
// //               className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
// //                 activeId === p.patient_id 
// //                 ? 'bg-blue-50 border-blue-200' 
// //                 : 'hover:bg-slate-50 border-transparent hover:border-slate-100'
// //               }`}
// //             >
// //               <div className="flex justify-between items-start mb-1">
// //                 <p className="font-semibold text-slate-900">{p.name}</p>
// //                 <Badge variant={p.status === 'Critical' ? 'destructive' : 'secondary'} className="text-[10px] uppercase">
// //                   {p.status || 'Stable'}
// //                 </Badge>
// //               </div>
// //               <p className="text-xs text-slate-500 font-medium">{p.diagnosis}</p>
// //             </div>
// //           ))}
// //         </div>
// //       </ScrollArea>
// //     </div>
// //   )
// // }


// "use client"

// import React, { useState } from 'react'
// import { Search, UserCircle2, Activity } from "lucide-react"
// import { Input } from "@/components/ui/input"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Badge } from "@/components/ui/badge"

// // --- Types (TypeScript Interfaces) ---
// // Ise yahan define karna 'Highest Quality' standard hai
// interface Patient {
//   patient_id: string;
//   name: string;
//   diagnosis: string;
//   status: string; // E.g., 'CRITICAL', 'STABLE'
//   ward: string;
// }

// interface SidebarProps {
//   patients: Patient[];
//   onSelect: (patient: Patient) => void;
//   activeId?: string; // Optional: Kaunsa patient selected hai
// }

// export default function PatientSidebar({ patients, onSelect, activeId }: SidebarProps) {
//   // 1. Search State
//   const [searchTerm, setSearchTerm] = useState("");

//   // 2. Filter Logic (Search by Name or Diagnosis)
//   const filteredPatients = patients.filter(p => 
//     p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
//   );

// return (
//   <aside className="w-[340px] border-r border-slate-100 bg-white h-screen flex flex-col shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
    
//     {/* Sidebar Header */}
//     <div className="p-6 border-b border-slate-100 space-y-6">
//       <div className="flex items-center gap-3">
//         <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/30">
//           <Activity size={22} strokeWidth={2.5} />
//         </div>
//         <h2 className="text-2xl font-extrabold tracking-tighter text-slate-950">CareFlow <span className="text-blue-600">AI</span></h2>
//       </div>
      
//       {/* Search Input */}
//       <div className="relative">
//         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
//         <Input 
//           placeholder="Search by name or diagnosis..." 
//           className="pl-12 py-6 bg-slate-50 border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all text-base"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>
//     </div>

//     {/* Scroll Area (Ensure this is closed properly) */}
//     <ScrollArea className="flex-1 px-4 py-6">
//        {/* List logic goes here */}
//     </ScrollArea>

//   </aside>
//   )
// }










"use client";

import React, { useEffect, useState } from "react";
import { Search, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPatients } from "@/lib/api";

interface Patient {
  id: string;
  name: string;
  status: string;
  diagnosis: string;
}

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://careflow-backend-4l8t.onrender.com/api',});

export default function PatientSidebar({ 
  onSelectPatient 
}: { 
  onSelectPatient: (p: Patient) => void 
}) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Backend se Patients Load Karo
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (err) {
        console.error("Sidebar Connection Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const [isAdding, setIsAdding] = useState(false);
const [newName, setNewName] = useState('');

const handleRegister = async () => {
    if(!newName) return;
    await api.post('/api/patients', { name: newName, age: "28", ward_id: "WARD-01" });
    setNewName('');
    setIsAdding(false);
    window.location.reload(); // List refresh karne ke liye
}

// // Sidebar JSX mein Search input ke upar:
// <div className="p-4 border-b border-slate-100 bg-slate-50">
//     {isAdding ? (
//         <div className="space-y-2">
//             <input 
//                 className="w-full text-xs p-2.5 border rounded-xl" 
//                 placeholder="Patient Full Name"
//                 value={newName}
//                 onChange={(e) => setNewName(e.target.value)}
//             />
//             <div className="flex gap-2">
//                 <button onClick={handleRegister} className="flex-1 bg-slate-900 text-white text-[10px] py-2 rounded-lg font-bold">SAVE</button>
//                 <button onClick={() => setIsAdding(false)} className="flex-1 bg-slate-200 text-slate-700 text-[10px] py-2 rounded-lg">CANCEL</button>
//             </div>
//         </div>
//     ) : (
//         <button onClick={() => setIsAdding(true)} className="w-full border-2 border-dashed border-slate-200 py-3 rounded-xl text-[11px] text-slate-500 font-semibold hover:bg-slate-100 transition">
//             + REGISTER NEW PATIENT
//         </button>
//     )}
// </div>

{/* Sidebar JSX mein Search input ke upar ye section replace karo */}
<div className="p-4 border-b border-slate-100 bg-slate-50">
    {isAdding ? (
        <div className="space-y-2">
            <input 
                className="w-full text-xs p-2.5 border rounded-xl" 
                placeholder="Patient Full Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
            />
            <div className="flex gap-2">
                <button onClick={handleRegister} className="flex-1 bg-slate-900 text-white text-[10px] py-2 rounded-lg font-bold">SAVE</button>
                <button onClick={() => setIsAdding(false)} className="flex-1 bg-slate-200 text-slate-700 text-[10px] py-2 rounded-lg">CANCEL</button>
            </div>
        </div>
    ) : (
        <button onClick={() => setIsAdding(true)} className="w-full border-2 border-dashed border-slate-200 py-3 rounded-xl text-[11px] text-slate-500 font-semibold hover:bg-slate-100 transition">
            + REGISTER NEW PATIENT
        </button>
    )}
</div>

  // 2. Search Filter Logic
  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-80 border-r bg-white flex flex-col h-screen">
      {/* Sidebar Header aur Search */}
      <div className="p-6 border-b border-slate-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white">
            <Activity size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            CareFlow
          </h2>
        </div>

        <div className="relative">
          <Search 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" 
            size={18} 
          />
          <Input
            placeholder="Search by name..."
            className="pl-12 py-6 bg-slate-50 border-slate-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Patients ki List */}
      <ScrollArea className="flex-1 px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-20 text-slate-400 text-sm">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mb-2"></div>
            Loading patients...
          </div>
        ) : filteredPatients.length > 0 ? (
          <div className="space-y-2">
            {filteredPatients.map((patient) => (
              <button
                key={patient.id}
                onClick={() => onSelectPatient(patient)}
                className="w-full text-left p-4 rounded-xl transition-all hover:bg-blue-50 group border border-transparent hover:border-blue-100"
              >
                <p className="font-bold text-slate-900 group-hover:text-blue-700">
                  {patient.name}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {patient.diagnosis}
                  </span>
                  <span 
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      patient.status === "CRITICAL" 
                        ? "bg-red-100 text-red-700" 
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {patient.status}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-400 text-sm mt-10">
            No patients found.
          </p>
        )}
      </ScrollArea>
    </aside>
  );
}
