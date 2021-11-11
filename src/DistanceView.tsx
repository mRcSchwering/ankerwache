import React from "react";
import { StyleSheet, View } from "react-native";
import { formatDistance } from "./util";
import { Txt } from "./components";

export default function DistanceView(props: {
  dist?: number;
  err?: number;
}): JSX.Element {
  return (
    <View style={styles.container}>
      <Txt size={15} bold={true} align="left">
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
