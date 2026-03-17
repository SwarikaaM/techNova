from fastapi import APIRouter

from services.drug_service import get_drug_data
from services.interaction_service import check_interaction
from services.timing_service import recommend_time
from services.side_effect_service import get_side_effects


router = APIRouter(prefix="/analyze", tags=["Analyze"])


@router.get("/test")
def test():
    return {"message": "Analyze route working"}


@router.get("/drug/{drug_name}")
async def drug_info(drug_name: str):
    data = await get_drug_data(drug_name)
    return data


@router.get("/interaction")
async def interaction(drug1: str, drug2: str):
    result = await check_interaction(drug1, drug2)
    return result


@router.post("/")
async def analyze(data: dict):

    drug = data.get("drug")
    wake = data.get("wake")
    sleep = data.get("sleep")
    other_drug = data.get("other_drug")

    # timing recommendation
    timing = recommend_time(drug, wake, sleep)

    # side effects
    side_effects = await get_side_effects(drug)

    # drug interaction
    interaction = None
    if other_drug:
        interaction = await check_interaction(drug, other_drug)

    return {
        "drug": drug,
        "recommended_time": timing["recommended_time"],
        "reason": timing["reason"],
        "side_effects": side_effects,
        "interaction_warning": interaction
    }