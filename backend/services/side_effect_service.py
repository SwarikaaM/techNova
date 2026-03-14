import httpx

FDA_API = "https://api.fda.gov/drug/label.json"

async def get_side_effects(drug):

    async with httpx.AsyncClient() as client:
        res = await client.get(
            FDA_API,
            params={"search": f"openfda.brand_name:{drug}"}
        )

    if res.status_code != 200:
        return "FDA API request failed"

    data = res.json()

    try:
        text = data["results"][0]["adverse_reactions"][0]
        return text[:300].split(".")[0] + "."  # First sentence, up to 300 chars
    except:
        return "Side effect data unavailable"