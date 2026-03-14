
from pydantic import BaseModel
from typing import List, Optional


class ScheduleRequest(BaseModel):

    wake_time: str
    sleep_time: str
    night_shift: bool
    caffeine_intake: str

    age: int
    weight: int
    height: int

    gender: str
    menstrual_phase: Optional[str] = None

    heart_rate: Optional[str] = None

    diseases: List[str] = []
    medications: List[str] = []
