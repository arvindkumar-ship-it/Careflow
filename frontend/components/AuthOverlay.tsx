'use client'
import { useState } from 'react'
import { loginAccount } from '@/lib/api'

export default function AuthOverlay({ onLogin }: { onLogin: (role: string, id?: string) => void }) {
  const [view, setView] = useState<'select' | 'staff' | 'patient'>('select');
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async () => {
    try {
      const account = await loginAccount(id, pass);
      onLogin(account.role, account.patient_id);
    } catch {
      alert("Login failed. Check your configured account credentials.");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl">
        <h2 className="text-2xl font-black text-slate-900 text-center mb-8 tracking-tight">CareFlow Portal</h2>
        
        {view === 'select' && (
          <div className="space-y-4">
            <button onClick={() => setView('staff')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition">Medical Staff Login</button>
            <button onClick={() => setView('patient')} className="w-full py-4 border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition">Patient Portal</button>
          </div>
        )}

        {view === 'staff' && (
          <div className="space-y-4">
            <input placeholder="Staff Username" value={id} onChange={(e)=>setId(e.target.value)} className="w-full p-4 border rounded-2xl text-sm" />
            <input type="password" placeholder="Password" value={pass} onChange={(e)=>setPass(e.target.value)} className="w-full p-4 border rounded-2xl text-sm" />
            <button onClick={handleLogin} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">Login as Staff</button>
            <button onClick={() => setView('select')} className="w-full text-slate-400 text-xs font-bold uppercase">Back</button>
          </div>
        )}

        {view === 'patient' && (
          <div className="space-y-4">
            <input placeholder="Patient Username" value={id} onChange={(e)=>setId(e.target.value)} className="w-full p-4 border rounded-2xl text-sm" />
            <input type="password" placeholder="Password" value={pass} onChange={(e)=>setPass(e.target.value)} className="w-full p-4 border rounded-2xl text-sm" />
            <button onClick={handleLogin} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200">View My Careflow</button>
            <button onClick={() => setView('select')} className="w-full text-slate-400 text-xs font-bold uppercase">Back</button>
          </div>
        )}
      </div>
    </div>
  )
}