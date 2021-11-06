import React from "react";
import * as Location from "expo-location";

export function useCurrentLocation() {
  const [errorMsg, setErrorMsg] = React.useState<null | string>(null);
  const [loc, setLoc] = React.useState<Location.LocationObject | null>(null);

  async function updateLocation() {
    const resp = await Location.requestForegroundPermissionsAsync();
    if (!resp.granted) {
      setErrorMsg("Persmission to get current location was denied");
      return;
    }
    const posOpts = { accuracy: Location.Accuracy.Highest };
    const loc = await Location.getCurrentPositionAsync(posOpts);
    setLoc(loc);
  }

  React.useEffect(() => {
    const interval = setInterval(updateLocation, 5000);
    updateLocation();
    return () => clearInterval(interval);
  }, []);

  return { errorMsg, loc };
}

export function useAnchor(): {
  setAnchor: (loc: Location.LocationObject | null) => void;
  retrieveAnchor: () => void;
  anchorLoc: Location.LocationObject | null;
} {
  const [anchorLoc, setanchorLoc] =
    React.useState<Location.LocationObject | null>(null);

  function setAnchor(loc: Location.LocationObject | null) {
    setanchorLoc(loc);
  }

  function retrieveAnchor() {
    setanchorLoc(null);
  }

  return { setAnchor, retrieveAnchor, anchorLoc };
}
