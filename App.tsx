import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { Btn, ErrTxt, PositionView, DistanceView } from "./src/components";
import { useCurrentLocation, useAnchor } from "./src/hooks";

function HomeView(props: { isDarkMode: boolean }): JSX.Element {
  const { loc: currentLoc, errorMsg: currentLocErr } = useCurrentLocation();
  const { setAnchor, retrieveAnchor, anchorLoc } = useAnchor();

  const themedAnchorBtn = props.isDarkMode
    ? styles.darkAnchorBtn
    : styles.lightAnchorBtn;

  return (
    <View>
      <PositionView
        pos={currentLoc?.coords}
        ts={currentLoc?.timestamp}
        label="Current"
      />
      <PositionView
        pos={anchorLoc?.coords}
        ts={anchorLoc?.timestamp}
        label="Anchor"
      />
      <DistanceView pos1={currentLoc?.coords} pos2={anchorLoc?.coords} />
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
      {currentLocErr && <ErrTxt>{currentLocErr}</ErrTxt>}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  lightAnchorBtn: {
    backgroundColor: "#a9b0d5",
  },
  darkAnchorBtn: {
    backgroundColor: "#a9b0d5",
  },
});
