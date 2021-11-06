import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import {
  Btn,
  ErrTxt,
  PositionView,
  DistanceView,
  Txt,
  NumberSelection,
} from "./src/components";
import { useCurrentLocation, useAnchor } from "./src/hooks";

interface Location {
  latitude: number;
  longitude: number;
}

interface AnchorWatchViewProps {
  location?: Location | null;
  isDarkMode: boolean;
}

function AnchorWatchView(props: AnchorWatchViewProps): JSX.Element {
  const RADII = [10, 20, 30, 40, 50, 60, 70];

  const [radius, setRadius] = React.useState(RADII[2]);
  const [watching, setWatching] = React.useState(false);

  const themedBtn = props.isDarkMode
    ? styles.darkWatchBtn
    : styles.lightWatchBtn;

  React.useEffect(() => {
    if (!props.location) {
      setWatching(false);
    }
  }, [props.location]);

  function toggleWatch() {
    if (props.location) {
      setWatching((d) => !d);
      console.log(props.location);
    }
  }

  return (
    <View style={styles.anchorWatchContainer}>
      <View style={styles.anchorWatchHandle}>
        <Btn
          onPress={toggleWatch}
          label={watching ? "Stop" : "Start"}
          disabled={!props.location}
          style={themedBtn}
        />
        <NumberSelection
          num={radius}
          nums={RADII}
          onSelect={setRadius}
          disabled={!props.location || watching}
        />
      </View>

      <Txt style={{ fontWeight: "bold" }}>
        {watching ? "Watching..." : "Not watching."}
      </Txt>
    </View>
  );
}

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
      <AnchorWatchView
        location={anchorLoc?.coords}
        isDarkMode={props.isDarkMode}
      />
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
    backgroundColor: "#a9b0d5",
  },
  lightWatchBtn: {
    backgroundColor: "#ff9f9f",
    paddingHorizontal: 50,
    paddingVertical: 15,
  },
  darkWatchBtn: {
    backgroundColor: "#a9b0d5",
  },
  anchorWatchContainer: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  anchorWatchHandle: {
    flexDirection: "row",
  },
});
