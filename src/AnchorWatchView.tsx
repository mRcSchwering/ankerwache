import React from "react";
import { StyleSheet, View } from "react-native";
import { Btn, Txt } from "./components";
import RadiusSelection from "./RadiusSelection";
import { useTheme, useAlarm } from "./hooks";
import { ANCHOR_WATCH_MARGIN, ACC_THRESH } from "./constants";
import { getDistanceFromLatLonInM, addErrs } from "./util";
import { BkgLocationContext } from "./bkgLocationContext";
import {
  subscribeBkgLocationUpdates,
  unsubscribeBkgLocationUpdates,
} from "./bkgLocationService";

const STD_THRESH = addErrs(ACC_THRESH, ACC_THRESH);

/**
 * Running average over measured location;
 * I.e. exponential moving average of locations
 */
function averageLocation(
  curr: [number, number],
  prev?: [number, number]
): [number, number] {
  if (!prev) return curr;
  return [(prev[0] + curr[0]) / 2, (prev[1] + curr[1]) / 2];
}

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
  const { startAlarm, stopAlarm, err: alarmErr } = useAlarm();

  // counter counting up/down in-/out-of-bound readings
  const [count, setCount] = React.useState(0);

  // raw location from
  const { loc, setLoc } = React.useContext(BkgLocationContext);

  // smoothed location used for distance calculation
  const [smthdLoc, setSmthdLoc] = React.useState<[number, number]>();

  async function stopWatch() {
    setCount(0);
    setSmthdLoc(undefined);
    stopAlarm();
    unsubscribeBkgLocationUpdates(setLoc);
  }

  async function startWatch() {
    setCount(0);
    loc && setSmthdLoc([loc.lat, loc.lng]);
    subscribeBkgLocationUpdates({
      locationSubscription: setLoc,
      errorMsgSubscription: setLocErr,
    });
  }

  React.useEffect(() => {
    if (loc && target) {
      const newLoc = averageLocation([loc.lat, loc.lng], smthdLoc);
      const d = getDistanceFromLatLonInM(
        newLoc[0],
        newLoc[1],
        target.lat,
        target.lng
      );
      setSmthdLoc(newLoc);
      if (d > radius) {
        setCount((d) => d + 1);
      } else {
        setCount((d) => Math.max(d - 1, 0));
      }
    }
  }, [loc, target, radius]);

  React.useEffect(() => {
    if (count >= ANCHOR_WATCH_MARGIN) {
      setWarn("Anchor dragging!");
      startAlarm();
    } else {
      setWarn(undefined);
      stopAlarm();
    }
  }, [count]);

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
  std?: number;
}

export default function AnchorWatchView(
  props: AnchorWatchViewProps
): JSX.Element {
  const [watching, setWatching] = React.useState(false);
  const [radius, setRadius] = React.useState(30);
  const { err, warn, startWatch, stopWatch } = useAnchorWatch(
    radius,
    props.anchor
  );

  const { redBkg } = useTheme();

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
    <View style={styles.container}>
      <View style={styles.btnsContainer}>
        <Btn
          onPress={toggleWatch}
          label={watching ? "Stop" : "Start"}
          disabled={!props.anchor}
          style={[styles.watchBtn, redBkg]}
        />
        <RadiusSelection
          std={props.std}
          radius={radius}
          onSelect={setRadius}
          disabled={!props.anchor || watching}
        />
      </View>
      <Txt bold={true}>{watching ? "Watching..." : "Not watching."}</Txt>
      {err && <Txt err={true}>{err}</Txt>}
      {warn && (
        <Txt err={true} size={20} bold={true}>
          {warn}
        </Txt>
      )}
      {props.std && props.std > STD_THRESH && <Txt err>Bad GPS accuracy</Txt>}
    </View>
  );
}

const styles = StyleSheet.create({
  watchBtn: {
    paddingHorizontal: 50,
    paddingVertical: 15,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  btnsContainer: {
    flexDirection: "row",
  },
});
