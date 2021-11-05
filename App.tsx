import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, ActivityIndicator, Button } from "react-native";
import * as Location from "expo-location";
import {
  convertLatDMS,
  convertLngDMS,
  formatLocationAcc,
  formatLocationTs,
  getDistanceFromLatLonInM,
} from "./src/util";
import { Txt, H1, ErrTxt } from "./src/components";

interface Position {
  latitude: number;
  longitude: number;
}

interface CurrentPositionViewProps extends Position {
  accuracy: number | null;
  timestamp: number;
}

function CurrentPositionView(props: CurrentPositionViewProps): JSX.Element {
  return (
    <View>
      <Txt>Lat: {convertLatDMS(props.latitude)}</Txt>
      <Txt>Lng: {convertLngDMS(props.longitude)}</Txt>
      <Txt>Accuracy: {formatLocationAcc(props.accuracy)}</Txt>
      <Txt>Time: {formatLocationTs(props.timestamp)}</Txt>
    </View>
  );
}

export default function App() {
  const radius = 30;
  const anchor = { latitude: 52.557, longitude: 13.378 };
  const [errorMsg, setErrorMsg] = React.useState<null | string>(null);
  const [loc, setLoc] = React.useState<Location.LocationObject | null>(null);

  async function updateLocation() {
    setLoc(null);
    console.log("update");

    const resp = await Location.requestForegroundPermissionsAsync();
    if (!resp.granted) {
      setErrorMsg("Persmission to get location was not granted");
      return;
    }

    const loc = await Location.getCurrentPositionAsync();
    setLoc(loc);
  }

  return (
    <View style={styles.container}>
      <H1>Ankerwache</H1>
      {loc ? (
        <CurrentPositionView timestamp={loc.timestamp} {...loc.coords} />
      ) : (
        <ActivityIndicator />
      )}
      <Button onPress={updateLocation} title="update" />
      {errorMsg && <ErrTxt>{errorMsg}</ErrTxt>}
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
});
