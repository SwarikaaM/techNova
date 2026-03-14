from fastapi import APIRouter
from models.schedule_model import ScheduleRequest
from services.ai_service import generate_ai_schedule
from services.adherence_service import log_medication
from database import schedules_collection

router = APIRouter()


@router.post("/generate-schedule")
def generate_schedule(data: ScheduleRequest):

    ai_result = generate_ai_schedule(data)

    schedule_doc = {
        "patient_id": "123",
        "diseases": data.diseases,
        "medications": data.medications,
        "schedule": ai_result["schedule"],
        "lifestyle": ai_result["lifestyle"],
        "shared_with_doctor": None,
        "status": "ai_generated"
    }

    schedules_collection.insert_one(schedule_doc)

    return ai_result


@router.post("/share-with-doctor")
def share_with_doctor(patient_id: str, doctor_code: str):

    schedules_collection.update_one(
        {"patient_id": patient_id},
        {"$set": {"shared_with_doctor": doctor_code}}
    )

    return {"message": "Shared with doctor"}


@router.post("/log-medication")
def log_med(drug: str, taken: bool):

    return log_medication("123", drug, taken)