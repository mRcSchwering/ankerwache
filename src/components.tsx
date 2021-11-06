import React from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  useColorScheme,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  convertLatDMS,
  convertLngDMS,
  formatLocationAcc,
  formatLocationTs,
  getDistanceFromLatLonInM,
  formatDistance,
} from "./util";

export function Txt(props: {
  children?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
}): JSX.Element {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== "light";
  const themedText = isDarkMode ? styles.darkTxt : styles.lightTxt;

  let disabledTheme = {};
  if (props.disabled !== undefined ? props.disabled : false) {
    disabledTheme = isDarkMode
      ? styles.darkDisabledTxt
      : styles.lightDisabledTxt;
  }

  return (
    <Text style={[themedText, props.style, disabledTheme]}>
      {props.children}
    </Text>
  );
}

export function H2(props: { children?: React.ReactNode }): JSX.Element {
  return <Txt style={styles.h2}>{props.children}</Txt>;
}

export function H4(props: { children?: React.ReactNode }): JSX.Element {
  return <Txt style={styles.h4}>{props.children}</Txt>;
}

export function Pre(props: { children?: React.ReactNode }): JSX.Element {
  return <Txt style={styles.pre}>{props.children}</Txt>;
}

export function ErrTxt(props: { children?: React.ReactNode }): JSX.Element {
  return <Txt style={styles.errorMsg}>{props.children}</Txt>;
}

interface BtnProps {
  onPress?: () => void;
  disabled?: boolean;
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function Btn(props: BtnProps): JSX.Element {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== "light";

  const isDisabled = props.disabled !== undefined ? props.disabled : false;
  let disabledTheme = {};
  if (isDisabled) {
    disabledTheme = isDarkMode
      ? styles.darkDisabledButton
      : styles.lightDisabledButton;
  }

  return (
    <Pressable
      onPress={props.onPress}
      disabled={isDisabled}
      style={[styles.button, props.style, disabledTheme]}
    >
      <Txt disabled={isDisabled}>{props.label}</Txt>
    </Pressable>
  );
}

interface Position {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export function PositionView(props: {
  pos: Position | null | undefined;
  ts: number | null | undefined;
  label: string;
}): JSX.Element {
  return (
    <View style={styles.positionViewContainer}>
      <H4>{props.label}</H4>
      <Pre>Lat: {props.pos ? convertLatDMS(props.pos.latitude) : "-"}</Pre>
      <Pre>Lng: {props.pos ? convertLngDMS(props.pos.longitude) : "-"}</Pre>
      <Pre>
        Accuracy: {props.pos ? formatLocationAcc(props.pos.accuracy) : "-"}
      </Pre>
      <Pre>Time: {props.ts ? formatLocationTs(props.ts) : "-"}</Pre>
    </View>
  );
}

export function DistanceView(props: {
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
      err = (props.pos1.accuracy + props.pos2.accuracy) / 2;
    } else if (props.pos1 !== null) {
      err = props.pos1.accuracy;
    } else if (props.pos2 !== null) {
      err = props.pos2.accuracy;
    }
    txt = formatDistance(d, err);
  }

  return (
    <View>
      <H4>Distance: {txt}</H4>
    </View>
  );
}

interface NumberSelectionProps {
  num: number;
  nums: number[];
  onSelect: (d: number) => void;
  disabled?: boolean;
}

export function NumberSelection(props: NumberSelectionProps): JSX.Element {
  return (
    <Picker
      selectedValue={props.num}
      onValueChange={(d) => props.onSelect(d)}
      enabled={props.disabled !== undefined ? !props.disabled : true}
      style={styles.numberSelection}
    >
      {props.nums.map((d) => (
        <Picker.Item label={`${d} m`} value={d} key={d} />
      ))}
    </Picker>
  );
}

const styles = StyleSheet.create({
  darkTxt: {
    color: "#fff",
  },
  darkDisabledTxt: {
    color: "#9d9d9d",
  },
  lightTxt: {
    color: "#000000",
  },
  lightDisabledTxt: {
    color: "#898989",
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
  },
  h4: {
    fontSize: 15,
    fontWeight: "bold",
  },
  pre: {
    fontFamily: "monospace",
  },
  errorMsg: {
    color: "red",
  },
  numberSelection: {
    margin: 10,
  },
  button: {
    padding: 10,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    elevation: 3,
  },
  darkDisabledButton: {
    backgroundColor: "#484848",
  },
  lightDisabledButton: {
    backgroundColor: "#e9e9e9",
  },
  positionViewContainer: {
    maxWidth: 200,
  },
});
