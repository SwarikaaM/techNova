from database import get_adherence_collection
from datetime import date


async def log_medication(patient_id, drug, taken):

    adherence_collection = get_adherence_collection()

    log = {
        "patient_id": patient_id,
        "drug": drug,
        "date": str(date.today()),
        "taken": taken
    }

    await adherence_collection.insert_one(log)

    return {"message": "Log saved"}