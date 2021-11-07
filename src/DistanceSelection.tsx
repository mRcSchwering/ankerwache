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
import { Txt, Btn } from "./components";

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

  const themedSelBtn = isDarkMode
    ? styles.darkSelectBtn
    : styles.lightSelectBtn;
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
            <Txt style={styles.infoText}>
              Take the length of your chain plus the distance error
            </Txt>
            <FlatList
              data={props.nums}
              renderItem={renderItem}
              keyExtractor={(d) => d.toString()}
            />
          </View>
        </BlurView>
      </Modal>
      <Btn
        disabled={props.disabled}
        onPress={() => setIsVisible((d) => !d)}
        label={`${props.num} m`}
        style={themedSelBtn}
      />
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
  infoText: {
    maxWidth: 200,
    textAlign: "center",
    marginVertical: 20,
  },
  lightSelectBtn: {
    borderColor: "gray",
    borderStyle: "solid",
    borderWidth: 2,
  },
  darkSelectBtn: {
    borderColor: "gray",
    borderStyle: "solid",
    borderWidth: 2,
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
