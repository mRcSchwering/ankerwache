import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { Btn, Txt } from "./components";
import DistanceSelection from "./DistanceSelection";

export const ANCHOR_WATCH_TASK = "anchor-watch-background-task";

interface AnchorWatchView {
  location?: {
    latitude: number;
    longitude: number;
  } | null;
}

export default function AnchorWatchView(props: AnchorWatchView): JSX.Element {
  const RADII = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const [radius, setRadius] = React.useState(RADII[2]);
  const [watching, setWatching] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<null | string>(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== "light";

  const themedBtn = isDarkMode ? styles.darkWatchBtn : styles.lightWatchBtn;

  async function getPermission() {
    const resp = await Location.requestBackgroundPermissionsAsync();
    if (!resp.granted) {
      setErrorMsg(
        "Persmission to get current location while in background was denied"
      );
      return;
    } else {
      setErrorMsg(null);
    }
  }

  React.useEffect(() => {
    getPermission();
  }, []);

  React.useEffect(() => {
    if (!props.location) {
      setWatching(false);
      // Location.stopGeofencingAsync(ANCHOR_WATCH_TASK);
      TaskManager.unregisterAllTasksAsync();
    }
  }, [props.location]);

  function toggleWatch() {
    if (props.location) {
      setWatching((d) => {
        if (d) {
          if (props.location) {
            const region = {
              latitude: props.location.latitude,
              longitude: props.location.longitude,
              radius: radius,
            };
            if (errorMsg === null) {
              Location.startGeofencingAsync(ANCHOR_WATCH_TASK, [region]);
            }
          }
        } else {
          // Location.stopGeofencingAsync(ANCHOR_WATCH_TASK);
          TaskManager.unregisterAllTasksAsync();
        }
        return !d;
      });
    }
  }

  return (
    <View style={styles.anchorWatchContainer}>
      <View style={styles.anchorWatchHandle}>
        <Btn
          onPress={toggleWatch}
          label={watching ? "Stop" : "Start"}
          disabled={!props.location}
          style={themedBtn}
        />
        <DistanceSelection
          num={radius}
          nums={RADII}
          onSelect={setRadius}
          disabled={!props.location || watching}
        />
      </View>

      <Txt style={{ fontWeight: "bold" }}>
        {watching ? "Watching..." : "Not watching."}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  lightWatchBtn: {
    backgroundColor: "#ff9f9f",
    paddingHorizontal: 50,
    paddingVertical: 15,
  },
  darkWatchBtn: {
    backgroundColor: "#c56565",
    paddingHorizontal: 50,
    paddingVertical: 15,
  },
  anchorWatchContainer: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  anchorWatchHandle: {
    flexDirection: "row",
  },
});
