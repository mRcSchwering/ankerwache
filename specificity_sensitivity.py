"""
Here, I am trying out some settings for the anchor watch. 
I am estimating the specificity (don't wake me up if the anchor is not really dragging)
and the sensitivity (if the anchor is really dragging, wake me up).
Naturally, while one goes up, the other tends to go down.
"""
from scipy.stats import bernoulli, norm, median_absolute_deviation  # tpye:ignore
from numpy import median, mean


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


def raise_at_least_1_alarm1(N: int, n: int, p: float, c: int) -> float:
    alarms = [alarmCounter1(nums=bernoulli.rvs(p=p, size=n), count=c) for _ in range(N)]
    return sum([d > 0 for d in alarms]) / N


def when_was_alarm_raised1(N: int, n: int, p: float, c: int) -> tuple:
    alarms = [alarmCounter1(nums=bernoulli.rvs(p=p, size=n), count=c) for _ in range(N)]
    raised = [d for d in alarms if d > 0]
    return (median(raised), median_absolute_deviation(raised))


def raise_at_least_1_alarm2(N: int, n: int, p: float, c: int) -> float:
    alarms = [alarmCounter2(nums=bernoulli.rvs(p=p, size=n), count=c) for _ in range(N)]
    return sum([d > 0 for d in alarms]) / N


def when_was_alarm_raised2(N: int, n: int, p: float, c: int) -> tuple:
    alarms = [alarmCounter2(nums=bernoulli.rvs(p=p, size=n), count=c) for _ in range(N)]
    raised = [d for d in alarms if d > 0]
    return (median(raised), median_absolute_deviation(raised))


# 10k trials, watch is active 8h
N = 10_000
n = int(8 * 60 * 60 / 5)

# Counter 1

# False Alarm cases
raise_at_least_1_alarm1(N=N, n=n, p=0.05, c=3)  # 51.0%
raise_at_least_1_alarm1(N=N, n=n, p=0.05, c=4)  # 3.8%
raise_at_least_1_alarm1(N=N, n=n, p=0.05, c=5)  # 0.2%

# True Alarm cases (just at 2 SD border)
mean(norm.rvs(loc=2, size=10000) <= 2)  # 50% chance to be outside
raise_at_least_1_alarm1(N=N, n=n, p=0.5, c=3)  # 100.0%
raise_at_least_1_alarm1(N=N, n=n, p=0.5, c=4)  # 100.0%
raise_at_least_1_alarm1(N=N, n=n, p=0.5, c=5)  # 100.0%
when_was_alarm_raised1(N=N, n=n, p=0.5, c=3)  # 45s +/- 35s
when_was_alarm_raised1(N=N, n=n, p=0.5, c=4)  # 70s +/- 60s
when_was_alarm_raised1(N=N, n=n, p=0.5, c=5)  # 110s +/- 80s

# True Alarm cases (just at 3 SD border)
mean(norm.rvs(loc=3, size=1000) <= 2)  # 85% chance to be outside
raise_at_least_1_alarm1(N=N, n=n, p=0.85, c=3)  # 100.0%
raise_at_least_1_alarm1(N=N, n=n, p=0.85, c=4)  # 100.0%
raise_at_least_1_alarm1(N=N, n=n, p=0.85, c=5)  # 100.0%
when_was_alarm_raised1(N=N, n=n, p=0.85, c=3)  # 15s +/- 0s
when_was_alarm_raised1(N=N, n=n, p=0.85, c=4)  # 20s +/- 0s
when_was_alarm_raised1(N=N, n=n, p=0.85, c=5)  # 35s +/- 5s


# Counter 2

# False Alarm cases
raise_at_least_1_alarm2(N=N, n=n, p=0.05, c=3)  # 50.0%
raise_at_least_1_alarm2(N=N, n=n, p=0.05, c=4)  # 3.3%
raise_at_least_1_alarm2(N=N, n=n, p=0.05, c=5)  # 0.1%

# True Alarm cases (just at 2 SD border)
mean(norm.rvs(loc=2, size=1000) <= 2)  # 50% chance to be outside
raise_at_least_1_alarm2(N=N, n=n, p=0.5, c=3)  # 100.0%
raise_at_least_1_alarm2(N=N, n=n, p=0.5, c=4)  # 100.0%
raise_at_least_1_alarm2(N=N, n=n, p=0.5, c=5)  # 100.0%
when_was_alarm_raised2(N=N, n=n, p=0.5, c=3)  # 50s +/- 45s
when_was_alarm_raised2(N=N, n=n, p=0.5, c=4)  # 110s +/- 100s
when_was_alarm_raised2(N=N, n=n, p=0.5, c=5)  # 220s +/- 210s

# True Alarm cases (just at 3 SD border)
mean(norm.rvs(loc=3, size=1000) <= 2)  # 85% chance to be outside
raise_at_least_1_alarm2(N=N, n=n, p=0.85, c=3)  # 100.0%
raise_at_least_1_alarm2(N=N, n=n, p=0.85, c=4)  # 100.0%
raise_at_least_1_alarm2(N=N, n=n, p=0.85, c=5)  # 100.0%
when_was_alarm_raised2(N=N, n=n, p=0.85, c=3)  # 15s +/- 0s
when_was_alarm_raised2(N=N, n=n, p=0.85, c=4)  # 20s +/- 0s
when_was_alarm_raised2(N=N, n=n, p=0.85, c=5)  # 30s +/- 5s
