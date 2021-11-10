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
import { Txt } from "./components";

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

function LocationView(props: {
  loc?: LocationType;
  label: string;
}): JSX.Element {
  return (
    <View style={styles.positionViewContainer}>
      <Txt size={15} bold={true}>
        {props.label}
      </Txt>
      <Txt pre={true}>
        Lat: {props.loc ? convertLatDMS(props.loc.lat) : "-"}
      </Txt>
      <Txt pre={true}>
        Lng: {props.loc ? convertLngDMS(props.loc.lng) : "-"}
      </Txt>
      <Txt pre={true}>
        Time: {props.loc?.ts ? formatLocationTs(props.loc?.ts) : "-"}
      </Txt>
    </View>
  );
}

function DistanceView(props: {
  pos1?: LocationType;
  pos2?: LocationType;
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
      <Txt size={15} bold={true}>
        Distance: {txt}
      </Txt>
    </View>
  );
}

export default function PositionDistanceView(props: {
  loc?: LocationType;
  anchor?: LocationType;
}): JSX.Element {
  return (
    <>
      <LocationView loc={props.loc} label="Current" />
      <LocationView loc={props.anchor} label="Anchor" />
      <DistanceView pos1={props.loc} pos2={props.anchor} />
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
