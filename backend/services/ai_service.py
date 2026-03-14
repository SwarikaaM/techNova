import os
import asyncio
import requests
from openai import OpenAI


# Featherless / OpenAI client
client = OpenAI(
    api_key=os.getenv("FEATHERLESS_API_KEY"),
    base_url="https://api.featherless.ai/v1"
)


# -----------------------------
# AI SCHEDULE GENERATION
# -----------------------------
async def generate_ai_schedule(data):

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

    loop = asyncio.get_event_loop()

    try:
        response = await loop.run_in_executor(
            None,
            lambda: requests.post(
                "https://api.featherless.ai/generate",
                json={"prompt": prompt}
            )
        )

        result = response.json()

        return result

    except Exception as e:
        print("AI schedule generation error:", e)

        # fallback (hackathon safe)
        schedule = []
        for med in data.medications:
            schedule.append({
                "drug": med,
                "time": "08:00"
            })

        return {
            "schedule": schedule,
            "lifestyle": [
                "eat breakfast within 1 hour of waking",
                "avoid late night meals",
                "maintain consistent sleep schedule"
            ]
        }


# -----------------------------
# AI EXPLANATION GENERATION
# -----------------------------
async def generate_explanation(context: dict) -> str:
    """
    Generate a human-readable explanation of schedule & drug info.
    """

    prompt = (
        "You are a medical assistant. "
        "Given the schedule and medication details below, "
        "write a clear explanation for the patient:\n\n"
        f"{context}"
    )

    loop = asyncio.get_event_loop()

    try:
        response = await loop.run_in_executor(
            None,
            lambda: client.chat.completions.create(
                model="Qwen/Qwen2.5-7B-Instruct",
                messages=[
                    {"role": "system", "content": "You are a helpful medical assistant."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=300
            )
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("AI explanation error:", e)
        return "Explanation unavailable due to AI service error."