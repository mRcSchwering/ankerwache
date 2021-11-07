import React from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
  useColorScheme,
} from "react-native";

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
});
