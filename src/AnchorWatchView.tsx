import React from "react";
import { StyleSheet, View } from "react-native";
import { Btn, Txt } from "./components";
import DistanceSelection from "./DistanceSelection";
import { useDarkMode, useAlarm } from "./hooks";
import { getDistanceFromLatLonInM } from "./util";
import { BkgLocationContext } from "./bkgLocationContext";
import {
  subscribeBkgLocationUpdates,
  unsubscribeBkgLocationUpdates,
} from "./bkgLocationService";

const ANCHOR_WATCH_MARGIN = 3;

interface useAnchorWatchType {
  err?: string;
  warn?: string;
  startWatch: () => void;
  stopWatch: () => void;
}

function useAnchorWatch(
  radius: number,
  target?: LocationType
): useAnchorWatchType {
  const [locErr, setLocErr] = React.useState<string>();
  const [warn, setWarn] = React.useState<string>();
  const [hit, setHit] = React.useState(0);
  const { loc, setLoc } = React.useContext(BkgLocationContext);
  const { startAlarm, stopAlarm, err: alarmErr } = useAlarm();

  async function stopWatch() {
    setHit(0);
    stopAlarm();
    unsubscribeBkgLocationUpdates(setLoc);
  }

  async function startWatch() {
    setHit(0);
    subscribeBkgLocationUpdates({
      locationSubscription: setLoc,
      errorMsgSubscription: setLocErr,
    });
  }

  React.useEffect(() => {
    if (loc && target) {
      const d = getDistanceFromLatLonInM(
        loc.lat,
        loc.lng,
        target.lat,
        target.lng
      );
      if (d > radius) {
        setHit((d) => d + 1);
      } else {
        setHit((d) => Math.max(d - 1, 0));
      }
    }
  }, [loc, target, radius]);

  React.useEffect(() => {
    if (hit >= ANCHOR_WATCH_MARGIN) {
      setWarn("Anchor dragging!");
      startAlarm();
    } else {
      setWarn(undefined);
      stopAlarm();
    }
  }, [hit]);

  return { err: alarmErr || locErr, warn, startWatch, stopWatch };
}

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

interface AnchorWatchViewProps {
  anchor?: LocationType;
}

const RADII = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function AnchorWatchView(
  props: AnchorWatchViewProps
): JSX.Element {
  const [watching, setWatching] = React.useState(false);
  const [radius, setRadius] = React.useState(RADII[2]);
  const { err, warn, startWatch, stopWatch } = useAnchorWatch(
    radius,
    props.anchor
  );

  const darkMode = useDarkMode();
  const themedBtn = darkMode ? styles.darkWatchBtn : styles.lightWatchBtn;

  function toggleWatch() {
    if (watching) {
      setWatching(false);
      stopWatch();
    } else if (props.anchor) {
      setWatching(true);
      startWatch();
    }
  }

  React.useEffect(() => {
    if (!props.anchor) {
      setWatching(false);
      stopWatch();
    }
  }, [props.anchor]);

  return (
    <View style={styles.anchorWatchContainer}>
      <View style={styles.anchorWatchHandle}>
        <Btn
          onPress={toggleWatch}
          label={watching ? "Stop" : "Start"}
          disabled={!props.anchor}
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
      {err && <Txt err={true}>{err}</Txt>}
      {warn && (
        <Txt err={true} size={20} bold={true}>
          {warn}
        </Txt>
      )}
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
