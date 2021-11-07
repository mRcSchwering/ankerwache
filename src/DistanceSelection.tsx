import React from "react";
import {
  StyleSheet,
  Pressable,
  View,
  Modal,
  FlatList,
  useColorScheme,
} from "react-native";
import { BlurView } from "expo-blur";
import { Txt } from "./components";

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
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme !== "light";

  const themedSelOpt = isDarkMode
    ? styles.darkSelectOption
    : styles.lightSelectOption;

  function handleSelect(d: number) {
    props.onSelect(d);
    setIsVisible((d) => !d);
  }

  function renderItem({ item }: { item: number }): JSX.Element {
    return (
      <Pressable
        onPress={() => handleSelect(item)}
        style={[styles.selectOption, themedSelOpt]}
      >
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
        <BlurView
          intensity={70}
          style={styles.modalBkg}
          tint={isDarkMode ? "light" : "dark"}
        >
          <View style={styles.flatListContainer}>
            <FlatList data={props.nums} renderItem={renderItem} />
          </View>
        </BlurView>
      </Modal>
      <Pressable
        disabled={props.disabled}
        onPress={() => setIsVisible((d) => !d)}
        style={styles.selectButton}
      >
        <Txt disabled={props.disabled}>{`${props.num} m`}</Txt>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  modalBkg: {
    flex: 1,
    justifyContent: "center",
  },
  flatListContainer: {
    alignItems: "center",
  },
  selectButton: {
    borderRadius: 4,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "gray",
    margin: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectOption: {
    borderRadius: 4,
    margin: 5,
    padding: 10,
  },
  lightSelectOption: {
    backgroundColor: "white",
  },
  darkSelectOption: {
    backgroundColor: "black",
  },
});
