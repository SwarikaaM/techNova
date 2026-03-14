from pydantic import BaseModel
from typing import List, Optional


class ScheduleRequest(BaseModel):
    chronotype: str
    diseases: List[str] = []
    medications: List[str] = []
    disease_peaks: List[str] = []
    age: int
    weight: int
    gender: str
    cycle_phase: Optional[str] = None