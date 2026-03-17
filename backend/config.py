import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")

# JWT configuration
JWT_SECRET = os.getenv("JWT_SECRET", "hackathon-secret-123")
JWT_ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = int(os.getenv("TOKEN_EXPIRE_MINUTES", 60))