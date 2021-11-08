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
import {
  LocationContextProvider,
  LocationContext,
} from "./src/locationContext";

function HomeView(props: { isDarkMode: boolean }): JSX.Element {
  const { setAnchor, retrieveAnchor, anchorLoc } = useAnchor();
  const { loc, updateLoc } = React.useContext(LocationContext);

  const themedAnchorBtn = props.isDarkMode
    ? styles.darkAnchorBtn
    : styles.lightAnchorBtn;

  function onLocationUpdate(location: LocationType) {
    updateLoc(location);
  }

  React.useEffect(() => {
    subscribeLocationUpdates(onLocationUpdate);
    return () => {
      unsubscribeLocationUpdates(onLocationUpdate);
    };
  }, []);

  return (
    <View>
      <PositionDistanceView currentLoc={loc} anchorLoc={anchorLoc} />
      <View style={styles.anchorButtonsContainer}>
        <Btn
          onPress={() => setAnchor(loc)}
          disabled={loc === null}
          label="Set"
          style={themedAnchorBtn}
        />
        <Btn
          onPress={retrieveAnchor}
          disabled={loc === null}
          label="Retrieve"
          style={themedAnchorBtn}
        />
      </View>
      <AnchorWatchView loc={anchorLoc} granted={false} />
    </View>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== "light";

  const themedContainer = isDarkMode
    ? styles.darkContainer
    : styles.lightContainer;

  return (
    <LocationContextProvider>
      <View style={[styles.container, themedContainer]}>
        <HomeView isDarkMode={isDarkMode} />
        <StatusBar />
      </View>
    </LocationContextProvider>
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
