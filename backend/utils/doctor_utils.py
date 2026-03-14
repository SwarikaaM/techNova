import secrets
import string
from backend.database import db_connection

async def generate_unique_doctor_code():
    """Generates a unique 6-character code prefixed with DR-"""
    while True:
        # Generate a random 6-character string (Uppercase + Digits)
        suffix = ''.join(secrets.choice(string.ascii_uppercase + string.string.digits) for _ in range(6))
        code = f"DR-{suffix}"
        
        # Check if the code already exists in MongoDB
        existing = await db_connection.db.users.find_one({"doctor_code": code})
        
        if not existing:
            return code