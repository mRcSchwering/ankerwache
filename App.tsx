import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Txt } from "./src/components";
import PositionDistanceView from "./src/PositionDistanceView";
import AnchorWatchView from "./src/AnchorWatchView";
import { BkgLocationContextProvider } from "./src/bkgLocationContext";
import { useCurrentLocation, useTheme, usePermissions } from "./src/hooks";
import { stopDanglingTasks } from "./src/bkgLocationService";
import AnchorSettingView from "./src/AnchorSettingView";

interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

function MainView(): JSX.Element {
  const loc = useCurrentLocation();
  const [anchor, setAnchor] = React.useState<LocationType>();

  return (
    <View>
      <PositionDistanceView loc={loc} anchor={anchor} />
      <AnchorSettingView loc={loc} onSetAnchor={setAnchor} />
      <AnchorWatchView anchor={anchor} />
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
  permissionsMsgContainer: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 300,
  },
});
