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
    db_connection.db = db_connection.client.chronomed_db # Database name
    print("Connected to MongoDB!")

async def close_mongo_connection():
    db_connection.client.close()