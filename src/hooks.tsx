import React from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

export function useAnchor(): {
  setAnchor: (loc: LocationType | null) => void;
  retrieveAnchor: () => void;
  anchorLoc: LocationType | null;
} {
  const [anchorLoc, setanchorLoc] = React.useState<LocationType | null>(null);

  function setAnchor(loc: LocationType | null) {
    setanchorLoc(loc);
  }

  function retrieveAnchor() {
    setanchorLoc(null);
  }

  return { setAnchor, retrieveAnchor, anchorLoc };
}

export const ANCHOR_WATCH_TASK = "anchor-watch-background-task";

export function useAnchorWatch() {
  const [watching, setWatching] = React.useState(false);

  async function stopWatch() {
    setWatching(false);
    TaskManager.unregisterAllTasksAsync();
  }

  async function startWatch() {
    if (!watching) {
      const opts = {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5000,
        foregroundService: {
          notificationTitle: "Watching anchor...",
          notificationBody:
            "Regularly checks current location. Raises alarm if too far away.",
          notificationColor: "#b2b2b2",
        },
        pausesUpdatesAutomatically: false,
        distanceInterval: 1,
      };
      Location.startLocationUpdatesAsync(ANCHOR_WATCH_TASK, opts);
      setWatching(true);
    }
  }

  return { watching, startWatch, stopWatch };
}
