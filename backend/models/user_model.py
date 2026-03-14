from pydantic import BaseModel, EmailStr
from typing import Optional

class User(BaseModel):
    email: EmailStr
    password: str
    role: str  # "patient" or "doctor"
    doctor_code: Optional[str] = None  # Only for doctors

class UserInDB(User):
    hashed_password: str