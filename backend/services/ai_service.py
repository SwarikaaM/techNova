
import os
import asyncio
import requests
from openai import OpenAI

from services.timing_service import recommend_time
from services.interaction_service import check_interaction
from services.side_effect_service import get_side_effects


client = OpenAI(
    api_key=os.getenv("FEATHERLESS_API_KEY"),
    base_url="https://api.featherless.ai/v1"
)


# -----------------------------
# AI SCHEDULE GENERATION
# -----------------------------
async def generate_ai_schedule(data):

    medications = data.medications
    schedule = []

    # ---------------------------------
    # 1. RULE BASED TIMING (Chronotherapy)
    # ---------------------------------
    for med in medications:

        timing = recommend_time(
            med,
            data.wake_time,
            data.sleep_time
        )

        side_effects = await get_side_effects(med)

        schedule.append({
            "name": med,
            "time": timing["recommended_time"],
            "reason": timing["reason"],
            "side_effects": side_effects,
            "taken": False
        })

    # ---------------------------------
    # 2. DRUG INTERACTION CHECK
    # ---------------------------------
    interaction_warning = None

    if len(medications) >= 2:
        interaction_warning = await check_interaction(
            medications[0],
            medications[1]
        )

    # ---------------------------------
    # 3. AI LIFESTYLE RECOMMENDATIONS
    # ---------------------------------
    prompt = f"""
You are a clinical chronotherapy assistant.

Patient Data:
Chronotype: {data.chronotype}
Wake time: {data.wake_time}
Sleep time: {data.sleep_time}
Night shift: {data.night_shift}
Caffeine intake: {data.caffeine_intake}
Diseases: {data.diseases}
Medications: {data.medications}

Give lifestyle recommendations for circadian health.

Return JSON:
{{
 "lifestyle":[
  "recommendation 1",
  "recommendation 2"
 ]
}}
"""

    loop = asyncio.get_event_loop()

    lifestyle = []

    try:
        response = await loop.run_in_executor(
            None,
            lambda: requests.post(
                "https://api.featherless.ai/generate",
                json={"prompt": prompt}
            )
        )

        result = response.json()

        lifestyle = result.get("lifestyle", [])

    except Exception as e:

        print("AI lifestyle generation error:", e)

        lifestyle = [
            "Maintain a consistent sleep schedule.",
            "Avoid caffeine late in the day.",
            "Expose yourself to morning sunlight.",
            "Eat meals at consistent times daily."
        ]

    return {
        "schedule": schedule,
        "interaction_warning": interaction_warning,
        "lifestyle": lifestyle
    }


# -----------------------------
# AI EXPLANATION GENERATION
# -----------------------------
async def generate_explanation(context: dict) -> str:

    prompt = (
        "Explain the medication schedule and recommendations in simple language:\n\n"
        f"{context}"
    )

    loop = asyncio.get_event_loop()

    try:
        response = await loop.run_in_executor(
            None,
            lambda: client.chat.completions.create(
                model="Qwen/Qwen2.5-7B-Instruct",
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful medical assistant."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    },
                ],
                temperature=0.7,
                max_tokens=300
            )
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("AI explanation error:", e)
        return "Explanation unavailable due to AI service error."
