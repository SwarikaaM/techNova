from database import get_schedules_collection


async def get_doctor_patients(doctor_code):

    schedules_collection = get_schedules_collection()

    cursor = schedules_collection.find({
        "shared_with_doctor": doctor_code
    })

    patients = await cursor.to_list(length=100)

    result = []

    for p in patients:
        p["_id"] = str(p["_id"])
        result.append(p)

    return result


async def modify_schedule(patient_id, drug, new_time):

    schedules_collection = get_schedules_collection()

    await schedules_collection.update_one(
        {"patient_id": patient_id, "schedule.drug": drug},
        {
            "$set": {
                "schedule.$.time": new_time,
                "status": "doctor_modified"
            }
        }
    )

    return {"message": "Schedule updated"}