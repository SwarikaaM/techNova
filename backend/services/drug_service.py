import httpx

FDA_URL = "https://api.fda.gov/drug/label.json"


async def get_drug_data(drug_name: str):

    url = f"{FDA_URL}?search=openfda.generic_name:{drug_name}&limit=1"

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)

        data = response.json()

        if "results" not in data:
            return {
                "drug": drug_name,
                "info": "No FDA data found"
            }

        drug = data["results"][0]

        return {
            "drug": drug_name,
            "warnings": drug.get("warnings", ["No warnings found"]),
            "indications": drug.get("indications_and_usage", ["No indication data"]),
            "dosage": drug.get("dosage_and_administration", ["No dosage info"])
        }

    except Exception as e:
        print("FDA API error:", e)

        return {
            "drug": drug_name,
            "info": "FDA service unavailable"
        }