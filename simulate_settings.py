"""
Here, I am trying out some settings for the anchor watch.
I am estimating the specificity (don't wake me up if the anchor is not really dragging)
and the sensitivity (if the anchor is really dragging, wake me up).
Naturally, while one goes up, the other tends to go down.

When Android requests a geolocation the `accuracy` key is supposed to be the
68% confidence interval. A normal distribution is considered.
Twice that accuracy would represent the 95% confidence interval.

I want to estimate (1) how likely it is that an alarm is raised at all,
(2) how long it would take for an alarm to be raised, and (3) how far
a boat could drift until an alarm is raised.
For that I want to compare a few ideas on how to decide whether a location reading
is really out-of-bounds and on how to integrate in-bounds and out-of-bounds readings
over time.

Run as:

    python simulate_settings.py

Results from last run:

    ...

"""
from typing import Callable
from itertools import product
from scipy.stats import norm
import numpy as np


def sample_location(mu: np.array, std=500) -> np.array:
    """Sample arbitrary 2D location normally distributed around mu (x,y)"""
    x = norm.rvs(loc=mu[0], scale=std, size=1)
    y = norm.rvs(loc=mu[1], scale=std, size=1)
    return np.concatenate([x, y])


def distance(loc1: np.array, loc2: np.array) -> float:
    """Distance between two 2D locations (x1,y1), (x2,y2)"""
    return ((loc2[0] - loc1[0]) ** 2 + (loc2[1] - loc1[1]) ** 2) ** 0.5


def bearing(loc1: np.array, loc2: np.array) -> float:
    """Calculate angle in degrees between two 2D locations (x1,y1), (x2,y2)"""
    rad = np.arctan2((loc2[0] - loc1[0]), (loc2[1] - loc1[1]))
    deg = rad * 180 / (np.pi)
    return deg + 360 if deg < 360 else deg


def bearing_diff(b1: float, b2: float) -> float:
    """Calculate difference between 2 bearings (0-360°) as smallest angle in degrees"""
    angles = sorted([b1, b2])
    diff = angles[1] - angles[0]
    if diff > 180:
        return 360 - diff
    return diff


class Counter:
    """Baseclass for counting out-of-bounds readings"""

    def __init__(self, max_n: int):
        self.n = 0
        self.max_n = max_n

    def increment(self):
        """out-of-bounds reading"""

    def decrement(self):
        """in-bounds reading"""

    def is_alarm(self) -> bool:
        """whether alarm be raised according to count"""
        return self.n > self.max_n


class ResetCounter(Counter):
    """Reset count to 0 if in-bounds reading"""

    def increment(self):
        self.n += 1

    def decrement(self):
        self.n = 0


class DecrementCounter(Counter):
    """Decrement count if in-bound reading"""

    def __init__(self, c=1, **kwargs):
        super().__init__(**kwargs)
        self._c = c

    def increment(self):
        self.n += 1

    def decrement(self):
        self.n = max(0, self.n - self._c)


class Classifier:
    """Classifying whether a location reading is out-of-bounds"""

    def __init__(self, target_loc: np.array) -> None:
        self._locs = []
        self._target_loc = target_loc

    def is_oob(self, loc: np.array, radius: float) -> bool:
        """Should out-of-bounds be logged?"""
        return distance(self._target_loc, loc) > radius


class RunAvgBrgClass(Classifier):
    """Running average over last w locations and last 2 bearings must differ less than d"""

    def __init__(self, d: float, w: int, **kwargs):
        super().__init__(**kwargs)
        self._w = w
        self._d = d
        self._brg = float("nan")

    def is_oob(self, loc: np.array, radius: float) -> bool:
        self._locs.append(loc)
        if len(self._locs) < self._w or np.isnan(self._brg):
            self._brg = bearing(self._target_loc, loc)
            return False
        brg = bearing(self._target_loc, loc)
        brg_diff = bearing_diff(self._brg, brg)
        self._brg = brg
        if brg_diff > self._d:
            return False
        avg = np.array(self._locs[-self._w :]).mean(axis=0)
        return distance(self._target_loc, avg) > radius


# constants
N = 100
ON = int(8 * 60 * 60 / 5)  # every 5s for 8h
IDENT_LOC = np.array([0, 0])
GEOLOC_ACC = 500

# counter factories:
# different strategies integrating in-bounds and out-of-bounds
# readings over time
cntr_facts = {
    "res05": lambda _: ResetCounter(max_n=5),
    "res10": lambda _: ResetCounter(max_n=10),
    "res20": lambda _: ResetCounter(max_n=20),
    "dec05": lambda _: DecrementCounter(max_n=5),
    "dec10": lambda _: DecrementCounter(max_n=10),
    "dec20": lambda _: DecrementCounter(max_n=20),
}

# classifier factories:
# different strategies of deciding whether a location reading is
# in-bounds or out-of-bounds
clsfr_facts = {
    "w05d90": lambda _: RunAvgBrgClass(w=5, target_loc=IDENT_LOC, d=90),
    "w05d45": lambda _: RunAvgBrgClass(w=5, target_loc=IDENT_LOC, d=45),
    "w05d30": lambda _: RunAvgBrgClass(w=5, target_loc=IDENT_LOC, d=30),
    "w10d90": lambda _: RunAvgBrgClass(w=10, target_loc=IDENT_LOC, d=90),
    "w10d45": lambda _: RunAvgBrgClass(w=10, target_loc=IDENT_LOC, d=45),
    "w10d30": lambda _: RunAvgBrgClass(w=10, target_loc=IDENT_LOC, d=30),
    "w20d90": lambda _: RunAvgBrgClass(w=20, target_loc=IDENT_LOC, d=90),
    "w20d45": lambda _: RunAvgBrgClass(w=20, target_loc=IDENT_LOC, d=45),
    "w20d30": lambda _: RunAvgBrgClass(w=20, target_loc=IDENT_LOC, d=30),
}

# excess radius (margin):
# assuming true location stays constant how much extra radius do I add
# to the radius that would result from ancor location and chain length alone
radii = {
    "p10": GEOLOC_ACC * 0.1,
    "p25": GEOLOC_ACC * 0.25,
    "p50": GEOLOC_ACC * 0.5,
}


def simulate_anchor_watch(
    n_trials: int,
    n_time_steps: int,
    true_loc: np.array,
    geoloc_acc: float,
    radius: float,
    cntr_fact: Callable[[], Counter],
    clsfr_fact: Callable[[], Classifier],
) -> list[dict]:
    alarms = []
    for _ in range(n_trials):
        cntr = cntr_fact()
        clsfr = clsfr_fact()
        for time_step_i in range(n_time_steps):
            msrd_loc = sample_location(mu=true_loc, std=geoloc_acc)
            if clsfr.is_oob(loc=msrd_loc, radius=radius):
                cntr.increment()
            else:
                cntr.decrement()
            if cntr.is_alarm():
                alarms.append({"time_step": time_step_i})
                break
    return alarms


# TODO: test drifting away

if __name__ == "__main__":
    print("\nTesting specificity...")
    hparam_set = product(clsfr_facts, cntr_facts, radii)
    print(f"{len(hparam_set)} hparam combinations, {N} trials each")
    for clsfr_name, cntr_name, radius_name in hparam_set:
        res = simulate_anchor_watch(
            n_trials=N,
            n_time_steps=ON,
            true_loc=IDENT_LOC,
            geoloc_acc=GEOLOC_ACC,
            radius=radii[radius_name],
            cntr_fact=cntr_facts[cntr_name],
            clsfr_fact=clsfr_facts[clsfr_name],
        )
        fpr = len(res) / N
        if fpr < 0.1:
            hparams_name = f"{clsfr_name}-{cntr_name}-{radius_name}"
            mnts = np.array([d["time_step"] * 5 / 60 for d in res])
            print(
                f"- {hparams_name}: {fpr:.2f} FPR, {mnts.mean() / 60:.0f}h (+/-{mnts.std():.0f}m) TtFP"
            )

    print("\nTesting sensitivity...")
    hparam_set = product(clsfr_facts, cntr_facts)
    print(f"{len(hparam_set)} hparam combinations, {N} trials each")
    for clsfr_name, cntr_name in hparam_set:
        res = simulate_anchor_watch(
            n_trials=N,
            n_time_steps=ON,
            true_loc=IDENT_LOC,
            geoloc_acc=GEOLOC_ACC,
            radius=0,
            cntr_fact=cntr_facts[cntr_name],
            clsfr_fact=clsfr_facts[clsfr_name],
        )
        tpr = len(res) / N
        if tpr > 0.99:
            hparams_name = f"{clsfr_name}-{cntr_name}"
            mnts = np.array([d["time_step"] * 5 / 60 for d in res])
            print(
                f"- {hparams_name}: {tpr:.0f} TPR, {mnts.mean() / 60:.0f}h (+/-{mnts.std():.0f}m) TtTP"
            )

