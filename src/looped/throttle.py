from datetime import datetime, timedelta
from functools import wraps


def throttle(seconds=0, minutes=0, hours=0):
    throttle_period = timedelta(seconds=seconds, minutes=minutes, hours=hours)

    def throttle_decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            if not args[1] in wrapper.cache:
                wrapper.cache[args[1]] = {
                    'occur': 0,
                    'time_of_last_call': datetime.min,
                }
            cache = wrapper.cache[args[1]]
            now = datetime.now()
            cache['occur'] += 1
            if now - cache['time_of_last_call'] > throttle_period:
                cache['time_of_last_call'] = now
                cache['occur'] = 0
                return fn(*args, **kwargs)
            if cache['occur'] < 2:
                return fn(*args, **kwargs)

        wrapper.cache = {}
        return wrapper
    return throttle_decorator
