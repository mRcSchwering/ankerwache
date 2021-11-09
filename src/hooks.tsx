import React from "react";
import { useColorScheme } from "react-native";
import * as Location from "expo-location";
import { Audio } from "expo-av";

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

interface useAlarmType {
  startAlarm: () => void;
  stopAlarm: () => void;
  err?: string;
}

interface useAlarmStateType {
  err?: string;
  sound?: Audio.Sound;
}

export function useAlarm(): useAlarmType {
  const [state, setState] = React.useState<useAlarmStateType>({});

  async function startAlarm() {
    if (!state.sound) {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
        });
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/ring.mp3")
        );
        sound.setStatusAsync({ isLooping: true });
        sound.playAsync();
        setState({ sound });
      } catch (err) {
        // @ts-ignore
        setState({ err: `Error starting audio: ${err.message}` });
      }
    }
  }

  async function stopAlarm() {
    if (state.sound) {
      state.sound.unloadAsync();
    }
    setState({});
  }

  React.useEffect(() => {
    return () => {
      stopAlarm();
    };
  }, []);

  return { startAlarm, stopAlarm, err: state.err };
}

export function useDarkMode(): boolean {
  const colorScheme = useColorScheme();
  return colorScheme !== "light";
}
