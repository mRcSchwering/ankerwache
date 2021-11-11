import React from "react";
import { StyleSheet, View } from "react-native";
import { convertLatDMS, convertLngDMS, formatLocationTs } from "./util";
import { Txt } from "./components";

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

export default function LocationView(props: {
  loc?: LocationType;
  label: string;
}): JSX.Element {
  return (
    <View style={styles.container}>
      <Txt size={15} bold={true} align="left">
        {props.label}
      </Txt>
      <Txt pre={true} align="left">
        Lat: {props.loc ? convertLatDMS(props.loc.lat) : "-"}
      </Txt>
      <Txt pre={true} align="left">
        Lng: {props.loc ? convertLngDMS(props.loc.lng) : "-"}
      </Txt>
      <Txt pre={true} align="left">
        Time: {props.loc?.ts ? formatLocationTs(props.loc?.ts) : "-"}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxWidth: 200,
  },
});
