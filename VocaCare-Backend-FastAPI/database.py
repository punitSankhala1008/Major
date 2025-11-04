import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
load_dotenv()

client = AsyncIOMotorClient(os.getenv("MONGO_DB_URI"))
db = client.get_database("medical_records")
patient_registrations = db.get_collection("patient_registrations")
