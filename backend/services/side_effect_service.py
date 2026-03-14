import httpx

FDA_API = "https://api.fda.gov/drug/label.json"


async def get_side_effects(drug: str):

    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(
                FDA_API,
                params={
                    "search": f"openfda.brand_name:{drug}",
                    "limit": 1
                }
            )

        if res.status_code != 200:
            return "FDA API request failed"

        data = res.json()

        if "results" not in data:
            return "Side effect data unavailable"

        effects = data["results"][0].get("adverse_reactions", ["No data found"])

        # FDA usually returns list of paragraphs
        if isinstance(effects, list):
            effects = effects[0]

        # Return first sentence safely
        sentence = effects[:300].split(".")[0] + "."

        return sentence

    except Exception as e:
        print("Side effects API error:", e)
        return "Side effect data unavailable"