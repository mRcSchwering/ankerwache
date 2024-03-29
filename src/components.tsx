/**
 * Collection of small generic components
 */
import React from "react";
import {
  Text,
  StyleSheet,
  Pressable,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import * as Linking from "expo-linking";
import { useTheme } from "./hooks";

export function Txt(props: {
  children?: React.ReactNode;
  disabled?: boolean;
  err?: boolean;
  bold?: boolean;
  pre?: boolean;
  size?: number;
  align?: "auto" | "left" | "right" | "center" | "justify";
  style?: StyleProp<TextStyle>;
}): JSX.Element {
  const { fontCol, disabledFont } = useTheme();
  return (
    <Text
      style={[
        styles.txtDefault,
        fontCol,
        props.style,
        props.err && { color: "red" },
        props.bold && { fontWeight: "bold" },
        props.pre && { fontFamily: "monospace" },
        props.size ? { fontSize: props.size } : undefined,
        props.align ? { textAlign: props.align } : undefined,
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
  const { disabledBkg } = useTheme();
  return (
    <Pressable
      onPress={props.onPress}
      disabled={props.disabled}
      style={[styles.button, props.style, props.disabled && disabledBkg]}
    >
      <Txt disabled={props.disabled}>{props.label}</Txt>
    </Pressable>
  );
}

export function Anchor(props: { href: string; title: string }): JSX.Element {
  return (
    <Pressable
      style={styles.anchor}
      onPress={() => Linking.openURL(props.href)}
    >
      <Txt style={{ color: "blue" }}>{props.title}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  txtDefault: {
    textAlign: "center",
    maxWidth: 250,
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
  },
  anchor: {
    alignItems: "center",
  },
});
