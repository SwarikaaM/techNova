import secrets
import string
from database import db_connection


async def generate_unique_doctor_code():
    """Generates a unique doctor code like DR-AB12CD"""

    while True:
        # Generate random 6-character code
        suffix = ''.join(
            secrets.choice(string.ascii_uppercase + string.digits)
            for _ in range(6)
        )

        code = f"DR-{suffix}"

        # Check if code already exists
        existing = await db_connection.db.users.find_one(
            {"doctor_code": code}
        )

        if not existing:
            return code