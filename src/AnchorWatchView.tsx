import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { Btn, Txt } from "./components";
import DistanceSelection from "./DistanceSelection";

interface Location {
  latitude: number;
  longitude: number;
}

export default function AnchorWatchView(props: {
  location?: Location | null;
}): JSX.Element {
  const RADII = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const [radius, setRadius] = React.useState(RADII[2]);
  const [watching, setWatching] = React.useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== "light";

  const themedBtn = isDarkMode ? styles.darkWatchBtn : styles.lightWatchBtn;

  React.useEffect(() => {
    if (!props.location) {
      setWatching(false);
    }
  }, [props.location]);

  function toggleWatch() {
    if (props.location) {
      setWatching((d) => !d);
      console.log(props.location);
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
