import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { Btn, Txt, ErrTxt } from "./components";
import DistanceSelection from "./DistanceSelection";
import { useAnchorWatch } from "./hooks";
import { LocationContext } from "./locationContext";

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

interface AnchorWatchView {
  granted: boolean;
}

export default function AnchorWatchView(props: AnchorWatchView): JSX.Element {
  const MARGIN = 3;
  const RADII = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  const { anchor, current } = React.useContext(LocationContext);
  const [radius, setRadius] = React.useState(RADII[2]);
  const { hit, watching, startWatch, stopWatch } = useAnchorWatch(
    radius,
    current,
    anchor
  );
  const [warn, setWarn] = React.useState<string | null>(null);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== "light";
  const themedBtn = isDarkMode ? styles.darkWatchBtn : styles.lightWatchBtn;

  function toggleWatch() {
    if (watching) {
      stopWatch();
    } else if (props.granted && anchor) {
      startWatch();
    }
  }

  React.useEffect(() => {
    if (!anchor && watching) {
      stopWatch();
    }
  }, [anchor]);

  React.useEffect(() => {
    if (hit >= MARGIN) {
      setWarn("Anchor dragging!");
    } else {
      setWarn(null);
    }
  }, [hit]);

  return (
    <View style={styles.anchorWatchContainer}>
      <View style={styles.anchorWatchHandle}>
        <Btn
          onPress={toggleWatch}
          label={watching ? "Stop" : "Start"}
          disabled={!anchor || !props.granted}
          style={themedBtn}
        />
        <DistanceSelection
          num={radius}
          nums={RADII}
          onSelect={setRadius}
          disabled={!anchor || watching}
        />
      </View>
      <Txt style={{ fontWeight: "bold" }}>
        {watching ? "Watching..." : "Not watching."}
      </Txt>
      {warn && <ErrTxt>{warn}</ErrTxt>}
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
