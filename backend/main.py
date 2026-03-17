from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import connect_to_mongo, close_mongo_connection

# Developer 1 routes
from routes.auth_routes import router as auth_router

# Your routes
from routes.patient_routes import router as patient_router
from routes.doctor_routes import router as doctor_router
from routes.analyze import router as analyze_router


app = FastAPI(title="ChronoMed API")

# Allow frontend (React) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication routes
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])

# Your routes
app.include_router(patient_router, tags=["Patient"])
app.include_router(doctor_router, tags=["Doctor"])
app.include_router(analyze_router)


@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()


@app.get("/")
def health_check():
    return {"status": "running", "db": "connected"}