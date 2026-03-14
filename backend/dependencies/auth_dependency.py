from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import jwt, JWTError
from config import JWT_SECRET, JWT_ALGORITHM

security = HTTPBearer()

def get_current_user(token=Depends(security)):

    try:
        payload = jwt.decode(token.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


def require_role(required_role):

    def role_checker(user=Depends(get_current_user)):

        if user["role"] != required_role:
            raise HTTPException(status_code=403, detail="Unauthorized")

        return user

    return role_checker