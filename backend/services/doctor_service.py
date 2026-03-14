from database import schedules_collection

def get_doctor_patients(doctor_code):

    patients = schedules_collection.find({
        "shared_with_doctor": doctor_code
    })

    result = []

    for p in patients:
        p["_id"] = str(p["_id"])
        result.append(p)

    return result


def modify_schedule(patient_id, drug, new_time):

    schedules_collection.update_one(
        {"patient_id": patient_id, "schedule.drug": drug},
        {
            "$set": {
                "schedule.$.time": new_time,
                "status": "doctor_modified"
            }
        }
    )

    return {"message": "Schedule updated"}