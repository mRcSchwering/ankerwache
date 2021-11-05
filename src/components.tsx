import React from "react";
import { Text, StyleSheet } from "react-native";

export function H1(props: { children?: React.ReactNode }): JSX.Element {
  return <Text style={styles.h1}>{props.children}</Text>;
}

export function H2(props: { children?: React.ReactNode }): JSX.Element {
  return <Text style={styles.h2}>{props.children}</Text>;
}

export function Txt(props: { children?: React.ReactNode }): JSX.Element {
  return <Text>{props.children}</Text>;
}

export function ErrTxt(props: { children?: React.ReactNode }): JSX.Element {
  return <Text style={styles.errorMsg}>{props.children}</Text>;
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 30,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 20,
    fontWeight: "bold",
  },
  errorMsg: {
    color: "red",
  },
});
