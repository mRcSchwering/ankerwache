import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
} from "expo-location";
import {
  convertLatDMS,
  convertLngDMS,
  formatLocationAcc,
  formatLocationTs,
} from "./src/util";
import { Txt, H1, ErrTxt } from "./src/components";

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
        <Txt>Lat: {location && convertLatDMS(location.coords.latitude)}</Txt>
        <Txt>Lng: {location && convertLngDMS(location.coords.longitude)}</Txt>
        <Txt>
          Acc: {location && formatLocationAcc(location.coords.accuracy)}
        </Txt>
        <Txt>Time: {location && formatLocationTs(location.timestamp)}</Txt>
      </View>
      <ErrTxt>{errorMsg}</ErrTxt>
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
