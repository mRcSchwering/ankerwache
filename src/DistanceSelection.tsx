import React from "react";
import { StyleSheet, Pressable, View, Modal, FlatList } from "react-native";
import { Txt, Btn } from "./components";
import { useTheme } from "./hooks";

interface DistanceSelectionProps {
  num: number;
  nums: number[];
  onSelect: (d: number) => void;
  disabled?: boolean;
}

export default function DistanceSelection(
  props: DistanceSelectionProps
): JSX.Element {
  const [isVisible, setIsVisible] = React.useState(false);
  const { bkgCol } = useTheme();

  function handleSelect(d: number) {
    props.onSelect(d);
    setIsVisible((d) => !d);
  }

  function renderItem({ item }: { item: number }): JSX.Element {
    return (
      <Pressable onPress={() => handleSelect(item)} style={styles.selectOpt}>
        <Txt>{`${item} m`}</Txt>
      </Pressable>
    );
  }

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
            <Txt bold={true}>
              Take the length of your chain plus the distance error
            </Txt>
          </View>
          <View style={styles.section}>
            <FlatList
              data={props.nums}
              renderItem={renderItem}
              keyExtractor={(d) => d.toString()}
              numColumns={3}
            />
          </View>
        </View>
      </Modal>
      <Btn
        disabled={props.disabled}
        onPress={() => setIsVisible((d) => !d)}
        label={`${props.num} m`}
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
