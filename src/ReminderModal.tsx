import React from "react";
import { StyleSheet, View, Modal, ScrollView, Dimensions } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Txt, Btn } from "./components";
import { useTheme } from "./hooks";

export default function ReminderModal(): JSX.Element {
  const [isVisible, setIsVisible] = React.useState(true);
  const { bkgCol, darkMode, blueBkg } = useTheme();
  const pad = { paddingVertical: Dimensions.get("window").height * 0.3 };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible((d) => !d)}
      >
        <View style={[styles.modalBkg, bkgCol, pad]}>
          <ScrollView>
            <View style={styles.section}>
              <Txt size={20}>
                Make sure battery optimizations don't kill this app
              </Txt>
            </View>
            <View style={styles.section}>
              <Txt size={20}>Turn audio up to hear the alarm</Txt>
            </View>
            <View style={styles.section}>
              <Txt size={20}>
                Click{" "}
                <FontAwesome
                  size={20}
                  name="info-circle"
                  color={darkMode ? "white" : "black"}
                  backgroundColor="transparent"
                />{" "}
                for more info
              </Txt>
            </View>
            <View style={[styles.section, { marginTop: 20 }]}>
              <Btn
                onPress={() => setIsVisible(false)}
                label="Close"
                style={blueBkg}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalBkg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    marginVertical: 10,
    alignItems: "center",
  },
});
