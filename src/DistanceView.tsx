import React from "react";
import { StyleSheet, View } from "react-native";
import { formatDistance, addErrs } from "./util";
import { Txt } from "./components";
import { ACC_THRESH } from "./constants";

const THRESH = addErrs(ACC_THRESH, ACC_THRESH);

export default function DistanceView(props: {
  dist?: number;
  err?: number;
}): JSX.Element {
  return (
    <View style={styles.container}>
      <Txt
        size={15}
        bold={true}
        align="left"
        err={!!props.err && props.err > THRESH}
      >
        Distance: {formatDistance(props.dist || null, props.err || null)}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});
