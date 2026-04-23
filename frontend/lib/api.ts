// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:8000', // Tumhara FastAPI port
// });

// export const getPatients = () => api.get('/api/patients');
// export const getPatientTasks = (id: string) => api.get(`/api/tasks/${id}`);
// export const analyzeNote = (id: string, note: string) => api.post(`/api/analyze/${id}`, { note });
// export const toggleTaskStatus = (id: string) => api.patch(`/api/tasks/${id}


import axios from 'axios';

// 1. Axios Instance Setup
// Dhyaan rakhna: 'baseURL' likhna zaroori hai, varna 404 error aayega.
const api = axios.create({
  baseURL: 'https://careflow-backend-4l8t.onrender.com/api', // Tumhara FastAPI backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. API Functions (Zero to End)

// A. Sare Patients ki list mangne ke liye (Sidebar ke liye)
export const getPatients = async () => {
  try {
    const response = await api.get('/patients');
    return response.data; // Backend se [{}, {}, ...] aayega
  } catch (error: any) {
    console.error("❌ Error fetching patients:", error.message);
    return []; // Error aane par empty list bhejenge taaki app crash na ho
  }
};

// B. Kisi ek patient ke saare tasks (MongoDB se) lane ke liye
export const getPatientTasks = async (patientId: string) => {
  try {
    const response = await api.get(`/tasks/${patientId}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Error fetching tasks:", error.message);
    return [];
  }
};

// C. Clinical Note ko AI (Groq) se analyze karwane ke liye
export const analyzeNote = async (patientId: string, note: string) => {
  try {
    const response = await api.post(`/analyze/${patientId}`, { note });
    return response.data;
  } catch (error: any) {
    console.error("❌ AI Analysis failed:", error.message);
    throw error; // UI ko pata chalna chahiye ki error aaya hai
  }
};

// D. Task ka status (Pending/Completed) toggle karne ke liye
export const toggleTaskStatus = async (taskId: string) => {
  try {
    const response = await api.patch(`/tasks/${taskId}`);
    return response.data;
  } catch (error: any) {
    console.error("❌ Task toggle failed:", error.message);
    throw error;
  }
};

export default api;