import React from "react";
import { StyleSheet, View, Modal } from "react-native";
import { ThemedSelect } from "./ScrollSelectionPicker";
import { Txt, Btn } from "./components";
import { RADII, ACC_THRESH } from "./constants";
import { useTheme } from "./hooks";

interface RadiuseSelectionProps {
  std?: number;
  radius: number;
  onSelect: (d: number) => void;
  disabled?: boolean;
}

const RAD_ITEMS = RADII.map((d) => ({ value: d, label: `${d} m` }));

export default function RadiusSelection(
  props: RadiuseSelectionProps
): JSX.Element {
  const [isVisible, setIsVisible] = React.useState(false);
  const { bkgCol } = useTheme();

  const normalText = (
    <Txt>
      Consider the swinging circle and the GPS accuracy. With a single anchor
      the swinging circle radius is slightly less than the chain/rode you payed
      out. To avoid false alarms add the GPS accuracy.
    </Txt>
  );

  const accText = (
    <Txt err>
      Your GPS accuracy is very bad ({`> ${ACC_THRESH}`} m). This anchor watch
      is now prone to false alarms and it might not detect your anchor dragging.
    </Txt>
  );

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
              How big is the watch radius?
            </Txt>
          </View>
          <View style={styles.section}>
            <Txt bold={true} size={15}>
              chain length + GPS accuracy
            </Txt>
          </View>
          <View style={styles.section}>
            {!!props.std && props.std > ACC_THRESH ? accText : normalText}
          </View>
          <ThemedSelect items={RAD_ITEMS} onScroll={props.onSelect} />
          <View style={styles.section}>
            <Txt bold={true} size={15}>
              GPS accuracy: {props.std ? `${Math.round(props.std)} m` : "-"}
            </Txt>
          </View>
          <View style={styles.section}>
            <Btn
              disabled={props.disabled}
              onPress={() => setIsVisible(false)}
              label="Select radius"
              style={styles.selectBtn}
            />
          </View>
        </View>
      </Modal>
      <Btn
        disabled={props.disabled}
        onPress={() => setIsVisible(true)}
        label={`${props.radius} m`}
        style={styles.selectBtn}
      />
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
    marginVertical: 15,
    alignItems: "center",
  },
  selectBtn: {
    borderColor: "gray",
    borderStyle: "solid",
    borderWidth: 2,
  },
  selectOpt: {
    borderRadius: 4,
    margin: 5,
    padding: 10,
  },
});
