import React from "react";
import { getDistanceFromLatLonInM } from "./util";

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

export function useAnchorWatch(
  radius: number,
  current: LocationType | null,
  anchor: LocationType | null
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
    if (watching && current && anchor) {
      const d = getDistanceFromLatLonInM(
        current.lat,
        current.lng,
        anchor.lat,
        anchor.lng
      );
      if (d > radius) {
        setHit((d) => d + 1);
      } else {
        setHit((d) => Math.max(d - 1, 0));
      }
    }
  }, [current, anchor, radius]);

  return { watching, startWatch, stopWatch, hit };
}
