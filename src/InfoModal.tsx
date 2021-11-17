import React from "react";
import { StyleSheet, View, Modal, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Txt, Btn } from "./components";
import { useTheme } from "./hooks";

function Anchor(props: { href: string; title: string }): JSX.Element {
  return (
    <Pressable
      style={styles.anchor}
      onPress={() => Linking.openURL(props.href)}
    >
      <Txt style={{ color: "blue" }}>{props.title}</Txt>
    </Pressable>
  );
}

export default function InfoModal(): JSX.Element {
  const [isVisible, setIsVisible] = React.useState(false);
  const { bkgCol, darkMode } = useTheme();

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible((d) => !d)}
      >
        <View style={[styles.modalBkg, bkgCol]}>
          <View style={styles.section}>
            <Txt size={20} bold={true}>
              Reliability
            </Txt>
          </View>
          <View style={styles.section}>
            <Txt>
              The active anchor watch shows a notification on your screen. It
              stays active in the background even if you lock your phone.
              However, many android devices suspend inactive apps.
            </Txt>
          </View>
          <View style={styles.section}>
            <Txt>
              The <Txt bold={true}>Battery Saver</Txt> is often the reason that
              apps are suspended after 10 minutes of inactivity. You need to
              tell the Battrery Saver to ignore this app. This website explains
              how to do that on different devices:{" "}
              <Anchor
                title="dontkillmyapp.com"
                href="https://dontkillmyapp.com/"
              />
              .
            </Txt>
          </View>
          <View style={styles.section}>
            <Txt>
              I recommend that you <Txt bold={true}>test this app</Txt>{" "}
              yourself. Activate the anchor watch, lock and don't use your phone
              for at least 30 minutes. Then, start leaving the area and see if
              it starts to ring.
            </Txt>
          </View>
          <View style={styles.section}>
            <Btn
              onPress={() => setIsVisible(false)}
              label="Close"
              style={styles.closeBtn}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.infoBtn}>
        <FontAwesome.Button
          size={40}
          name="info-circle"
          color={darkMode ? "white" : "black"}
          backgroundColor="transparent"
          onPress={() => setIsVisible(true)}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  modalBkg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  section: {
    marginVertical: 10,
    alignItems: "center",
  },
  closeBtn: {
    borderColor: "gray",
    borderStyle: "solid",
    borderWidth: 2,
  },
  infoBtn: {
    marginVertical: 30,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  anchor: {
    alignItems: "center",
  },
});
