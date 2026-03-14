from database import adherence_collection
from datetime import date

def log_medication(patient_id, drug, taken):

    log = {
        "patient_id": patient_id,
        "drug": drug,
        "date": str(date.today()),
        "taken": taken
    }

    adherence_collection.insert_one(log)

    return {"message": "Log saved"}