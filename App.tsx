import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { Btn, ErrTxt } from "./src/components";
import {
  LocationType,
  subscribeLocationUpdates,
  unsubscribeLocationUpdates,
} from "./src/locationService";
import { useCurrentLocation, useAnchor, usePermissions } from "./src/hooks";
import PositionDistanceView from "./src/PositionDistanceView";
import AnchorWatchView from "./src/AnchorWatchView";

function HomeView(props: { isDarkMode: boolean }): JSX.Element {
  const { error, granted } = usePermissions();
  const { loc: currentLoc } = useCurrentLocation(granted);
  const { setAnchor, retrieveAnchor, anchorLoc } = useAnchor();

  const themedAnchorBtn = props.isDarkMode
    ? styles.darkAnchorBtn
    : styles.lightAnchorBtn;

  return (
    <View>
      <PositionDistanceView currentLoc={currentLoc} anchorLoc={anchorLoc} />
      <View style={styles.anchorButtonsContainer}>
        <Btn
          onPress={() => setAnchor(currentLoc)}
          disabled={currentLoc === null}
          label="Set"
          style={themedAnchorBtn}
        />
        <Btn
          onPress={retrieveAnchor}
          disabled={currentLoc === null}
          label="Retrieve"
          style={themedAnchorBtn}
        />
      </View>
      <AnchorWatchView location={anchorLoc?.coords} granted={granted} />
      {error && <ErrTxt>{error}</ErrTxt>}
    </View>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== "light";

  const [location, setLocation] = React.useState<LocationType | null>(null);

  function onLocationUpdate(location: LocationType) {
    setLocation(location);
  }

  React.useEffect(() => {
    console.log("in app:", location);
  }, [location]);

  React.useEffect(() => {
    subscribeLocationUpdates(onLocationUpdate);
    return () => {
      unsubscribeLocationUpdates(onLocationUpdate);
    };
  }, []);

  const themedContainer = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;

  return (
    <View style={[styles.container, themedContainer]}>
      <HomeView isDarkMode={isDarkMode} />
      <StatusBar />
    </View>
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
