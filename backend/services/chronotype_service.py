
def calculate_chronotype(wake_time: str, sleep_time: str):

    wake_hour = int(wake_time.split(":")[0])
    sleep_hour = int(sleep_time.split(":")[0])

    # simplified MEQ logic
    if wake_hour <= 6:
        return "morning"

    elif wake_hour >= 9:
        return "evening"

    else:
        return "intermediate"
