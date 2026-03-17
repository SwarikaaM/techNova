import httpx

FDA_API = "https://api.fda.gov/drug/label.json"


async def check_interaction(drug1: str, drug2: str):

    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                FDA_API,
                params={"search": f"drug_interactions:{drug1}", "limit": 1}
            )

        if res.status_code != 200:
            return {
                "drug1": drug1,
                "drug2": drug2,
                "error": "FDA API request failed"
            }

        data = res.json()

        if "results" not in data:
            return {
                "drug1": drug1,
                "drug2": drug2,
                "interaction_info": "No interaction info found in FDA database"
            }

        interaction_text = data["results"][0].get(
            "drug_interactions",
            ["No interaction info found"]
        )

        # FDA often returns list of long strings
        if isinstance(interaction_text, list):
            interaction_text = interaction_text[0]

        return {
            "drug1": drug1,
            "drug2": drug2,
            "interaction_info": interaction_text[:300]  # limit length
        }

    except Exception as e:
        print("Drug interaction API error:", e)

        return {
            "drug1": drug1,
            "drug2": drug2,
            "interaction_info": "Interaction service unavailable"
        }