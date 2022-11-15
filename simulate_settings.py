"""
Here, I am trying out some settings for the anchor watch.
I am estimating the specificity (don't wake me up if the anchor is not really dragging)
and the sensitivity (if the anchor is really dragging, wake me up).
Naturally, while one goes up, the other tends to go down.

When Android requests a geolocation the `accuracy` key is supposed to be the
68% confidence interval. A normal distribution is considered.
Twice that accuracy would represent the 95% confidence interval.

I want to estimate (1) how likely it is that an alarm is raised at all,
(2) how long it would take for an alarm to be raised / how far would the boat have dragged?

Run as:

    python simulate_settings.py

Results from last run:

    Simulating anchor watch with different settings
    Constants: N_TRIALS=100, ON=5760, DRIFT_VELO=1.25
    Testing 6 conditions

    chain_length=20 geoloc_acc=20
    18 initial sets...test sens...18 left...test spec...3 left
    - n10-d180-r10: 0.02 FPR, dragged 38 m (+/- 5 m)
    - n10-d090-r10: 0.02 FPR, dragged 39 m (+/- 5 m)
    - n10-d045-r10: 0.02 FPR, dragged 38 m (+/- 5 m)

    chain_length=20 geoloc_acc=50
    18 initial sets...test sens...18 left...test spec...3 left
    - n10-d180-r10: 0.01 FPR, dragged 69 m (+/- 13 m)
    - n10-d090-r10: 0.01 FPR, dragged 69 m (+/- 12 m)
    - n10-d045-r10: 0.02 FPR, dragged 70 m (+/- 11 m)

    chain_length=20 geoloc_acc=100
    18 initial sets...test sens...15 left...test spec...0 left

    chain_length=50 geoloc_acc=20
    18 initial sets...test sens...18 left...test spec...3 left
    - n10-d180-r10: 0.01 FPR, dragged 38 m (+/- 5 m)
    - n10-d090-r10: 0.01 FPR, dragged 39 m (+/- 6 m)
    - n10-d045-r10: 0.00 FPR, dragged 39 m (+/- 5 m)

    chain_length=50 geoloc_acc=50
    18 initial sets...test sens...18 left...test spec...3 left
    - n10-d180-r10: 0.00 FPR, dragged 72 m (+/- 12 m)
    - n10-d090-r10: 0.02 FPR, dragged 70 m (+/- 11 m)
    - n10-d045-r10: 0.02 FPR, dragged 70 m (+/- 10 m)

    chain_length=50 geoloc_acc=100
    18 initial sets...test sens...15 left...test spec...0 left

=> acc should be < 100m or FPs, bearings don't help, exp-mov-avg is ok, n10-r10
"""
from typing import Optional, Callable
from itertools import product
from multiprocessing import Pool
from scipy.stats import norm
import numpy as np


# constants
N_TRIALS = 100
ON = int(8 * 60 * 60 / 5)  # over night (every 5s for 8h)
CHAIN_LENGTHS = [20, 50]  # length of chain in m
GEOLOC_ACCS = [20, 50, 100]  # StDev of geolocation measurements (m)
DRIFT_VELO = 1.25  # while dragging anchor (0.5kt = 0.25 m/s = 1.25 m/5s)
NPROC = 5
ZERO_LOC = np.array([0.0, 0.0])


def _sample_location(mu: np.ndarray, sd: float) -> np.ndarray:
    """Sample arbitrary 2D location normally distributed around mu (x,y)"""
    x = norm.rvs(loc=mu[0], scale=sd, size=1)
    y = norm.rvs(loc=mu[1], scale=sd, size=1)
    return np.concatenate([x, y])


def _distance(loc1: np.ndarray, loc2: np.ndarray) -> float:
    """Distance between two 2D locations (x1,y1), (x2,y2)"""
    return np.linalg.norm(loc2 - loc1)


def _bearing(v1: np.ndarray, v2: np.ndarray) -> float:
    """Calculate angle between 2 vectors (x1,y1), (x2,y2) in degrees"""
    rad = np.arccos(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))
    return rad * 180 / np.pi


class DecrementCounter:
    """Decrement count if in-bound reading"""

    def __init__(self, max_n: int):
        self.n = 0
        self._max_n = max_n
        self._c = 1

    def increment(self):
        self.n += 1

    def decrement(self):
        self.n = max(0, self.n - self._c)

    def is_alarm(self) -> bool:
        """whether alarm be raised according to count"""
        return self.n > self._max_n


class RunAvgBrgClass:
    """Running average over last w locations and last 2 bearings must differ less than d"""

    def __init__(self, d: float, target_loc: np.ndarray):
        self._target_loc = target_loc
        self._d = d
        self._loc: Optional[np.ndarray] = None

    def is_oob(self, loc: np.ndarray, radius: float) -> bool:
        if self._loc is None:
            self._loc = loc
            return False
        v1 = self._target_loc - self._loc
        self._loc = (self._loc + loc) / 2
        v2 = self._target_loc - self._loc
        if _bearing(v1, v2) > self._d:
            return False
        return _distance(self._target_loc, self._loc) > radius


# maximum counts:
# amount of out-of-bounds counts for alarm to be raised
cntr_maxns: dict[str, int] = {"n05": 5, "n10": 10}

# classifier angles:
# angle differences in degrees within which successive out-of-bounds
# readings are counted as out-of-bounds
clsfr_ds: dict[str, int] = {"d180": 180, "d090": 90, "d045": 45}

# watch radius margin:
# by how much the watch radius is enlarged in m as
# function of the geolocation accuracy
radii: dict[str, Callable[[float], float]] = {
    "r10": lambda d: max(d * 1.0, 10),
    "r20": lambda d: max(d * 1.0, 10),
}


def _simulate_night_at_anchor(
    start_loc: np.ndarray,
    drag: np.ndarray,
    watch_radius: float,
    geoloc_acc: float,
    cntr: DecrementCounter,
    clsfr: RunAvgBrgClass,
) -> Optional[int]:
    """
    Simulate boat at night swinging and optionally dragging at anchor
    with anchor watch active
    """
    true_loc = start_loc.copy()
    for time_step_i in range(ON):
        msrd_loc = _sample_location(mu=true_loc, sd=geoloc_acc)
        if clsfr.is_oob(loc=msrd_loc, radius=watch_radius):
            cntr.increment()
        else:
            cntr.decrement()
        if cntr.is_alarm():
            return time_step_i
        x = true_loc[0] + drag[0]
        y = true_loc[1] + drag[1]
        true_loc = np.array([x, y])
    return None


def _trial(
    args: tuple[str, str, str, str, str, float, float, bool]
) -> tuple[list[Optional[int]], tuple[str, str, str, str, str]]:
    """
    Boat is at the edge of the anchor chain radius (chain being completely streched out).
    Args are: `n, d, r, chain, acc, drag`.
    If `drag` the boat will start dragging away at anchor with
    constant speed into one direction. Otherwise it doesn't drag, and just swings about
    at this location.
    """
    collection = []
    start_loc = ZERO_LOC + np.array([args[3], 0.0])
    if args[5]:
        drag = np.array([1.0, 0.0]) * DRIFT_VELO
    else:
        drag = np.array([0.0, 0.0])
    watch_radius = args[3] + radii[args[2]](args[4])
    for _ in range(N_TRIALS):
        res = _simulate_night_at_anchor(
            start_loc=start_loc,
            drag=drag,
            watch_radius=watch_radius,
            geoloc_acc=args[4],
            cntr=DecrementCounter(max_n=cntr_maxns[args[0]]),
            clsfr=RunAvgBrgClass(d=clsfr_ds[args[1]], target_loc=ZERO_LOC),
        )
        collection.append(res)
    return (collection, args[:3])


if __name__ == "__main__":
    print("Simulating anchor watch with different settings")
    print(f"Constants: N_TRIALS={N_TRIALS}, ON={ON}, DRIFT_VELO={DRIFT_VELO}")

    conditions = list(product(CHAIN_LENGTHS, GEOLOC_ACCS))
    print(f"Testing {len(conditions)} conditions")

    for chain, acc in conditions:
        print(f"\nchain_length={chain} geoloc_acc={acc}")

        hparam_sets = list(product(cntr_maxns, clsfr_ds, radii))
        print(f"{len(hparam_sets)} initial sets", end="...")

        print("test sens", end="...")
        with Pool(NPROC) as pool:
            trial_args = [(*d, chain, acc, True) for d in hparam_sets]
            results = pool.map(_trial, trial_args)

        sens_results = {}
        for alarms, hparams in results:
            true_alarms = [d for d in alarms if d is not None]
            if len(true_alarms) < len(alarms):
                hparam_sets = [d for d in hparam_sets if d != hparams]
            else:
                meters = np.array([d * DRIFT_VELO for d in true_alarms])
                if meters.mean() > 100:
                    hparam_sets = [d for d in hparam_sets if d != hparams]
                else:
                    sens_results[hparams] = {"mu": meters.mean(), "sd": meters.std()}
        print(f"{len(hparam_sets)} left", end="...")

        print("test spec", end="...")
        with Pool(NPROC) as pool:
            trial_args = [(*d, chain, acc, False) for d in hparam_sets]
            results = pool.map(_trial, trial_args)

        spec_results = {}
        for alarms, hparams in results:
            false_alarms = [d for d in alarms if d is not None]
            fpr = len(false_alarms) / len(alarms)
            if fpr > 0.1:
                hparam_sets = [d for d in hparam_sets if d != hparams]
            else:
                spec_results[hparams] = {"fpr": fpr}
        print(f"{len(hparam_sets)} left")

        if len(hparam_sets) > 0:
            for hparams in hparam_sets:
                spec = spec_results[hparams]
                sens = sens_results[hparams]
                hparams_name = "-".join(hparams)
                fpr_text = f"{spec['fpr']:.2f} FPR"
                drag_text = f"{sens['mu']:.0f} m (+/- {sens['sd']:.0f} m)"
                print(f"- {hparams_name}: {fpr_text}, dragged {drag_text}")
