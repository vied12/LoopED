from datetime import datetime, timedelta
from functools import wraps


def throttle(seconds=0, minutes=0, hours=0):
    throttle_period = timedelta(seconds=seconds, minutes=minutes, hours=hours)

    def throttle_decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            now = datetime.now()
            wrapper.occur += 1
            if now - wrapper.time_of_last_call > throttle_period:
                wrapper.time_of_last_call = now
                wrapper.occur = 0
                return fn(*args, **kwargs)
            if wrapper.occur < 2:
                return fn(*args, **kwargs)
        wrapper.time_of_last_call = datetime.min
        wrapper.occur = 0
        return wrapper
    return throttle_decorator
