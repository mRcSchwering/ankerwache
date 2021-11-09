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

interface usePermissionsState {
  granted: boolean;
  loading: boolean;
  err?: string;
}

export function usePermissions(): usePermissionsState {
  const [state, setState] = React.useState<usePermissionsState>({
    granted: false,
    loading: true,
  });

  async function requestPermissions() {
    let resp: Location.LocationPermissionResponse | null = null;
    try {
      resp = await Location.requestForegroundPermissionsAsync();
    } catch (err) {
      setState({
        // @ts-ignore
        err: `Error requesting permissions: ${err.message}`,
        granted: false,
        loading: false,
      });
      return;
    }
    if (!resp.granted) {
      setState({
        err: "Persmission to get current location was denied",
        granted: false,
        loading: false,
      });
    } else {
      setState({ granted: true, loading: false });
    }
  }

  React.useEffect(() => {
    requestPermissions();
  }, []);

  return state;
}

export function useCurrentLocation(): LocationType | undefined {
  const [loc, setLoc] = React.useState<LocationType>();

  async function updateLocation() {
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

  return loc;
}

interface HeadingType {
  mag: number;
  tru: number;
}

export function useCurrentHeading(active: boolean): HeadingType | undefined {
  const [head, setHead] = React.useState<HeadingType>();
  const [id, setId] = React.useState<NodeJS.Timer>();

  async function updateHeading() {
    const res = await Location.getHeadingAsync();
    setHead({
      mag: res.magHeading,
      tru: res.trueHeading,
    });
  }

  React.useEffect(() => {
    if (active) {
      setId(setInterval(updateHeading, 1000));
      updateHeading();
    } else {
      if (id) clearInterval(id);
    }
    return () => {
      if (id) clearInterval(id);
    };
  }, [active]);

  return head;
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
