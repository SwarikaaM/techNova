import httpx

FDA_API = "https://api.fda.gov/drug/label.json"

async def check_interaction(drug1, drug2):

    async with httpx.AsyncClient() as client:
        res = await client.get(
            FDA_API,
            params={"search": f"drug_interactions:{drug1}"}
        )
    if res.status_code != 200:
        return {
            "drug1": drug1,
            "drug2": drug2,
            "error": "FDA API request failed"
        }

    data = res.json()

    try:
        interaction_text = data["results"][0]["drug_interactions"][:300]

        return {
            "drug1": drug1,
            "drug2": drug2,
            "interaction_info": interaction_text
        }

    except:
        return {
            "drug1": drug1,
            "drug2": drug2,
            "interaction_info": "No interaction info found in FDA database"
        }