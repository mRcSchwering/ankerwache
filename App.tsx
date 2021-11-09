import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { Btn, ErrTxt } from "./src/components";
import PositionDistanceView from "./src/PositionDistanceView";
import AnchorWatchView from "./src/AnchorWatchView";
import { BkgLocationContextProvider } from "./src/bkgLocationContext";
import { useCurrentLocation } from "./src/hooks";
import { stopDanglingTasks } from "./src/bkgLocationService";

interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

function HomeView(props: { isDarkMode: boolean }): JSX.Element {
  const { err, loc } = useCurrentLocation();
  const [anchor, setAnchor] = React.useState<LocationType | null>(null);

  const themedAnchorBtn = props.isDarkMode
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
      <AnchorWatchView anchor={anchor} granted={err === null} />
      {err && <ErrTxt>{err}</ErrTxt>}
    </View>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== "light";

  const themedContainer = isDarkMode
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
        <HomeView isDarkMode={isDarkMode} />
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
