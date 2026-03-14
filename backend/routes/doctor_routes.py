from fastapi import APIRouter
from services.doctor_service import get_doctor_patients, modify_schedule

router = APIRouter(tags=["Doctor"])


@router.get("/doctor/patients")
async def get_patients(doctor_code: str):

    return await get_doctor_patients(doctor_code)


@router.post("/modify-schedule")
async def update_schedule(patient_id: str, drug: str, new_time: str):

    return await modify_schedule(patient_id, drug, new_time)