import random

def generate_doctor_code():
    number = random.randint(100000, 999999)
    return f"DR-{number}"