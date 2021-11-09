import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { Btn, Txt, ErrTxt } from "./components";
import DistanceSelection from "./DistanceSelection";
import { useAnchorWatch } from "./hooks";
import { BkgLocationContext } from "./bkgLocationContext";
import {
  subscribeBkgLocationUpdates,
  unsubscribeBkgLocationUpdates,
} from "./bkgLocationService";

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

interface AnchorWatchView {
  anchor: LocationType | null;
  granted: boolean;
}

const MARGIN = 3;
const RADII = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function AnchorWatchView(props: AnchorWatchView): JSX.Element {
  const [err, setErr] = React.useState<string | null>(null);
  const { loc, setLoc } = React.useContext(BkgLocationContext);
  const [radius, setRadius] = React.useState(RADII[2]);
  const [warn, setWarn] = React.useState<string | null>(null);
  const { hit, watching, startWatch, stopWatch } = useAnchorWatch(
    radius,
    loc,
    props.anchor
  );

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== "light";
  const themedBtn = isDarkMode ? styles.darkWatchBtn : styles.lightWatchBtn;

  function toggleWatch() {
    if (watching) {
      stopWatch();
      unsubscribeBkgLocationUpdates(setLoc);
    } else if (props.granted && props.anchor) {
      startWatch();
      subscribeBkgLocationUpdates({
        locationSubscription: setLoc,
        errorMsgSubscription: setErr,
      });
    }
  }

  React.useEffect(() => {
    if (!props.anchor && watching) {
      stopWatch();
      unsubscribeBkgLocationUpdates(setLoc);
    }
  }, [props.anchor]);

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
          disabled={!props.anchor || !props.granted}
          style={themedBtn}
        />
        <DistanceSelection
          num={radius}
          nums={RADII}
          onSelect={setRadius}
          disabled={!props.anchor || watching}
        />
      </View>
      <Txt style={{ fontWeight: "bold" }}>
        {watching ? "Watching..." : "Not watching."}
      </Txt>
      {warn && <ErrTxt>{warn}</ErrTxt>}
      {err && <ErrTxt>{err}</ErrTxt>}
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
