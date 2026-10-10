// "use client"

// import React, { useState, useEffect } from 'react'
// import PatientSidebar from "@/components/patient-sidebar"
// // lib/api.ts file humne pehle banayi thi, ensure it has these exports
// import { getPatients, getPatientTasks, analyzeNote, toggleTaskStatus } from "@/lib/api"
// // Shadcn components must be installed
// import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { 
//   Loader2, 
//   Send, 
//   CheckCircle2, 
//   Sparkles, 
//   Activity, 
//   Calendar, 
//   Clock,
//   ClipboardList,
//   AlertTriangle
// } from "lucide-react"

// // --- 🏷️ Highest Quality Types (TypeScript Interfaces) ---
// interface Patient {
//   patient_id: string;
//   name: string;
//   diagnosis: string;
//   status: string; // E.g., 'CRITICAL', 'STABLE'
//   ward: string;
// }

// interface Task {
//   _id: string;
//   task: string;
//   category: string;
//   status: string; // E.g., 'Completed', 'Pending'
// }

// export default function Dashboard() {
//   // --- 💡 Application States ---
//   const [patients, setPatients] = useState<Patient[]>([])
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
//   const [tasks, setTasks] = useState<Task[]>([])
//   const [note, setNote] = useState("")
//   const [loading, setLoading] = useState(false)
//   const [currentTime, setCurrentTime] = useState(new Date())

//   // --- ⏰ Real-time Clock Logic ---
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000)
//     return () => clearInterval(timer)
//   }, [])

//   // --- 📡 Initial Load: Fetch Patients ---
//   useEffect(() => {
//     getPatients()
//       .then(res => {
//         if (res.data) setPatients(res.data)
//       })
//       .catch(err => console.error("Error fetching patients:", err))
//   }, [])

//   // --- 🔄 Fetch Tasks when a Patient is Selected ---
//   useEffect(() => {
//     if (selectedPatient) {
//       setTasks([]) // Clear old tasks for smooth visual transition
//       getPatientTasks(selectedPatient.patient_id)
//         .then(res => {
//           if (res.data) setTasks(res.data)
//         })
//         .catch(err => console.error("Error fetching tasks:", err))
//     }
//   }, [selectedPatient])

//   // --- 🛠️ FUNCTION: Toggle Task Status (Completed / Pending) ---
//   const handleToggleTask = async (taskId: string) => {
//     try {
//       await toggleTaskStatus(taskId) // API Patch call
//       // Refresh task list for current patient
//       if (selectedPatient) {
//         const res = await getPatientTasks(selectedPatient.patient_id)
//         if (res.data) setTasks(res.data)
//       }
//     } catch (err) {
//       console.error("Status update failed:", err)
//     }
//   }

//   // --- 🤖 AI ANALYSIS: Process Clinical Note & Generate Tasks ---
//   const handleAnalyze = async () => {
//     if (!note || !selectedPatient) return
//     setLoading(true)
//     try {
//       await analyzeNote(selectedPatient.patient_id, note)
//       // Re-fetch tasks immediately to show new AI-generated ones
//       const updated = await getPatientTasks(selectedPatient.patient_id)
//       if (updated.data) setTasks(updated.data)
//       setNote("") // Clear the textarea
//     } catch (err) {
//       console.error("AI Analysis failed:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans antialiased text-slate-900">
      
//       {/* 1. Sidebar Component (Search logic should be inside) */}
//       <PatientSidebar 
//         patients={patients} 
//         onSelect={setSelectedPatient} 
//         activeId={selectedPatient?.patient_id} 
//       />

//       {/* 2. Main Workspace */}
//       <main className="flex-1 flex flex-col p-8 overflow-y-auto bg-slate-50/50">
        
//         {/* Top Info Bar */}
//         <div className="flex justify-between items-center mb-8">
//           <div className="flex items-center gap-6 text-slate-400 text-sm font-medium">
//             <div className="flex items-center gap-2">
//               <Calendar size={16} />
//               {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
//             </div>
//             <div className="flex items-center gap-2 border-l pl-6">
//               <Clock size={16} />
//               {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
//             </div>
//           </div>
//           <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 py-1.5 px-4 rounded-full">
//             AI Monitor Active v2.2
//           </Badge>
//         </div>

//         {selectedPatient ? (
//           <div className="max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
//             {/* --- Patient Profile Banner --- */}
//             <div className="flex justify-between items-end bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
//               <div>
//                 <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Active Patient File</p>
//                 <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
//                   {selectedPatient.name}
//                 </h1>
//                 <p className="text-slate-500 font-medium mt-3 flex items-center gap-2">
//                   <span className="bg-slate-100 px-2 py-0.5 rounded text-xs uppercase">ID: {selectedPatient.patient_id}</span>
//                   <span className="bg-slate-100 px-2 py-0.5 rounded text-xs uppercase">Ward: {selectedPatient.ward}</span>
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Diagnosis</p>
//                 <Badge className={`px-4 py-1.5 text-sm font-bold uppercase ${
//                   selectedPatient.status === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
//                 }`}>
//                   {selectedPatient.diagnosis}
//                 </Badge>
//               </div>
//             </div>

//             {/* --- AI Agent Interface (Blue Card) --- */}
//             <Card className="border-none shadow-2xl bg-gradient-to-br from-[#2563EB] via-[#1E40AF] to-[#1E3A8A] text-white overflow-hidden rounded-[32px] p-2">
//               <CardHeader className="pb-2">
//                 <CardTitle className="flex items-center gap-3 text-xl font-bold">
//                   <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
//                     <Sparkles size={20} className="text-blue-100 animate-pulse fill-blue-100" />
//                   </div>
//                   Clinical AI Agent Workspace
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <Textarea 
//                 placeholder="Paste doctor's clinical notes, observations, or latest symptoms here..." 
//                 className="bg-white/10 border-white/20 text-white placeholder:text-blue-100/30 min-h-[160px] rounded-[24px] focus-visible:ring-blue-300 text-lg py-5 px-6 border-2 transition-all"
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}/>
//                 <Button 
//                   onClick={handleAnalyze}
//                   disabled={loading || !note}
//                   className="bg-white text-blue-700 hover:bg-blue-50 font-black px-12 py-7 rounded-full shadow-xl transition-all active:scale-95 disabled:opacity-50 text-base tracking-tight h-auto"
//                 >
//                   {loading ? (
//                     <><Loader2 className="animate-spin mr-3" size={22} /> AI Agent is Thinking...</>
//                   ) : (
//                     <><Send size={20} className="mr-3" /> Process Clinical Note</>
//                   )}
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* --- Actionable Tasks Section --- */}
//             <div className="space-y-6 pb-20">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
//                   <ClipboardList size={24} className="text-blue-600" />
//                   Clinical Tasks Queue
//                   <Badge className="bg-blue-100 text-blue-700 font-black border-none px-3">{tasks.length}</Badge>
//                 </h3>
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {tasks.length > 0 ? (
//                   tasks.map((task) => (
//                     // Using template literals for dynamic class names (backticks used!)
//                     <Card 
//                       key={task._id} 
//                       className={`border-slate-200/50 hover:border-blue-400 hover:shadow-xl transition-all duration-300 rounded-[24px] overflow-hidden group ${
//                         task.status === 'Completed' ? 'bg-slate-50' : 'bg-white'
//                       }`}
//                     >
//                       <CardContent className="p-6 flex justify-between items-center gap-4">
//                         <div className="space-y-3 flex-1">
//                           {/* Task name with dynamic strike-through logic */}
//                           <p className={`text-lg font-bold leading-tight ${
//                             task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'
//                           }`}>
//                             {task.task}
//                           </p>
//                           <div className="flex gap-2">
//                             <Badge variant="secondary" className="text-[10px] font-black px-2.5 py-1 bg-slate-100 text-slate-500 uppercase tracking-widest border-none">
//                               {task.category}
//                             </Badge>
//                             {task.status === 'Completed' && (
//                               <Badge className="text-[10px] bg-green-100 text-green-700 font-bold border-none uppercase tracking-widest px-2.5 py-1">Verified</Badge>
//                             )}
//                           </div>
//                         </div>
                        
//                         {/* Toggle Task Status Button */}
//                         <button 
//                           onClick={() => handleToggleTask(task._id)}
//                           className={`p-3 rounded-full transition-all duration-300 active:scale-75 ${
//                             task.status === 'Completed' 
//                             ? 'text-green-500 bg-green-50' 
//                             : 'text-slate-200 hover:text-green-500 hover:bg-green-50'
//                           }`}
//                           title={task.status === 'Completed' ? "Mark as Pending" : "Mark as Completed"}
//                         >
//                           <CheckCircle2 size={36} strokeWidth={task.status === 'Completed' ? 2.5 : 1.5} />
//                         </button>
//                       </CardContent>
//                     </Card>
//                   ))
//                 ) : (
//                   /* Empty state for tasks grid */
//                   <div className="col-span-full py-16 text-center bg-slate-100/50 rounded-[32px] border-2 border-dashed border-slate-200 space-y-3">
//                     <ClipboardList size={48} className="text-slate-300 mx-auto" />
//                     <p className="text-slate-500 font-semibold italic text-base">No tasks found for {selectedPatient.name}.</p>
//                     <p className="text-xs text-slate-400 max-w-sm mx-auto">Use the Clinical Agent console above to paste medical notes and automatically extract tasks.</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         ) : (
//           /* --- Empty State: Welcome Screen (When no patient selected) --- */
//           <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-6">
//              <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-100 text-center space-y-6 max-w-md">
//                 <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner">
//                   <Activity size={48} className="text-blue-500 animate-pulse" />
//                 </div>
//                 <div>
//                   <h2 className="text-3xl font-black text-slate-800 tracking-tight">System Ready</h2>
//                   <p className="text-slate-500 font-medium mt-2 leading-relaxed">
//                     Welcome to CareFlow Healthcare Intelligence. Please select a patient from the sidebar to access their records and generate AI clinical insight tasks.
//                   </p>
//                 </div>
//                 <div className="pt-4 flex gap-2 justify-center">
//                   <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" />
//                   <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
//                   <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
//                 </div>
//              </div>
//              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">CareFlow Healthcare Intelligence Platform</p>
//           </div>
//         )}
//       </main>
//     </div>
//   )
// }



// "use client";

// import React, { useState, useEffect } from 'react';
// import PatientSidebar from '@/components/patient-sidebar';
// import { getPatientTasks, analyzeNote, toggleTaskStatus } from "@/lib/api";
// import { 
//   Loader2, Send, CheckCircle2, Sparkles, Activity, 
//   Calendar, Clock, ClipboardList, AlertTriangle 
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// // --- Types ---
// interface Patient {
//   id: string; // Ensure this matches your backend (id vs patient_id)
//   name: string;
//   diagnosis: string;
//   status: string;
//   ward: string;
// }

// interface Task {
//   _id: string;
//   task: string;
//   category: string;
//   status: string;
// }

// export default function Dashboard() {
//   // --- States ---
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [note, setNote] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   // --- Real-time Clock ---
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // --- Fetch Tasks when Patient is Selected ---
//   useEffect(() => {
//     if (selectedPatient) {
//       setTasks([]); // Clear old tasks for smooth transition
//       const fetchTasks = async () => {
//         try {
//           const data = await getPatientTasks(selectedPatient.id);
//           setTasks(data);
//         } catch (err) {
//           console.error("Error fetching tasks:", err);
//         }
//       };
//       fetchTasks();
//     }
//   }, [selectedPatient]);

//   // --- Toggle Task Status ---
//   const handleToggleTask = async (taskId: string) => {
//     try {
//       await toggleTaskStatus(taskId);
//       if (selectedPatient) {
//         const updatedTasks = await getPatientTasks(selectedPatient.id);
//         setTasks(updatedTasks);
//       }
//     } catch (err) {
//       console.error("Status update failed:", err);
//     }
//   };

//   // --- AI Analysis ---
//   const handleAnalyze = async () => {
//     if (!note || !selectedPatient) return;
//     setLoading(true);
//     try {
//       await analyzeNote(selectedPatient.id, note);
//       const updatedTasks = await getPatientTasks(selectedPatient.id);
//       setTasks(updatedTasks);
//       setNote(""); // Clear input
//     } catch (err) {
//       console.error("AI Analysis failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans antialiased text-slate-900">
      
//       {/* 1. Sidebar - Ab hum yahan patients={patients} nahi bhej rahe */}
//       <PatientSidebar 
//         onSelectPatient={(p) => setSelectedPatient(p)} 
//       />

//       {/* 2. Main Workspace */}
//       <main className="flex-1 flex flex-col p-8 overflow-y-auto bg-slate-50/50">
        
//         {/* Top Info Bar */}
//         <div className="flex justify-between items-center mb-8">
//           <div className="flex items-center gap-6 text-slate-400 text-sm font-medium">
//             <div className="flex items-center gap-2">
//               <Calendar size={16} />
//               {currentTime.toLocaleDateString('en-us', { weekday: 'long', month: 'long', day: 'numeric' })}
//             </div>
//             <div className="flex items-center gap-2 border-l pl-6">
//               <Clock size={16} />
//               {currentTime.toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' })}
//             </div>
//           </div>
//           <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 py-1.5 px-4 rounded-full">
//             AI Monitor Active v2.2
//           </Badge>
//         </div>

//         {selectedPatient ? (
//           <div className="max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
//             {/* Patient Profile Banner */}
//             <div className="flex justify-between items-end bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
//               <div>
//                 <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Active Patient File</p>
//                 <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
//                   {selectedPatient.name}
//                 </h1>
//                 <p className="text-slate-500 font-medium mt-3 flex items-center gap-2">
//                   <span className="bg-slate-100 px-2 py-0.5 rounded text-xs uppercase">ID: {selectedPatient.id}</span>
//                   <span className="bg-slate-100 px-2 py-0.5 rounded text-xs uppercase">Ward: {selectedPatient.ward || "N/A"}</span>
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Diagnosis</p>
//                 <Badge className={`px-4 py-1.5 text-sm font-bold uppercase ${
//                   selectedPatient.status === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
//                 }`}>
//                   {selectedPatient.diagnosis}
//                 </Badge>
//               </div>
//             </div>

//             {/* AI Agent Interface */}
//             <Card className="border-none shadow-2xl bg-gradient-to-br from-[#2563EB] via-[#1E40AF] to-[#1E3A8A] text-white overflow-hidden rounded-[32px] p-2">
//               <CardHeader className="pb-2">
//                 <CardTitle className="flex items-center gap-3 text-xl font-bold">
//                   <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
//                     <Sparkles size={20} className="text-blue-100 animate-pulse fill-blue-100" />
//                   </div>
//                   Clinical AI Agent Workspace
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <Textarea 
//                   placeholder="Paste doctor's clinical notes, observations, or latest symptoms here..."
//                   className="bg-white/10 border-white/20 text-white placeholder:text-blue-100/30 min-h-[160px] rounded-[24px] focus-visible:ring-blue-300 text-lg py-5 px-6 border-2 transition-all"
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                 />
//                 <Button 
//                   onClick={handleAnalyze}
//                   disabled={loading || !note}
//                   className="bg-white text-blue-700 hover:bg-blue-50 font-black px-12 py-7 rounded-full shadow-xl transition-all active:scale-95 disabled:opacity-50 text-base tracking-tight h-auto"
//                 >
//                   {loading ? (
//                     <><Loader2 className="animate-spin mr-3" size={22} /> AI Agent is Thinking...</>
//                   ) : (
//                     <><Send size={20} className="mr-3" /> Process Clinical Note</>
//                   )}
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* Actionable Tasks Section */}
//             <div className="space-y-6 pb-20">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
//                   <ClipboardList size={24} className="text-blue-600" />
//                   Clinical Tasks Queue
//                   <Badge className="bg-blue-100 text-blue-700 font-black border-none px-3">{tasks.length}</Badge>
//                 </h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {tasks.length > 0 ? (
//                   tasks.map((task) => (
//                     <Card 
//                       key={task._id} 
//                       className={`border-slate-200/50 hover:border-blue-400 hover:shadow-xl transition-all duration-300 rounded-[24px] overflow-hidden group ${
//                         task.status === 'Completed' ? 'bg-slate-50' : 'bg-white'
//                       }`}
//                     >
//                       <CardContent className="p-6 flex justify-between items-center gap-4">
//                         <div className="space-y-3 flex-1">
//                           <p className={`text-lg font-bold leading-tight ${
//                             task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'
//                           }`}>
//                             {task.task}
//                           </p>
//                           <div className="flex gap-2">
//                             <Badge variant="secondary" className="text-[10px] font-black px-2.5 py-1 bg-slate-100 text-slate-500 uppercase tracking-widest border-none">
//                               {task.category}
//                             </Badge>
//                             {task.status === 'Completed' && (
//                               <Badge className="text-[10px] bg-green-100 text-green-700 font-bold border-none tracking-widest px-2.5 py-1">Verified</Badge>
//                             )}
//                           </div>
//                         </div>
//                         <button 
//                           onClick={() => handleToggleTask(task._id)}
//                           className={`p-3 rounded-full transition-all duration-300 active:scale-75 ${
//                             task.status === 'Completed' 
//                             ? 'text-green-500 bg-green-50' 
//                             : 'text-slate-200 hover:text-green-500 hover:bg-green-50'
//                           }`}
//                         >
//                           <CheckCircle2 size={36} strokeWidth={task.status === 'Completed' ? 2.5 : 1.5} />
//                         </button>
//                       </CardContent>
//                     </Card>
//                   ))
//                 ) : (
//                   <div className="col-span-full py-16 text-center bg-slate-100/50 rounded-[32px] border-2 border-dashed border-slate-200 space-y-3">
//                     <ClipboardList size={48} className="text-slate-300 mx-auto" />
//                     <p className="text-slate-500 font-semibold italic">No tasks found for {selectedPatient.name}.</p>
//                     <p className="text-xs text-slate-400">Use the Clinical Agent console above to extract tasks.</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//           </div>
//         ) : (
//           /* Welcome Screen (When no patient selected) */
//           <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-6">
//             <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-100 text-center space-y-6 max-w-md">
//               <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner">
//                 <Activity size={48} className="text-blue-500 animate-pulse" />
//               </div>
//               <div className="space-y-2">
//                 <h2 className="text-3xl font-black text-slate-800 tracking-tight">System Ready</h2>
//                 <p className="text-slate-500 font-medium leading-relaxed">
//                   Welcome to CareFlow Intelligence. Please select a patient from the sidebar to start.
//                 </p>
//               </div>
//               <div className="pt-4 flex gap-2 justify-center">
//                 <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" />
//                 <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
//                 <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
//               </div>
//             </div>
//             <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">CareFlow Healthcare Platform</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }








// "use client";

// import React, { useState, useEffect } from 'react';

// // Components aur API functions import
// import PatientSidebar from '@/components/patient-sidebar'; 
// import { getPatientTasks, analyzeNote, toggleTaskStatus } from "@/lib/api";

// // Icons import
// import { 
//   Loader2, Send, CheckCircle2, Sparkles, Activity, 
//   Calendar, Clock, ClipboardList 
// } from "lucide-react";

// // Shadcn UI components
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// // --- Types (Interfaces) ---
// interface Patient {
//   id: string;
//   name: string;
//   diagnosis: string;
//   status: string;
//   ward: string;
// }

// interface Task {
//   _id: string;
//   task: string;
//   category: string;
//   status: string;
// }

// export default function Dashboard() {
//   // --- States ---
//   const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [note, setNote] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [role, setRole] = useState<'doctor' | 'nurse'>('doctor');
//   // --- Real-time Clock Logic ---
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // --- Fetch Tasks when Patient is Selected ---
//   useEffect(() => {
//     if (selectedPatient) {
//       setTasks([]); // Clear old tasks for smooth transition
//       const fetchTasks = async () => {
//         try {
//           const data = await getPatientTasks(selectedPatient.id);
//           setTasks(Array.isArray(data) ? data : []); 
//         } catch (err) {
//           console.error("Error fetching tasks:", err);
//           setTasks([]);
//         }
//       };
//       fetchTasks();
//     }
//   }, [selectedPatient]);

//   // --- Toggle Task Status (Mark as Completed) ---
//   const handleToggleTask = async (taskId: string) => {
//     try {
//       await toggleTaskStatus(taskId);
//       if (selectedPatient) {
//         const updatedTasks = await getPatientTasks(selectedPatient.id);
//         setTasks(Array.isArray(updatedTasks) ? updatedTasks : []);
//       }
//     } catch (err) {
//       console.error("Status update failed:", err);
//     }
//   };

//   // --- AI Analysis Logic ---
//   const handleAnalyze = async () => {
//     if (!note.trim() || !selectedPatient) return;
//     setLoading(true);
//     try {
//       await analyzeNote(selectedPatient.id, note);
//       const updatedTasks = await getPatientTasks(selectedPatient.id);
//       setTasks(Array.isArray(updatedTasks) ? updatedTasks : []);
//       setNote(""); // Clear input after success
//     } catch (err) {
//       console.error("AI Analysis failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans antialiased text-slate-900">
      
//       {/* 1. Sidebar Component (Self-contained data fetching) */}
//       <PatientSidebar key={isAuthenticated ? role : "unauthenticated"} onSelectPatient={(p: any) => setSelectedPatient(p)} />

//       {/* 2. Main Workspace */}
//       <main className="flex-1 flex flex-col p-8 overflow-y-auto bg-slate-50/50">
        
//         {/* Top Info Bar */}
//         <div className="flex justify-between items-center mb-8">
//           <div className="flex items-center gap-6 text-slate-400 text-sm font-medium">
//             <div className="flex items-center gap-2">
//               <Calendar size={16} />
//               {currentTime.toLocaleDateString('en-us', { weekday: 'long', month: 'long', day: 'numeric' })}
//             </div>
//             <div className="flex items-center gap-2 border-l pl-6">
//               <Clock size={16} />
//               {currentTime.toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' })}
//             </div>
//           </div>
//           <Badge variant="outline" className="bg-white border-slate-200 text-slate-500 py-1.5 px-4 rounded-full">
//             AI Monitor Active v2.2
//           </Badge>
//         </div>

//         {selectedPatient ? (
//           <div className="max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
//             {/* Patient Profile Banner */}
//             <div className="flex justify-between items-end bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
//               <div>
//                 <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Active Patient File</p>
//                 <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
//                   {selectedPatient.name}
//                 </h1>
//                 <p className="text-slate-500 font-medium mt-3 flex items-center gap-2">
//                   <span className="bg-slate-100 px-2 py-0.5 rounded text-xs uppercase tracking-tighter">ID: {selectedPatient.id}</span>
//                   <span className="bg-slate-100 px-2 py-0.5 rounded text-xs uppercase tracking-tighter">Ward: {selectedPatient.ward || "General"}</span>
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-xs text-slate-400 font-bold uppercase mb-1">Status</p>
//                 <Badge className={`px-4 py-1.5 text-sm font-bold uppercase border-none ${
//                   selectedPatient.status === 'CRITICAL' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
//                 }`}>
//                   {selectedPatient.diagnosis}
//                 </Badge>
//               </div>
//             </div>
//             {/* Role Switcher - Insert here */}
//             <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200 mt-4 w-fit">
//               <button 
//               onClick={() => setRole('doctor')}
//               className={px-6 py-2 rounded-full text-[10px] font-bold transition-all ${role === 'doctor' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}} >DOCTOR ACCESS
//               </button> <button  onClick={() => setRole('nurse')}
//               className={px-6 py-2 rounded-full text-[10px] font-bold transition-all ${role === 'nurse' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}}>
//                 NURSE ACCESS </button> </div>

//             {/* AI Agent Interface */}
//             <Card className="border-none shadow-2xl bg-gradient-to-br from-[#2563EB] via-[#1E40AF] to-[#1E3A8A] text-white overflow-hidden rounded-[32px] p-1">
//               <CardHeader className="pb-2">
//                 <CardTitle className="flex items-center gap-3 text-xl font-bold">
//                   <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
//                     <Sparkles size={20} className="text-blue-100 animate-pulse fill-blue-100" />
//                   </div>
//                   Clinical AI Agent Workspace
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <Textarea 
//                   placeholder="Paste doctor's clinical notes, observations, or latest symptoms here..."
//                   className="bg-white/10 border-white/20 text-white placeholder:text-blue-100/30 min-h-[160px] rounded-[24px] focus-visible:ring-blue-300 text-lg py-5 px-6 border-2 transition-all"
//                   value={note}
//                   onChange={(e) => setNote(e.target.value)}
//                 />
//                 <Button 
//                   onClick={handleAnalyze}
//                   disabled={loading || !note.trim()}
//                   className="bg-white text-blue-700 hover:bg-blue-50 font-black px-12 py-7 rounded-full shadow-xl transition-all active:scale-95 disabled:opacity-50 text-base tracking-tight h-auto"
//                 >
//                   {loading ? (
//                     <><Loader2 className="animate-spin mr-3" size={22} /> AI Agent is Thinking...</>
//                   ) : (
//                     <><Send size={20} className="mr-3" /> Process Clinical Note</>
//                   )}
//                 </Button>
//               </CardContent>
//             </Card>

//             {/* Actionable Tasks Section */}
//             <div className="space-y-6 pb-20">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
//                   <ClipboardList size={24} className="text-blue-600" />
//                   Clinical Tasks Queue
//                   <Badge className="bg-blue-100 text-blue-700 font-black border-none px-3">{tasks.length}</Badge>
//                 </h3>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {tasks.length > 0 ? (
//                   tasks.map((task) => (
//                     <Card 
//                       key={task._id} 
//                       className={`border-slate-200/50 hover:border-blue-400 hover:shadow-xl transition-all duration-300 rounded-[24px] overflow-hidden group ${
//                         task.status === 'Completed' ? 'bg-slate-50' : 'bg-white'
//                       }`}
//                     >
//                       <CardContent className="p-6 flex justify-between items-center gap-4">
//                         <div className="space-y-3 flex-1">
//                           <p className={`text-lg font-bold leading-tight ${
//                             task.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'
//                           }`}>
//                             {task.task}
//                           </p>
//                           <div className="flex gap-2">
//                             <Badge variant="secondary" className="text-[10px] font-black px-2.5 py-1 bg-slate-100 text-slate-500 uppercase tracking-widest border-none">
//                               {task.category}
//                             </Badge>
//                             {task.status === 'Completed' && (
//                               <Badge className="text-[10px] bg-green-100 text-green-700 font-bold border-none tracking-widest px-2.5 py-1">Verified</Badge>
//                             )}
//                           </div>
//                         </div>
//                         <button 
//                           onClick={() => handleToggleTask(task._id)}
//                           className={`p-3 rounded-full transition-all duration-300 active:scale-75 ${
//                             task.status === 'Completed' 
//                             ? 'text-green-500 bg-green-50' 
//                             : 'text-slate-200 hover:text-green-500 hover:bg-green-50'
//                           }`}
//                         >
//                           <CheckCircle2 size={36} strokeWidth={task.status === 'Completed' ? 2.5 : 1.5} />
//                         </button>
//                       </CardContent>
//                     </Card>
//                   ))
//                 ) : (
//                   <div className="col-span-full py-16 text-center bg-slate-100/50 rounded-[32px] border-2 border-dashed border-slate-200 space-y-3">
//                     <ClipboardList size={48} className="text-slate-300 mx-auto" />
//                     <p className="text-slate-500 font-semibold italic">No tasks found for {selectedPatient.name}.</p>
//                     <p className="text-xs text-slate-400">Use the AI console above to extract tasks from notes.</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//           </div>
//         ) : (
//           /* Welcome Screen */
//           <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-6">
//             <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-100 text-center space-y-6 max-w-md">
//               <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner">
//                 <Activity size={48} className="text-blue-500 animate-pulse" />
//               </div>
//               <div className="space-y-2">
//                 <h2 className="text-3xl font-black text-slate-800 tracking-tight">System Ready</h2>
//                 <p className="text-slate-500 font-medium leading-relaxed">
//                   Welcome to CareFlow Healthcare Platform. Please select a patient from the sidebar to view clinical insights.
//                 </p>
//               </div>
//               <div className="pt-4 flex gap-2 justify-center">
//                 <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce" />
//                 <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
//                 <div className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
//               </div>
//             </div>
//             <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Arvind Kumar • B.Tech IT RKGIT</p>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }








//---------------------OLD FILE----------------------
"use client";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import React, { useState, useEffect } from 'react';
import PatientSidebar from '@/components/patient-sidebar'; 
import { getPatientTasks, analyzeNote, toggleTaskStatus } from "@/lib/api";
import { 
  Loader2, Send, CheckCircle2, Sparkles, Activity, 
  Calendar, Clock, ClipboardList, User, FileText 
} from "lucide-react";
import AuthOverlay from '@/components/AuthOverlay';
import { generateAudit } from '@/lib/api';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Patient {
  id: string;
  name: string;
  diagnosis: string;
  status: string;
  ward: string;
}

interface Task {
  _id: string;
  task: string;
  category: string;
  status: string;
}
interface AgentAudit {
  initial_condition: string;
  treatment_summary: string;
  final_outcome: string;
}
const templates = [
  { label: "Fever", text: "Give Tab. Paracetamol 500mg TDS for 3 days." },
  { label: "Checkup", text: "Check BP, SPO2 and Heart Rate every 4 hours." }
];

export default function Dashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [role, setRole] = useState<'doctor' | 'nurse' | 'patient'>('doctor');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [agentReport, setAgentReport] = useState<AgentAudit | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchLatestTasks();
    }
  }, [selectedPatient]);

  const fetchLatestTasks = async () => {
    if (!selectedPatient) return;
    try {
      const data = await getPatientTasks(selectedPatient.id);
      setTasks(Array.isArray(data) ? data : []); 
    } catch (err) {
      setTasks([]);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (role !== 'nurse') return alert("Only Nurses can update status.");
    try {
      await toggleTaskStatus(taskId);
      fetchLatestTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnalyze = async () => {
    if (!note.trim() || !selectedPatient) return;
    setLoading(true);
    try {
      await analyzeNote(selectedPatient.id, note);
      fetchLatestTasks();
      setNote(""); 
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadReport = () => {
  if (!selectedPatient) return alert("No patient selected");
  window.print();

  const completedCount = tasks.filter(t => t.status === 'Completed').length;
  const pendingCount = tasks.length - completedCount;

  // Simple string concatenation (No backticks used here)
  let reportData = "CAREFLOW HOSPITAL - CLINICAL REPORT\n";
  reportData += "====================================\n\n";
  reportData += "Patient Name: " + selectedPatient.name + "\n";
  reportData += "Patient ID: " + selectedPatient.id + "\n";
  reportData += "Ward: " + (selectedPatient.ward || "A-1") + "\n";
  reportData += "Current Status: " + (selectedPatient.diagnosis || "STABLE") + "\n\n";
  reportData += "TASK SUMMARY:\n";
  reportData += "Total Tasks assigned by AI: " + tasks.length + "\n";
  reportData += "Tasks Completed: " + completedCount + "\n";
  reportData += "Tasks Pending: " + pendingCount + "\n\n";
  reportData += "Report Generated on: " + new Date().toLocaleString() + "\n";

  // Create downloadable file
  const element = document.createElement("a");
  const file = new Blob([reportData], { type: 'text/plain' });

  element.href = URL.createObjectURL(file);
  element.download = "Report_" + selectedPatient.id + ".txt";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
const generateAgenticReport = async () => {
    if (!selectedPatient) return;
    setIsGeneratingReport(true);
    try {
      if (!note.trim()) throw new Error("Enter a source note before generating an audit");
      const data = await generateAudit(selectedPatient.id, note);

      let reportText = "CAREFLOW CLINICAL AUDIT\n";
      reportText += "=======================\n\n";
      reportText += "1. PATIENT NAME: " + selectedPatient.name + "\n";
      reportText += "2. PATIENT ID: " + selectedPatient.id + "\n";
      reportText += "3. INITIAL CONDITION: \n" + (data.initial_condition || "N/A") + "\n\n";
      reportText += "4. TREATMENT SUMMARY: \n" + (data.treatment_summary || "N/A") + "\n\n";
      reportText += "5. FINAL OUTCOME: \n" + (data.final_outcome || "N/A") + "\n\n";

      const element = document.createElement("a");
      const file = new Blob([reportText], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = "Audit_Report_" + selectedPatient.id + ".txt";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingReport(false);
    }
  }; 

return (
  <main className="relative h-screen w-full">
    {/* Line 951 - Start */}
{!isAuthenticated && (
  <AuthOverlay onLogin={(newRole, patient_id) => { // <-- 1. Yahan patientId ADD karo
    setRole(newRole as any);
    setIsAuthenticated(true);
    
    // 2. Ye pura 'if' block ab function ke ANDAR hona chahiye (Bracket ke pehle)
    if (newRole === 'patient' && patient_id) {
      setSelectedPatient({
        id: patient_id,
        name: "Patient " + patient_id,
        diagnosis: "STABLE",
        ward: "A-1"
      } as any);
    }
  }} /> // <-- 3. Closure yahan hoga
)}

    {/* 2. EXISTING DASHBOARD: Tera original code yahan se start hota hai */}
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-900">
      {/* Sidebar Wrapper: Isko h-full aur overflow-y-auto dena hai */}
      <div className="w-80 h-full border-r border-slate-200 overflow-y-auto bg-white shrink-0">
         {/* Yahan Condition dalo: Agar role 'patient' nahi hai tabhi ye dikhao */}
         {role !== 'patient' && (
          // <div className="w-80 h-full border-r border-slate-200 overflow-y-auto bg-white shrink-0">
            <PatientSidebar key={isAuthenticated ? role : "unauthenticated"} onSelectPatient={(p: any) => setSelectedPatient(p)} />

            
          )}
        </div>

      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-6 text-slate-400 text-sm">
            <span suppressHydrationWarning>
              {typeof window !== 'undefined' ? currentTime.toLocaleTimeString() : ""}
            </span>
          </div>

          {/* Role Switcher - Hiding it after login for security */}
          {false && (
            <div className="flex bg-white p-1 rounded-full border border-slate-200 shadow-sm">
              <button 
                onClick={() => setRole('doctor')}
                className={role === 'doctor' ? "bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold" : "text-slate-500 px-4 py-1.5 text-[10px] font-bold"}
              >
                DOCTOR
              </button>
              <button 
                onClick={() => setRole('nurse')}
                className={role === 'nurse' ? "bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold" : "text-slate-500 px-4 py-1.5 text-[10px] font-bold"}
              >
                NURSE
              </button>
              <button 
                onClick={() => setRole('patient')}
                className={role === 'patient' ? "bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-bold" : "text-slate-500 px-4 py-1.5 text-[10px] font-bold"}
              >
                PATIENT
              </button>
            </div>
          )}
        </div>

        {selectedPatient ? (
          <div className="max-w-4xl mx-auto w-full space-y-8">
            
            {/* Patient Header */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">{selectedPatient.name}</h1>
                <p className="text-slate-400 text-sm mt-1">ID: {selectedPatient.id} | Ward: {selectedPatient.ward || "A-1"}</p>
              </div>
              <Badge className={selectedPatient.status === 'CRITICAL' ? "bg-red-100 text-red-600 px-4 py-1" : "bg-green-100 text-green-600 px-4 py-1"}>
                {selectedPatient.diagnosis || "STABLE"}
              </Badge>
            </div>

            {/* AI Console for Doctor */}
            {role === 'doctor' && (
              <Card className="bg-blue-700 text-white rounded-3xl border-none p-6 shadow-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles size={20} /> Doctor Clinical Workspace
                </h2>
                <div className="flex gap-2 mb-4">
                  {templates.map(t => (
                    <button key={t.label} onClick={() => setNote(t.text)} className="bg-white/10 text-[10px] px-3 py-1 rounded-full border border-white/20">
                      {t.label}
                    </button>
                  ))}
                </div>
                <Textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="bg-white/10 border-white/20 text-white rounded-2xl mb-4 placeholder:text-blue-200"
                  placeholder="Paste clinical notes here..."
                />
                <Button onClick={handleAnalyze} disabled={loading} className="w-full bg-white text-blue-700 hover:bg-slate-100 rounded-full font-bold h-12">
                  {loading ? "AI Processing..." : "Generate Tasks"}
                </Button>
              </Card>
            )}

            {/* 1. SEPERATE REPORT BUTTON FOR PATIENT ONLY */}
            {role === 'patient' && (
              <div className="mb-8 p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex flex-col items-center text-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
                  <FileText size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">Patient Care Summary</h3>
                  <p className="text-slate-500 text-xs">Download your full medical task report</p>
                </div>
                <button
  onClick={generateAgenticReport}
  disabled={isGeneratingReport}
  className="w-full max-w-[250px] bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
>
  {isGeneratingReport ? "AUDITING..." : "DOWNLOAD AI AUDIT REPORT"}
</button>
              </div>
            )}

            {/* Task Queue */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ClipboardList size={20} className="text-blue-600" />
                Task Management ({tasks.filter(t => t.status !== 'Completed').length})
              </h3>
              
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <Card key={task._id} className="p-4 rounded-2xl flex justify-between items-center bg-white border-slate-100 shadow-sm">
                    <div>
                      <p className={task.status === 'Completed' ? "text-slate-400 line-through font-bold" : "text-slate-800 font-bold"}>
                        {task.task}
                      </p>
                      <Badge variant="secondary" className="text-[9px] mt-1">{task.category}</Badge>
                    </div>
                    <button 
                      onClick={() => handleToggleTask(task._id)}
                      disabled={role === 'patient'}
                      className={task.status === 'Completed' ? "text-green-500" : "text-slate-300"}
                    >
                      <CheckCircle2 size={32} />
                    </button>
                  </Card>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 font-bold">
            Please select a patient to start.
          </div>
        )}
      </main>
    </div>
  
<div id="printable-report" style={{ display: 'none', width: '800px', padding: '40px', background: '#ffffff', color: '#000000', fontFamily: 'Arial, sans-serif' }}>
  <div style={{ borderBottom: '4px solid #0000ff', paddingBottom: '15px', marginBottom: '25px' }}>
    <h1 style={{ fontSize: '26px', color: '#000000', margin: 0, fontWeight: 'bold' }}>CAREFLOW CLINICAL AUDIT</h1>
    <p style={{ margin: '5px 0' }}>Patient: {selectedPatient?.name} | ID: {selectedPatient?.id}</p>
  </div>

  <div style={{ marginBottom: '20px' }}>
    <h3 style={{ color: '#0000ff', fontWeight: 'bold' }}>1. INITIAL CONDITION</h3>
    <div style={{ background: '#f8f8f8', padding: '12px', border: '1px solid #cccccc' }}>
      {agentReport?.initial_condition || "Analyzing..."}
    </div>
  </div>

  <div style={{ marginBottom: '20px' }}>
    <h3 style={{ color: '#0000ff', fontWeight: 'bold' }}>2. TREATMENT SUMMARY</h3>
    <div style={{ background: '#f8f8f8', padding: '12px', border: '1px solid #cccccc' }}>
      {agentReport?.treatment_summary || "Processing..."}
    </div>
  </div>

  <div style={{ marginBottom: '20px' }}>
    <h3 style={{ color: '#0000ff', fontWeight: 'bold' }}>3. FINAL OUTCOME</h3>
    <div style={{ background: '#e6fffa', padding: '12px', border: '1px solid #38b2ac', fontWeight: 'bold' }}>
      {agentReport?.final_outcome || "Evaluating..."}
    </div>
  </div>

  <div style={{ marginTop: '40px', textAlign: 'right', borderTop: '1px solid #eeeeee', paddingTop: '15px' }}>
    <p style={{ fontSize: '12px' }} suppressHydrationWarning>{new Date().toLocaleString()}</p>
  </div>
</div>
  </main>
 );
}