from pymongo import MongoClient

MONGO_URL = "YOUR_MONGODB_ATLAS_URL"

client = MongoClient(MONGO_URL)

db = client["ai_chronomed"]

users_collection = db["users"]
profiles_collection = db["patient_profiles"]
schedules_collection = db["schedules"]
adherence_collection = db["adherence_logs"]