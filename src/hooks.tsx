import React from "react";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
} from "expo-location";

export function useCurrentLocation(): {
  error: string | null;
  location: LocationObject | null;
} {
  const [error, setError] = React.useState<any>(null);
  const [location, setLocation] = React.useState<LocationObject | null>(null);

  React.useEffect(() => {
    async function updatePosition() {
      const resp = await requestForegroundPermissionsAsync();
      if (!resp.granted) {
        setError("Permission to get location was not granted");
        return;
      }
      const pos = await getCurrentPositionAsync();
      console.log(pos);
      setLocation(pos);
    }

    const interval = setInterval(() => updatePosition(), 5000);
    updatePosition();

    return () => clearInterval(interval);
  }, []);
  return { error, location };
}
