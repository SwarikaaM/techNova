from fastapi import APIRouter, HTTPException, status
from backend.database import db_connection
from backend.utils.auth_utils import hash_password, verify_password, create_access_token
from pydantic import BaseModel, EmailStr

router = APIRouter()

class AuthRequest(BaseModel):
    email: EmailStr
    password: str
    role: str = "patient" # default

@router.post("/register")
async def register(req: AuthRequest):
    user_exists = await db_connection.db.users.find_one({"email": req.email})
    if user_exists:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user_data = {
        "email": req.email,
        "password": hash_password(req.password),
        "role": req.role
    }
    await db_connection.db.users.insert_one(user_data)
    return {"message": "User created successfully"}

@router.post("/login")
async def login(req: AuthRequest):
    user = await db_connection.db.users.find_one({"email": req.email})
    if not user or not verify_password(req.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user["email"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "role": user["role"]}