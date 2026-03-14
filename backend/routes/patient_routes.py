
from fastapi import APIRouter
from models.schedule_model import ScheduleRequest
from services.ai_service import generate_ai_schedule
from services.chronotype_service import calculate_chronotype
from database import get_schedules_collection


router = APIRouter()


@router.post("/generate-schedule")
async def generate_schedule(data: ScheduleRequest):

    schedules_collection = get_schedules_collection()

    # Calculate chronotype from MEQ inputs
    chronotype = calculate_chronotype(
        data.wake_time,
        data.sleep_time
    )

    # Attach chronotype to data object
    data.chronotype = chronotype

    ai_result = await generate_ai_schedule(data)

    schedule_doc = {
        "patient_id": "123",

        "chronotype": chronotype,

        "wake_time": data.wake_time,
        "sleep_time": data.sleep_time,
        "night_shift": data.night_shift,
        "caffeine_intake": data.caffeine_intake,

        "age": data.age,
        "weight": data.weight,
        "height": data.height,

        "gender": data.gender,
        "menstrual_phase": data.menstrual_phase,
        "heart_rate": data.heart_rate,

        "diseases": data.diseases,
        "medications": data.medications,

        "schedule": ai_result.get("schedule", []),
        "lifestyle": ai_result.get("lifestyle", []),
        "interaction_warning": ai_result.get("interaction_warning"),

        "shared_with_doctor": None,
        "status": "ai_generated"
    }

    await schedules_collection.insert_one(schedule_doc)

    return ai_result
