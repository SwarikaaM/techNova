import requests

def generate_ai_schedule(data):

    prompt = f"""
    Patient chronotype: {data.chronotype}
    Diseases: {data.diseases}
    Medications: {data.medications}
    Age: {data.age}
    Weight: {data.weight}
    Gender: {data.gender}
    Cycle phase: {data.cycle_phase}

    Generate medication timing based on circadian rhythm.
    Return JSON with schedule and lifestyle.
    """

    response = requests.post(
        "https://api.featherless.ai/generate",
        json={"prompt": prompt}
    )

    result = response.json()

    return result

# def generate_ai_schedule(data):

#     schedule = []

#     for med in data.medications:
#         schedule.append({
#             "drug": med,
#             "time": "08:00"
#         })

#     result = {
#         "schedule": schedule,
#         "lifestyle": [
#             "eat breakfast within 1 hour of waking",
#             "avoid late night meals",
#             "maintain consistent sleep schedule"
#         ]
#     }

#     return result