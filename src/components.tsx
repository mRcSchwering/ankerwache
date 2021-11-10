import React from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useDarkMode } from "./hooks";

export function Txt(props: {
  children?: React.ReactNode;
  disabled?: boolean;
  err?: boolean;
  bold?: boolean;
  pre?: boolean;
  size?: number;
  style?: StyleProp<TextStyle>;
}): JSX.Element {
  const { fontCol, disabledFont } = useDarkMode();
  return (
    <Text
      style={[
        fontCol,
        props.style,
        props.err && { color: "red" },
        props.bold && { fontWeight: "bold" },
        props.pre && { fontFamily: "monospace" },
        props.size ? { fontSize: props.size } : undefined,
        props.disabled && disabledFont,
      ]}
    >
      {props.children}
    </Text>
  );
}

interface BtnProps {
  onPress?: () => void;
  disabled?: boolean;
  label: string;
  style?: StyleProp<ViewStyle>;
}

export function Btn(props: BtnProps): JSX.Element {
  const darkMode = useDarkMode();

  const isDisabled = props.disabled !== undefined ? props.disabled : false;
  let disabledTheme = {};
  if (isDisabled) {
    disabledTheme = darkMode
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

const styles = StyleSheet.create({
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
});
