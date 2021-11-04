import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import {
  convertLatDMS,
  convertLngDMS,
  formatLocationAcc,
  formatLocationTs,
  getDistanceFromLatLonInM,
} from "./src/util";
import { Txt, H1, ErrTxt } from "./src/components";
import { useCurrentLocation } from "./src/hooks";
import StartAnchorWatchButton from "./src/StartAnchorWatch";

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

function AnchorWatchView(props: {
  anchor: Position;
  current: Position;
}): JSX.Element {
  const dist = getDistanceFromLatLonInM(
    props.anchor.latitude,
    props.anchor.longitude,
    props.current.latitude,
    props.current.longitude
  );
  return (
    <View>
      <Txt>Distance: {Math.round(dist)} m</Txt>
    </View>
  );
}

export default function App() {
  const radius = 30;
  const anchor = { latitude: 52.557, longitude: 13.378 };
  const { error: locError, location } = useCurrentLocation();

  return (
    <View style={styles.container}>
      <H1>Ankerwache</H1>
      {location ? (
        <CurrentPositionView
          timestamp={location.timestamp}
          {...location.coords}
        />
      ) : (
        <ActivityIndicator />
      )}
      {location && (
        <StartAnchorWatchButton region={{ radius, ...location.coords }} />
      )}
      {location && (
        <AnchorWatchView anchor={anchor} current={location.coords} />
      )}
      {locError && <ErrTxt>{locError}</ErrTxt>}
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
