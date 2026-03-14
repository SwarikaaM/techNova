from fastapi import APIRouter
from models.schedule_model import ScheduleRequest
from services.ai_service import generate_ai_schedule
from services.adherence_service import log_medication
from database import get_schedules_collection
from database import db_connection

router = APIRouter()


@router.post("/generate-schedule")
async def generate_schedule(data: ScheduleRequest):

    schedules_collection = get_schedules_collection()

    ai_result = await generate_ai_schedule(data)

    schedule_doc = {
        "patient_id": "123",
        "diseases": data.diseases,
        "medications": data.medications,
        "schedule": ai_result["schedule"],
        "lifestyle": ai_result["lifestyle"],
        "shared_with_doctor": None,
        "status": "ai_generated"
    }

    await schedules_collection.insert_one(schedule_doc)

    return ai_result