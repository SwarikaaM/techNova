from fastapi import APIRouter
from services.doctor_service import get_doctor_patients, modify_schedule

router = APIRouter()


@router.get("/doctor/patients")
def get_patients(doctor_code: str):

    return get_doctor_patients(doctor_code)


@router.post("/modify-schedule")
def update_schedule(patient_id: str, drug: str, new_time: str):

    return modify_schedule(patient_id, drug, new_time)