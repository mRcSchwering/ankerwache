import React from "react";
import { StyleSheet, View } from "react-native";
import {
  convertLatDMS,
  convertLngDMS,
  formatLocationTs,
  getDistanceFromLatLonInM,
  formatDistance,
  addErrs,
} from "./util";
import { Pre, H4 } from "./components";
import { LocationObject } from "expo-location";

interface Position {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

function PositionView(props: {
  pos: Position | null | undefined;
  ts: number | null | undefined;
  label: string;
}): JSX.Element {
  return (
    <View style={styles.positionViewContainer}>
      <H4>{props.label}</H4>
      <Pre>Lat: {props.pos ? convertLatDMS(props.pos.latitude) : "-"}</Pre>
      <Pre>Lng: {props.pos ? convertLngDMS(props.pos.longitude) : "-"}</Pre>
      <Pre>Time: {props.ts ? formatLocationTs(props.ts) : "-"}</Pre>
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
    let err = null;
    if (props.pos1.accuracy !== null && props.pos2.accuracy !== null) {
      err = addErrs(props.pos1.accuracy, props.pos2.accuracy);
    } else if (props.pos1 !== null) {
      err = props.pos1.accuracy;
    } else if (props.pos2 !== null) {
      err = props.pos2.accuracy;
    }
    txt = formatDistance(d, err);
  }

  return (
    <View style={styles.distanceViewContainer}>
      <H4>Distance: {txt}</H4>
    </View>
  );
}

export default function PositionDistanceView(props: {
  currentLoc: LocationObject | null;
  anchorLoc: LocationObject | null;
}): JSX.Element {
  return (
    <>
      <PositionView
        pos={props.currentLoc?.coords}
        ts={props.currentLoc?.timestamp}
        label="Current"
      />
      <PositionView
        pos={props.anchorLoc?.coords}
        ts={props.anchorLoc?.timestamp}
        label="Anchor"
      />
      <DistanceView
        pos1={props.currentLoc?.coords}
        pos2={props.anchorLoc?.coords}
      />
    </>
  );
}

const styles = StyleSheet.create({
  positionViewContainer: {
    maxWidth: 200,
  },
  distanceViewContainer: {
    marginVertical: 10,
  },
});
