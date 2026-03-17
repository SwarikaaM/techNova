from fastapi import APIRouter, HTTPException
from database import db_connection
from utils.auth_utils import hash_password, verify_password, create_access_token
from pydantic import BaseModel, EmailStr

from utils.doctor_utils import generate_unique_doctor_code

router = APIRouter()


class AuthRequest(BaseModel):
    email: EmailStr
    password: str
    role: str = "patient"  # default role


@router.post("/register")
async def register(req: AuthRequest):

    user_exists = await db_connection.db.users.find_one({"email": req.email})

    if user_exists:
        raise HTTPException(status_code=400, detail="User already exists")

    doctor_code = None

    if req.role == "doctor":
        doctor_code = await generate_unique_doctor_code()

    user_data = {
        "email": req.email,
        "password": hash_password(req.password),
        "role": req.role,
        "doctor_code": doctor_code
    }

    await db_connection.db.users.insert_one(user_data)

    return {
        "message": "User created successfully",
        "doctor_code": doctor_code
    }


@router.post("/login")
async def login(req: AuthRequest):

    user = await db_connection.db.users.find_one({"email": req.email})

    if not user or not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": user["email"],
        "role": user["role"]
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"]
    }