from pydantic import BaseModel, EmailStr
from typing import Optional


# Model used when registering a user
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str  # "patient" or "doctor"


# Model stored in the database
class UserInDB(BaseModel):
    email: EmailStr
    password: str  # hashed password
    role: str
    doctor_code: Optional[str] = None