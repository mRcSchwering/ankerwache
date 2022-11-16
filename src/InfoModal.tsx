import React from "react";
import { StyleSheet, View, Modal, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Txt, Btn, Anchor } from "./components";
import { useTheme } from "./hooks";

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
          <ScrollView>
            <View style={styles.section}>
              <Txt size={20} bold={true}>
                Reliability
              </Txt>
            </View>
            <View style={styles.section}>
              <Txt>
                The active anchor watch shows a notification on your screen.
                Don't close the app, just move it to the background. It stays
                active in the background even if you lock your phone. However,
                many android devices suspend inactive apps after a while.
              </Txt>
            </View>
            <View style={styles.section}>
              <Txt>
                The <Txt bold={true}>Battery Saver</Txt> is often the reason
                that apps are suspended after 10 minutes of inactivity. You need
                to tell the Battrery Saver to ignore this app. This website
                explains how to do that on different devices:{" "}
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
                yourself. Activate the anchor watch, lock and don't use your
                phone for at least 30 minutes. Then, start leaving the area and
                see if it starts to ring.
              </Txt>
            </View>
            <View style={styles.section}>
              <Txt size={20} bold={true}>
                True/False Alarms
              </Txt>
            </View>
            <View style={styles.section}>
              <Txt>
                GPS readings are not perfectly accurate. They jump back and
                forth quite a lot. Always include the GPS accuracy when setting
                the watch radius. Use the length of your chain/rode{" "}
                <Txt bold={true}>plus GPS accuracy</Txt> to avoid false alarms.
              </Txt>
            </View>
            <View style={styles.section}>
              <Txt>
                The app actually calculates an exponential moving average (EMA)
                of GPS readings and only starts the alarm if this EMA is out of
                range for many consecutive readings. This insures that even with
                bad GPS accuracy, you shouldn't get false alarms but still be
                able to detect a dragging anchor. However, with GPS{" "}
                <Txt bold={true}>accuracy higher than 70m</Txt> the app becomes
                useless.
              </Txt>
            </View>
            <View style={styles.section}>
              <Txt size={20} bold={true}>
                Donate
              </Txt>
            </View>
            <View style={styles.section}>
              <Txt>
                All my apps are free, I never use ads, or sell data to third
                parties. If you want to support me somehow, you can donate with
                this link on{" "}
                <Anchor
                  title="buymeacoffee.com"
                  href="https://www.buymeacoffee.com/mRcSchwering"
                />
                . Thanks in advance.
              </Txt>
            </View>
            <View style={styles.section}>
              <Btn
                onPress={() => setIsVisible(false)}
                label="Close"
                style={styles.closeBtn}
              />
            </View>
          </ScrollView>
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
