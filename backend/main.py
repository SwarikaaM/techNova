from fastapi import FastAPI
from routes import patient_routes
from routes import doctor_routes

app = FastAPI()

app.include_router(patient_routes.router)
app.include_router(doctor_routes.router)