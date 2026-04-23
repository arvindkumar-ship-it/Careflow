import os
import json
from datetime import datetime
from typing import List
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from groq import Groq
from faker import Faker

# 1. Setup & Environment
load_dotenv()
app = FastAPI()
fake = Faker()

# CORS logic - Taaki frontend connect ho sake
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB & Groq Keys
MONGO_URL = os.getenv("MONGO_URL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = AsyncIOMotorClient(MONGO_URL)
db = client.careflow
tasks_collection = db.get_collection("tasks")
patients_collection = db.get_collection("patients")
groq_client = Groq(api_key=GROQ_API_KEY)

# 2. Models
class AnalysisRequest(BaseModel):
    note: str

# 3. Fake Data Generator (Step 1)
async def seed_patients():
    count = await patients_collection.count_documents({})
    if count == 0:
        print("🚀 Seeding 50 fake patients...")
        patients_list = []
        for _ in range(50):
            patients_list.append({
                "name": fake.name(),
                "status": fake.random_element(elements=('CRITICAL', 'STABLE')),
                "diagnosis": fake.random_element(elements=('High Fever', 'Diabetes', 'Hypertension', 'Flu')),
                "ward": f"{fake.random_letter().upper()}-{fake.random_int(1, 20)}",
                "created_at": datetime.utcnow()
            })
        await patients_collection.insert_many(patients_list)
        print("✅ 50 Patients seeded successfully!")

@app.on_event("startup")
async def startup_event():
    await seed_patients()

# 4. API ENDPOINTS (Step 2)

# A. Get All Patients (Real Database se)
@app.get("/api/patients")
async def get_patients():
    patients = []
    cursor = patients_collection.find({}).limit(50)
    async for doc in cursor:
        patients.append({
            "id": str(doc["_id"]), # MongoDB ID ko string banana zaroori hai
            "name": doc["name"],
            "status": doc["status"],
            "diagnosis": doc["diagnosis"],
            "ward": doc.get("ward", "N/A")
        })
    return patients

# B. Get Tasks for Specific Patient
@app.get("/api/tasks/{patient_id}")
async def get_tasks(patient_id: str):
    tasks = []
    cursor = tasks_collection.find({"patient_id": patient_id}).sort("created_at", -1)
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        tasks.append(doc)
    return tasks

# C. AI Analysis & Task Extraction
# @app.post("/api/analyze/{patient_id}")
# async def analyze(patient_id: str, request: AnalysisRequest):
#     try:
#         prompt = f"Extract medical tasks from this note as a JSON list. Note: {request.note}. Format: [{{'task': '...', 'category': '...'}}]"
        
#         completion = groq_client.chat.completions.create(
#             messages=[{"role": "user", "content": prompt}],
#             model="llama3-8b-8192",
#             response_format={"type": "json_object"}
#         )
        
#         res = json.loads(completion.choices[0].message.content)
#         tasks_list = res.get("tasks", res) if isinstance(res, dict) else res
        
#         final_tasks = []
#         for t in tasks_list:
#             final_tasks.append({
#                 "patient_id": patient_id,
#                 "task": t.get("task"),
#                 "category": t.get("category", "General"),
#                 "status": "Pending",
#                 "created_at": datetime.utcnow().isoformat()
#             })
        
#         if final_tasks:
#             await tasks_collection.insert_many(final_tasks)
#         return {"status": "success", "count": len(final_tasks)}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analyze/{patient_id}")
async def analyze(patient_id: str, request: AnalysisRequest):
    try:
        # Prompt ko aur strict kar diya taaki AI faltu bakwas na kare
        #prompt = f"Return ONLY a JSON object with a key 'tasks' containing a list of objects. Each object must have 'task' and 'category'. Note: {request.note}"
        prompt = f"""
        You are a Clinical Data Extractor. Your ONLY job is to extract medical orders ALREADY GIVEN by the doctor in the note below.
        STRICT RULES:
        1. DO NOT suggest any new medicines or treatments.
        2. DO NOT provide medical advice.
        3. ONLY extract medicines, dosages, and tests that are EXPLICITLY MENTIONED in the doctor's note.
        4. If the doctor hasn't mentioned a specific medicine/test, return an empty tasks list.
        CRITICAL: You must extract EVERY medical detail. 
        If there are 15 medicines, I need 15 task objects. 
        DO NOT summarize or truncate the list. 
        The JSON must be complete.
        Format strictly as JSON: {{"tasks": [{{"task": "Exact text from note", "category": "Medication/Test/Vital"}}]}}
        Doctor's Note: {request.note} """
        completion = groq_client.chat.completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
            temperature=0.1,  # Taaki AI faltu ki baatein na kare, strictly logic par rahe
            max_tokens=3072   # Taaki lamba list hone par bhi response pura aaye
        )
        raw_content = completion.choices[0].message.content
        print(f"🤖 AI Response: {raw_content}") # Terminal mein check karo ye kya aa raha hai
        
        res = json.loads(raw_content)
        
        # Check karo ki 'tasks' key hai ya nahi
        tasks_list = res.get("tasks", []) if isinstance(res, dict) else []
        
        final_tasks = []
        for t in tasks_list:
            final_tasks.append({
                "patient_id": patient_id,
                "task": t.get("task", "Unknown Task"),
                "category": t.get("category", "General"),
                "status": "Pending",
                "created_at": datetime.utcnow().isoformat()
            })
        
        if final_tasks:
            await tasks_collection.insert_many(final_tasks)
            return {"status": "success", "count": len(final_tasks)}
        else:
            return {"status": "no tasks found"}

    except Exception as e:
        print(f"❌ ERROR: {str(e)}") # Ye terminal mein asli error dikhayega
        raise HTTPException(status_code=500, detail=str(e))

# D. Toggle Task Status
@app.patch("/api/tasks/{task_id}")
async def toggle_task(task_id: str):
    task = await tasks_collection.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    new_status = "Completed" if task["status"] == "Pending" else "Pending"
    await tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"status": new_status}}
    )
    return {"status": "updated", "new_status": new_status}

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8000)

import uuid

@app.post("/api/patients")
async def register_patient(patient: dict):
    try:
        # Unique ID aur default Ward assign karna
        patient["id"] = str(uuid.uuid4())[:8].upper() # Short Unique ID e.g. CF72A1
        if "ward_id" not in patient:
            patient["ward_id"] = "WARD-01" 
        
        await patients_collection.insert_one(patient)
        return {"status": "success", "patient": patient}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/api/agent-audit/{patient_id}")
async def agent_audit(patient_id: str, request: AnalysisRequest):
    try:
        # 1. Alag Prompt jo sirf 3 points nikalega
        audit_prompt = f"""
        You are a Clinical Audit Agent. Analyze these doctor notes: {request.note}
        Return ONLY a JSON object with these 3 keys:
        {{
          "initial_condition": "Patient's state before treatment",
          "treatment_summary": "Summary of actions taken",
          "final_outcome": "Current medical status"
        }}
        """

        # 2. Groq Call (Alag variable names ke saath taaki purana code na phate)
        audit_completion = groq_client.chat.completions.create(
            messages=[{"role": "user", "content": audit_prompt}],
            model="llama-3.1-8b-instant",
            response_format={"type": "json_object"},
        )

        # 3. Response handle karo
        audit_data = json.loads(audit_completion.choices[0].message.content)
        return audit_data

    except Exception as e:
        print(f"Audit Error: {e}")
        raise HTTPException(status_code=500, detail="Audit failed")
    
if __name__ == "__main__":
    import uvicorn
    # PEHLE port define karo
    port_number = int(os.environ.get("PORT", 8000)) 
    # PHIR uvicorn chalao
    uvicorn.run(app, host="0.0.0.0", port=port_number)
