import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
} from "expo-location";

function H1(props: { children?: React.ReactNode }): JSX.Element {
  return <Text style={styles.h1}>{props.children}</Text>;
}

export function toDMS(coordinate: number): string {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const mins = (absolute - degrees) * 60;
  const minsFlrd = Math.floor(mins);
  const seconds = Math.floor((mins - minsFlrd) * 60);
  return degrees + "° " + minsFlrd + "' " + seconds + "''";
}

export function convertLatDMS(lng: number): string {
  const val = toDMS(lng);
  const card = lng >= 0 ? "N" : "S";
  return val + " " + card;
}

export function convertLngDMS(lng: number): string {
  const val = toDMS(lng);
  const card = lng >= 0 ? "E" : "W";
  return val + " " + card;
}

export function formatLocationAcc(acc: number | null): string {
  return acc ? `${Math.floor(acc)} m` : "unknown";
}

export function formatLocationTs(ts: number): string {
  return `${new Date(ts).toISOString()}`;
}

export default function App() {
  const [errorMsg, setErrorMsg] = React.useState<any>(null);
  const [location, setLocation] = React.useState<LocationObject | null>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const loc = await getCurrentPositionAsync();
      console.log(loc);
      setLocation(loc);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <H1>Ankerwache</H1>
      <View>
        <Text>Lat: {location && convertLatDMS(location.coords.latitude)}</Text>
        <Text>Lng: {location && convertLngDMS(location.coords.longitude)}</Text>
        <Text>
          Acc: {location && formatLocationAcc(location.coords.accuracy)}
        </Text>
        <Text>Time: {location && formatLocationTs(location.timestamp)}</Text>
      </View>
      <Text style={styles.errorMsg}>{errorMsg}</Text>
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
  errorMsg: {
    color: "red",
  },
  h1: {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontSize: 30,
    fontWeight: "bold",
  },
});
