import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Txt } from "./src/components";
import { getDistanceFromLatLonInM, addErrs } from "./src/util";
import AnchorWatchView from "./src/AnchorWatchView";
import { BkgLocationContextProvider } from "./src/bkgLocationContext";
import { useCurrentLocation, useTheme, usePermissions } from "./src/hooks";
import { stopDanglingTasks } from "./src/bkgLocationService";
import AnchorSettingView from "./src/AnchorSettingView";
import LocationView from "./src/LocationView";
import DistanceView from "./src/DistanceView";
import InfoModal from "./src/InfoModal";

interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

function MainView(): JSX.Element {
  const loc = useCurrentLocation();
  const [anchor, setAnchor] = React.useState<LocationType>();

  function getDist(
    pos1?: LocationType,
    pos2?: LocationType
  ): number | undefined {
    if (!pos1 || !pos2) return undefined;
    return getDistanceFromLatLonInM(pos1.lat, pos1.lng, pos2.lat, pos2.lng);
  }

  function getStd(
    acc1?: number | null,
    acc2?: number | null
  ): number | undefined {
    if (acc1 && acc2) return addErrs(acc1, acc2);
    if (acc1) return acc1;
    if (acc2) return acc2;
    return undefined;
  }

  const std = getStd(loc?.acc, anchor?.acc);

  return (
    <View>
      <InfoModal />
      <Txt bold={true} size={20} style={styles.title}>
        Ankerwache
      </Txt>
      <LocationView loc={loc} label="Current" />
      <LocationView loc={anchor} label="Anchor" />
      <DistanceView dist={getDist(loc, anchor)} err={std} />
      <AnchorSettingView loc={loc} onSetAnchor={setAnchor} />
      <AnchorWatchView anchor={anchor} std={std} />
    </View>
  );
}

function PermissionsMissingView(): JSX.Element {
  return (
    <View style={styles.permissionsMsgContainer}>
      <Txt err={true}>
        This app needs location permissions. Please allow "location updates
        while using app". Location updates are used to determine the distance
        between you and the (virtual) anchor. All data stays on your phone.
        Locations are not saved furthermore.
      </Txt>
    </View>
  );
}

export default function App() {
  const { err, granted, loading } = usePermissions();
  const { darkMode, bkgCol } = useTheme();
  const fontCol = darkMode ? "white" : "black";

  React.useEffect(() => {
    stopDanglingTasks();
    return () => {
      stopDanglingTasks();
    };
  }, []);

  return (
    <BkgLocationContextProvider>
      <View style={[styles.container, bkgCol]}>
        {loading && <ActivityIndicator size="large" color={fontCol} />}
        {granted && !loading && <MainView />}
        {!granted && !loading && <PermissionsMissingView />}
        {err && <Txt err={true}>{err}</Txt>}
        <StatusBar />
      </View>
    </BkgLocationContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    paddingBottom: 20,
  },
  permissionsMsgContainer: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 300,
  },
});
