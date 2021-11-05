import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, ActivityIndicator, Pressable } from "react-native";
import * as Location from "expo-location";
import {
  convertLatDMS,
  convertLngDMS,
  formatLocationAcc,
  formatLocationTs,
  getDistanceFromLatLonInM,
} from "./src/util";
import { Txt, H1, H2, ErrTxt } from "./src/components";

interface Position {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

function PositionView(props: {
  pos: Position | null | undefined;
  ts: number | null | undefined;
}): JSX.Element {
  return (
    <View>
      <Txt>Lat: {props.pos ? convertLatDMS(props.pos.latitude) : "-"}</Txt>
      <Txt>Lng: {props.pos ? convertLngDMS(props.pos.longitude) : "-"}</Txt>
      <Txt>
        Accuracy: {props.pos ? formatLocationAcc(props.pos.accuracy) : "-"}
      </Txt>
      <Txt>Time: {props.ts ? formatLocationTs(props.ts) : "-"}</Txt>
    </View>
  );
}

function DistanceView(props: {
  pos1: Position | null | undefined;
  pos2: Position | null | undefined;
}): JSX.Element {
  let txt = "-";
  if (props.pos1 && props.pos2) {
    const d = getDistanceFromLatLonInM(
      props.pos1.latitude,
      props.pos1.longitude,
      props.pos2.latitude,
      props.pos2.longitude
    );
    txt = `${d} m`;
  }

  return (
    <View>
      <Txt>Distance: {txt}</Txt>
    </View>
  );
}

function useCurrentLocation() {
  const [errorMsg, setErrorMsg] = React.useState<null | string>(null);
  const [loc, setLoc] = React.useState<Location.LocationObject | null>(null);

  async function updateLocation() {
    const resp = await Location.requestForegroundPermissionsAsync();
    if (!resp.granted) {
      setErrorMsg("Persmission to get current location was denied");
      return;
    }
    const posOpts = { accuracy: Location.Accuracy.High };
    const loc = await Location.getCurrentPositionAsync(posOpts);
    setLoc(loc);
  }

  React.useEffect(() => {
    const interval = setInterval(updateLocation, 5000);
    updateLocation();
    return () => clearInterval(interval);
  }, []);

  return { errorMsg, loc };
}

export default function App() {
  const { loc: currentLoc, errorMsg: currentLocErr } = useCurrentLocation();
  const [anchorLoc, setanchorLoc] =
    React.useState<Location.LocationObject | null>(null);

  function handleSetAnchor() {
    setanchorLoc(currentLoc);
  }

  function handleRetrieveAnchor() {
    setanchorLoc(null);
  }

  return (
    <View style={styles.container}>
      <H2>Current Position</H2>
      <PositionView pos={currentLoc?.coords} ts={currentLoc?.timestamp} />
      {currentLocErr && <ErrTxt>{currentLocErr}</ErrTxt>}
      <H2>Anchor Position</H2>
      <PositionView pos={anchorLoc?.coords} ts={anchorLoc?.timestamp} />
      <View style={styles.anchorButtonsContainer}>
        <Pressable
          onPress={handleSetAnchor}
          disabled={currentLoc === null}
          style={styles.button}
        >
          <Txt>Set</Txt>
        </Pressable>
        <Pressable
          onPress={handleRetrieveAnchor}
          disabled={currentLoc === null}
          style={styles.button}
        >
          <Txt>Retrieve</Txt>
        </Pressable>
      </View>
      <DistanceView pos1={currentLoc?.coords} pos2={anchorLoc?.coords} />
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  anchorButtonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  button: {
    padding: 10,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "#adadad",
  },
});
