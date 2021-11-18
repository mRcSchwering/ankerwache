"""
Here, I am trying out some settings for the anchor watch. 
I am estimating the specificity (don't wake me up if the anchor is not really dragging)
and the sensitivity (if the anchor is really dragging, wake me up).
Naturally, while one goes up, the other tends to go down.

Run as:

    python specificity_sensitivity.py

Results from last run:

    100 trials, 5,760 requests (that's 1 request every 5s for 8h)


    Counter: counter1

    Raising false alarms
    Count to 3: Alarm raised 49.00% of the time
    Count to 4: Alarm raised 6.00% of the time
    Count to 5: Alarm raised 0.00% of the time

    Raising True Alarms at the 2SD border
    Count to 3: Alarm raised 100.00% of the time
    Count to 4: Alarm raised 100.00% of the time
    Count to 5: Alarm raised 100.00% of the time
    Count to 3: Alarm raised after 35.0+/-15.0s
    Count to 4: Alarm raised after 67.5+/-37.5s
    Count to 5: Alarm raised after 105.0+/-50.0s

    Raising True Alarms at the 3SD border
    Count to 3: Alarm raised 100.00% of the time
    Count to 4: Alarm raised 100.00% of the time
    Count to 5: Alarm raised 100.00% of the time
    Count to 3: Alarm raised after 15.0+/-0.0s
    Count to 4: Alarm raised after 20.0+/-0.0s
    Count to 5: Alarm raised after 30.0+/-5.0s

    Drift until alarm with rate of 0.01SD
    Count to 3: drifted 1.58+/-0.18SD, that's 32+/-4m with SD=20m
    Count to 4: drifted 1.74+/-0.20SD, that's 35+/-4m with SD=20m
    Count to 5: drifted 1.98+/-0.13SD, that's 40+/-3m with SD=20m

    Drift until alarm with rate of 0.001SD
    Count to 3: drifted 0.99+/-0.16SD, that's 20+/-3m with SD=20m
    Count to 4: drifted 1.29+/-0.12SD, that's 26+/-2m with SD=20m
    Count to 5: drifted 1.50+/-0.13SD, that's 30+/-3m with SD=20m


    Counter: counter2

    Raising false alarms
    Count to 3: Alarm raised 50.00% of the time
    Count to 4: Alarm raised 5.00% of the time
    Count to 5: Alarm raised 0.00% of the time

    Raising True Alarms at the 2SD border
    Count to 3: Alarm raised 100.00% of the time
    Count to 4: Alarm raised 100.00% of the time
    Count to 5: Alarm raised 100.00% of the time
    Count to 3: Alarm raised after 45.0+/-20.0s
    Count to 4: Alarm raised after 57.5+/-27.5s
    Count to 5: Alarm raised after 115.0+/-45.0s

    Raising True Alarms at the 3SD border
    Count to 3: Alarm raised 100.00% of the time
    Count to 4: Alarm raised 100.00% of the time
    Count to 5: Alarm raised 100.00% of the time
    Count to 3: Alarm raised after 15.0+/-0.0s
    Count to 4: Alarm raised after 25.0+/-5.0s
    Count to 5: Alarm raised after 30.0+/-5.0s

    Drift until alarm with rate of 0.01SD
    Count to 3: drifted 1.52+/-0.24SD, that's 30+/-5m with SD=20m
    Count to 4: drifted 1.73+/-0.22SD, that's 35+/-4m with SD=20m
    Count to 5: drifted 2.00+/-0.14SD, that's 40+/-3m with SD=20m

    Drift until alarm with rate of 0.001SD
    Count to 3: drifted 0.96+/-0.20SD, that's 19+/-4m with SD=20m
    Count to 4: drifted 1.29+/-0.13SD, that's 26+/-3m with SD=20m
    Count to 5: drifted 1.51+/-0.11SD, that's 30+/-2m with SD=20m
"""
from typing import Callable
from scipy.stats import bernoulli, norm, median_abs_deviation  # type:ignore
from numpy import median  # type:ignore


def alarmCounter1(nums: list, count: int) -> int:
    """Count up/down (to 0) on out-of-bounds/in-bounds readings"""
    counter = 0
    for i, d in enumerate(nums):
        if d > 0:
            counter += 1
        else:
            counter = max(0, counter - 1)
        if counter >= count:
            return i
    return -1


def alarmCounter2(nums: list, count: int) -> int:
    """Count upon out-of-bounds, reset to 0 on in-bound readings"""
    counter = 0
    for i, d in enumerate(nums):
        if d > 0:
            counter += 1
        else:
            counter = 0
        if counter >= count:
            return i
    return -1


def raise_at_least_1_alarm(N: int, n: int, p: float, c: int, counter: Callable):
    alarms = [counter(nums=bernoulli.rvs(p=p, size=n), count=c) for _ in range(N)]
    print(
        f"Count to {c}: Alarm raised {sum([d > 0 for d in alarms]) / N * 100:.2f}% of the time"
    )


def when_was_alarm_raised(N: int, n: int, p: float, c: int, counter: Callable):
    alarms = [counter(nums=bernoulli.rvs(p=p, size=n), count=c) for _ in range(N)]
    raised = [d for d in alarms if d > 0]
    med_s = (median(raised) + 1) * 5
    mad_s = median_abs_deviation(raised) * 5
    print(f"Count to {c}: Alarm raised after {med_s:.1f}+/-{mad_s:.1f}s")


def drifting_away(rate: float, c: int, counter: Callable, N: int):
    sd = 20
    steps = [i * rate for i in range(4 * int(1 / rate))]
    ps = [1 - (norm.cdf(2 - d) - norm.cdf(-2 - d)) for d in steps]
    alarms = []
    for _ in range(N):
        nums = [bernoulli.rvs(p=p, size=1) for p in ps]
        alarms.append(counter(nums=nums, count=c))
    raised = [d for d in alarms if d > 0]
    med_rate = (median(raised) + 1) * rate
    mad_rate = median_abs_deviation(raised) * rate
    print(
        f"Count to {c}: drifted {med_rate:.2f}+/-{mad_rate:.2f}SD, that's {med_rate * sd:.0f}+/-{mad_rate * sd:.0f}m with SD=20m"
    )


if __name__ == "__main__":
    N = 100
    n = int(8 * 60 * 60 / 5)
    print(f"\n\n{N} trials, {n:,} requests (that's 1 request every 5s for 8h)")

    for name, counter in [("counter1", alarmCounter1), ("counter2", alarmCounter2)]:
        print(f"\n\nCounter: {name}")

        print("\nRaising false alarms")
        raise_at_least_1_alarm(N=N, n=n, p=0.05, c=3, counter=alarmCounter1)
        raise_at_least_1_alarm(N=N, n=n, p=0.05, c=4, counter=alarmCounter1)
        raise_at_least_1_alarm(N=N, n=n, p=0.05, c=5, counter=alarmCounter1)

        print(f"\nRaising True Alarms at the 2SD border")
        raise_at_least_1_alarm(N=N, n=n, p=0.5, c=3, counter=alarmCounter1)
        raise_at_least_1_alarm(N=N, n=n, p=0.5, c=4, counter=alarmCounter1)
        raise_at_least_1_alarm(N=N, n=n, p=0.5, c=5, counter=alarmCounter1)
        when_was_alarm_raised(N=N, n=n, p=0.5, c=3, counter=alarmCounter1)
        when_was_alarm_raised(N=N, n=n, p=0.5, c=4, counter=alarmCounter1)
        when_was_alarm_raised(N=N, n=n, p=0.5, c=5, counter=alarmCounter1)

        print(f"\nRaising True Alarms at the 3SD border")
        raise_at_least_1_alarm(N=N, n=n, p=0.85, c=3, counter=alarmCounter1)
        raise_at_least_1_alarm(N=N, n=n, p=0.85, c=4, counter=alarmCounter1)
        raise_at_least_1_alarm(N=N, n=n, p=0.85, c=5, counter=alarmCounter1)
        when_was_alarm_raised(N=N, n=n, p=0.85, c=3, counter=alarmCounter1)
        when_was_alarm_raised(N=N, n=n, p=0.85, c=4, counter=alarmCounter1)
        when_was_alarm_raised(N=N, n=n, p=0.85, c=5, counter=alarmCounter1)

        print(f"\nDrift until alarm with rate of 0.01SD")
        drifting_away(rate=0.01, c=3, counter=alarmCounter1, N=N)
        drifting_away(rate=0.01, c=4, counter=alarmCounter1, N=N)
        drifting_away(rate=0.01, c=5, counter=alarmCounter1, N=N)

        print(f"\nDrift until alarm with rate of 0.001SD")
        drifting_away(rate=0.001, c=3, counter=alarmCounter1, N=N)
        drifting_away(rate=0.001, c=4, counter=alarmCounter1, N=N)
        drifting_away(rate=0.001, c=5, counter=alarmCounter1, N=N)
