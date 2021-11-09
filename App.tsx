import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Btn, ErrTxt } from "./src/components";
import PositionDistanceView from "./src/PositionDistanceView";
import AnchorWatchView from "./src/AnchorWatchView";
import { BkgLocationContextProvider } from "./src/bkgLocationContext";
import { useCurrentLocation, useDarkMode, usePermissions } from "./src/hooks";
import { stopDanglingTasks } from "./src/bkgLocationService";

interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

function MainView(): JSX.Element {
  const darkMode = useDarkMode();
  const loc = useCurrentLocation();
  const [anchor, setAnchor] = React.useState<LocationType | null>(null);

  const themedAnchorBtn = darkMode
    ? styles.darkAnchorBtn
    : styles.lightAnchorBtn;

  return (
    <View>
      <PositionDistanceView loc={loc} anchor={anchor} />
      <View style={styles.anchorButtonsContainer}>
        <Btn
          onPress={() => setAnchor(loc)}
          disabled={loc === null}
          label="Set"
          style={themedAnchorBtn}
        />
        <Btn
          onPress={() => setAnchor(null)}
          disabled={loc === null}
          label="Retrieve"
          style={themedAnchorBtn}
        />
      </View>
      <AnchorWatchView anchor={anchor} />
    </View>
  );
}

function PermissionsMissingView(): JSX.Element {
  return (
    <View style={styles.permissionsMsgContainer}>
      <ErrTxt>
        This app needs location permissions. Please allow this app to get
        location updates while in use.
      </ErrTxt>
    </View>
  );
}

export default function App() {
  const { err, granted, loading } = usePermissions();
  const darkMode = useDarkMode();

  const themedCol = darkMode ? "white" : "black";
  const themedContainer = darkMode
    ? styles.darkContainer
    : styles.lightContainer;

  React.useEffect(() => {
    stopDanglingTasks();
    return () => {
      stopDanglingTasks();
    };
  }, []);

  return (
    <BkgLocationContextProvider>
      <View style={[styles.container, themedContainer]}>
        {loading && <ActivityIndicator size="large" color={themedCol} />}
        {granted && !loading && <MainView />}
        {!granted && !loading && <PermissionsMissingView />}
        {err && <ErrTxt>{err}</ErrTxt>}
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
  lightContainer: {
    backgroundColor: "#fff",
  },
  darkContainer: {
    backgroundColor: "#000000",
  },
  permissionsMsgContainer: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 300,
  },
  anchorButtonsContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  lightAnchorBtn: {
    backgroundColor: "#c5ceff",
  },
  darkAnchorBtn: {
    backgroundColor: "#6f7bbf",
  },
  moveAnchorContainer: {
    paddingVertical: 10,
  },
});
