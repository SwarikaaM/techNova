# services/ai_service.py
import os
import asyncio
from openai import OpenAI

# Featherless API requires OpenAI library pointed at their base_url
client = OpenAI(
    api_key=os.getenv("rc_3bf9e78226a04e54550d51cc18b4668403c174ea87665d1b96842f72bfe2a778"),
    base_url="https://api.featherless.ai/v1"
)

async def generate_explanation(context: dict) -> str:
    """
    Generate a human‑readable explanation of schedule & drug info.
    """
    # Convert the context dict to a prompt string
    prompt = (
        "You are a medical assistant. "
        "Given the schedule and medication details below, "
        "write a clear explanation for the patient:\n\n"
        f"{context}"
    )

    # Async wrapper around sync call
    loop = asyncio.get_event_loop()
    try:
        response = await loop.run_in_executor(
            None,
            lambda: client.chat.completions.create(
                model="Qwen/Qwen2.5-7B-Instruct",  # or choose any Featherless model
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
        print("AI generation error:", e)
        return "Explanation unavailable due to AI service error."