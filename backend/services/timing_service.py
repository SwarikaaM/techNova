def recommend_time(drug: str, wake_time: str, sleep_time: str):

    if not drug:
        return {
            "drug": "unknown",
            "recommended_time": "08:00",
            "reason": "Default timing due to missing drug information"
        }

    drug = drug.lower()

    # simple circadian logic
    if drug in ["atorvastatin", "simvastatin"]:
        recommended = "21:00"
        reason = "Cholesterol synthesis peaks at night"

    elif drug in ["metformin"]:
        recommended = "20:00"
        reason = "Improves overnight glucose regulation"

    elif drug in ["amlodipine", "losartan"]:
        recommended = "22:00"
        reason = "Night dosing improves blood pressure control"

    else:
        recommended = "08:00"
        reason = "Default morning dose"

    return {
        "drug": drug,
        "recommended_time": recommended,
        "reason": reason
    }