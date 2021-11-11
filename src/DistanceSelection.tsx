import React from "react";
import { StyleSheet, Pressable, View, Modal, FlatList } from "react-native";
import { ThemedSelect } from "./ScrollSelectionPicker";
import { Txt, Btn } from "./components";
import { useTheme } from "./hooks";

interface DistanceSelectionProps {
  std?: number;
  radius: number;
  onSelect: (d: number) => void;
  disabled?: boolean;
}

const RADII = [
  10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150,
];
const RAD_ITEMS = RADII.map((d) => ({ value: d, label: `${d} m` }));

export default function DistanceSelection(
  props: DistanceSelectionProps
): JSX.Element {
  const [isVisible, setIsVisible] = React.useState(false);
  const { bkgCol } = useTheme();
  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible((d) => !d)}
      >
        <View style={[styles.modalBkg, bkgCol]}>
          <Txt size={20} bold={true}>
            How big is the radius?
          </Txt>
          <View style={styles.section}>
            <Txt bold={true} size={15}>
              chain length + 2 * accuracy
            </Txt>
            <Txt>
              Consider the theoretical swinging circle and the GPS accuracy.
              With a single anchor the theoretical swinging circle radius is
              slightly less the chain/rode you payed out. To avoid false alarm
              add twice the GPS accuracy.
            </Txt>
          </View>
          <Txt bold={true} size={15}>
            Accuracy: {props.std ? `${Math.round(props.std)} m` : "-"}
          </Txt>
          <ThemedSelect
            items={RAD_ITEMS}
            onScroll={(d) => props.onSelect(d)}
            scrollTo={RADII.indexOf(props.radius)}
          />
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
