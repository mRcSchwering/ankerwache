import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { Btn, Txt } from "./components";
import DistanceSelection from "./DistanceSelection";
import { useAnchorWatch } from "./hooks";

export const ANCHOR_WATCH_TASK = "anchor-watch-background-task";

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

interface AnchorWatchView {
  loc?: LocationType | null;
  granted: boolean;
}

export default function AnchorWatchView(props: AnchorWatchView): JSX.Element {
  const RADII = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const [radius, setRadius] = React.useState(RADII[2]);
  const { watching, startWatch, stopWatch } = useAnchorWatch();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== "light";
  const themedBtn = isDarkMode ? styles.darkWatchBtn : styles.lightWatchBtn;

  function toggleWatch() {
    if (watching) {
      stopWatch();
    } else if (props.granted && props.loc) {
      startWatch();
    }
  }

  React.useEffect(() => {
    if (!props.loc && watching) {
      stopWatch();
    }
  }, [props.loc]);

  return (
    <View style={styles.anchorWatchContainer}>
      <View style={styles.anchorWatchHandle}>
        <Btn
          onPress={toggleWatch}
          label={watching ? "Stop" : "Start"}
          disabled={!props.loc || !props.granted}
          style={themedBtn}
        />
        <DistanceSelection
          num={radius}
          nums={RADII}
          onSelect={setRadius}
          disabled={!props.loc || watching}
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
