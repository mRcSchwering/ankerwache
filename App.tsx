import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { Btn, ErrTxt } from "./src/components";
import {
  subscribeLocationUpdates,
  unsubscribeLocationUpdates,
} from "./src/locationService";
import PositionDistanceView from "./src/PositionDistanceView";
import AnchorWatchView from "./src/AnchorWatchView";
import {
  LocationContextProvider,
  LocationContext,
} from "./src/locationContext";

function HomeView(props: { isDarkMode: boolean }): JSX.Element {
  const [err, setErr] = React.useState<string | null>(null);
  const { current, setCurrent, setAnchor } = React.useContext(LocationContext);

  const themedAnchorBtn = props.isDarkMode
    ? styles.darkAnchorBtn
    : styles.lightAnchorBtn;

  function retrieveAnchor() {
    setAnchor(null);
  }

  React.useEffect(() => {
    subscribeLocationUpdates({
      locationSubscription: setCurrent,
      errorMsgSubscription: setErr,
    });
    return () => {
      unsubscribeLocationUpdates(setCurrent);
    };
  }, []);

  return (
    <View>
      <PositionDistanceView />
      <View style={styles.anchorButtonsContainer}>
        <Btn
          onPress={() => setAnchor(current)}
          disabled={current === null}
          label="Set"
          style={themedAnchorBtn}
        />
        <Btn
          onPress={retrieveAnchor}
          disabled={current === null}
          label="Retrieve"
          style={themedAnchorBtn}
        />
      </View>
      <AnchorWatchView granted={err === null} />
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
