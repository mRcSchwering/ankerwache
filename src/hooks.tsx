import React from "react";
import * as Location from "expo-location";
import { getDistanceFromLatLonInM } from "./util";

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

interface useCurrentLocationType {
  err: string | null;
  loc: LocationType | null;
}

export function useCurrentLocation(): useCurrentLocationType {
  const [err, setErr] = React.useState<null | string>(null);
  const [loc, setLoc] = React.useState<LocationType | null>(null);

  async function updateLocation() {
    let resp: Location.LocationPermissionResponse | null = null;
    try {
      resp = await Location.requestForegroundPermissionsAsync();
    } catch (err) {
      // @ts-ignore
      setErr(err.message);
      return;
    }
    if (!resp.granted) {
      setErr("Persmission to get current location was denied");
      return;
    }
    const posOpts = { accuracy: Location.Accuracy.Highest };
    const res = await Location.getCurrentPositionAsync(posOpts);
    setLoc({
      lat: res.coords.latitude,
      lng: res.coords.longitude,
      ts: res.timestamp,
      acc: res.coords.accuracy,
    });
  }

  React.useEffect(() => {
    const interval = setInterval(updateLocation, 5000);
    updateLocation();
    return () => clearInterval(interval);
  }, []);

  return { err, loc };
}

export function useAnchorWatch(
  radius: number,
  actual: LocationType | null,
  target: LocationType | null
) {
  const [watching, setWatching] = React.useState(false);
  const [hit, setHit] = React.useState(0);

  async function stopWatch() {
    setWatching(false);
    setHit(0);
  }

  async function startWatch() {
    if (!watching) {
      setWatching(true);
      setHit(0);
    }
  }

  React.useEffect(() => {
    if (watching && actual && target) {
      const d = getDistanceFromLatLonInM(
        actual.lat,
        actual.lng,
        target.lat,
        target.lng
      );
      if (d > radius) {
        setHit((d) => d + 1);
      } else {
        setHit((d) => Math.max(d - 1, 0));
      }
    }
  }, [actual, target, radius]);

  return { watching, startWatch, stopWatch, hit };
}
