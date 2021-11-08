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

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

function LocationView(props: {
  loc?: LocationType | null;
  label: string;
}): JSX.Element {
  return (
    <View style={styles.positionViewContainer}>
      <H4>{props.label}</H4>
      <Pre>Lat: {props.loc ? convertLatDMS(props.loc.lat) : "-"}</Pre>
      <Pre>Lng: {props.loc ? convertLngDMS(props.loc.lng) : "-"}</Pre>
      <Pre>Time: {props.loc?.ts ? formatLocationTs(props.loc?.ts) : "-"}</Pre>
    </View>
  );
}

function DistanceView(props: {
  pos1?: LocationType | null;
  pos2?: LocationType | null;
}): JSX.Element {
  let txt = "-";
  if (props.pos1 && props.pos2) {
    const d = getDistanceFromLatLonInM(
      props.pos1.lat,
      props.pos1.lng,
      props.pos2.lat,
      props.pos2.lng
    );
    let err = null;
    if (props.pos1.acc !== null && props.pos2.acc !== null) {
      err = addErrs(props.pos1.acc, props.pos2.acc);
    } else if (props.pos1.acc !== null) {
      err = props.pos1.acc;
    } else if (props.pos2.acc !== null) {
      err = props.pos2.acc;
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
  currentLoc: LocationType | null;
  anchorLoc: LocationType | null;
}): JSX.Element {
  return (
    <>
      <LocationView loc={props.currentLoc} label="Current" />
      <LocationView loc={props.anchorLoc} label="Anchor" />
      <DistanceView pos1={props.currentLoc} pos2={props.anchorLoc} />
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
