import os
import random
from pymongo import MongoClient
from faker import Faker
from dotenv import load_dotenv
from datetime import datetime

# Environment variables load karo
load_dotenv()

# Faker setup (Indian names ke liye)
fake = Faker('en_IN')

# MongoDB Connection
try:
    client = MongoClient(os.getenv("MONGODB_URL"))
    db = client.careflow
    print("Connecting to MongoDB...")
except Exception as e:
    print(f"Connection Error: {e}")

def seed_data():
    print("🧹 Cleaning old data...")
    db.patients.delete_many({}) 
    
    patients = []
    diseases = ["Dengue", "Pneumonia", "Type 2 Diabetes", "Hypertension", "Post-Op Recovery"]
    wards = ["ICU", "Ward A", "Ward B", "Emergency"]
    status_list = ["Critical", "Stable", "Under Observation"]

    print("🩺 Generating 50 realistic patients...")
    for i in range(50):
        diag = random.choice(diseases)
        patients.append({
            "patient_id": f"CF-2026-{100 + i}",
            "name": fake.name(),
            "age": random.randint(18, 85),
            "gender": random.choice(["Male", "Female"]),
            "diagnosis": diag,
            "description": f"Patient admitted with symptoms of {diag.lower()}. Regular monitoring required.",
            "status": random.choice(status_list),
            "ward": random.choice(wards),
            "admitted_at": datetime.utcnow()
        })
    
    db.patients.insert_many(patients)
    print("✅ Success! 50 Patients injected into CareFlow DB.")

if __name__ == "__main__":
    seed_data()