from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import connect_to_mongo, close_mongo_connection
from backend.routes.analyze import router
from backend.routes.auth_routes import router as auth_router

app = FastAPI(title="ChronoMed API")

# VERY IMPORTANT: This allows React/Vue/Flutter to hit your API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

@app.get("/")
def health_check():
    return {"status": "running", "db": "connected"}