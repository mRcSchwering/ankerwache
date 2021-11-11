import React from "react";
import { StyleSheet, View } from "react-native";
import { Btn, Txt } from "./components";
import RadiusSelection from "./RadiusSelection";
import { useTheme, useAlarm } from "./hooks";
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
