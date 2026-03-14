import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()


class Database:
    client: AsyncIOMotorClient = None
    db = None


db_connection = Database()


async def connect_to_mongo():
    db_connection.client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
    db_connection.db = db_connection.client["chronomed_db"]
    print("Connected to MongoDB!")


async def close_mongo_connection():
    db_connection.client.close()


# Collection helpers (for easier import in routes/services)

def get_users_collection():
    return db_connection.db["users"]

def get_profiles_collection():
    return db_connection.db["patient_profiles"]

def get_schedules_collection():
    return db_connection.db["schedules"]

def get_adherence_collection():
    return db_connection.db["adherence_logs"]