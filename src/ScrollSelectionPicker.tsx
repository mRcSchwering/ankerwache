import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "./hooks";

interface ItemType {
  value: number;
  label: string;
}

interface OnScrollType {
  index: number;
  item: ItemType;
}

interface ScrollSelectionPickerProps {
  items: ItemType[];
  onScroll: ({ index, item }: OnScrollType) => void;
  scrollTo?: number;
  height: number;
  width: number;
  itemCol: string;
  borderCol: string;
  topGradientColors: string[];
  bottomGradientColors: string[];
  transparentRows?: number;
}

interface PickerItemProps {
  item: ItemType;
  index: number;
  height: number;
  color: string;
}

function PickerItem(props: PickerItemProps): JSX.Element {
  const col = { color: props.color };
  const height = { height: props.height };
  return (
    <View key={props.index} style={[styles.listItem, height]}>
      <Text style={col}>{props.item.label}</Text>
    </View>
  );
}

function dummyFact(n: number): ItemType[] {
  return Array(n).fill({ value: -1, label: "" });
}

export default function ScrollSelectionPicker(
  props: ScrollSelectionPickerProps
): JSX.Element {
  const scroll = React.useRef<ScrollView>(null);
  const [idx, setIdx] = React.useState(0);

  const n = props.transparentRows || 3;
  const itemHeight = props.height / (n * 2 + 1);
  const gradHeight = n * itemHeight;
  const extItems = [...dummyFact(n), ...props.items, ...dummyFact(n)];

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const tmpIdx = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
    if (idx !== tmpIdx && tmpIdx >= 0 && tmpIdx < props.items.length) {
      setIdx(tmpIdx);
      props.onScroll({ index: tmpIdx, item: props.items[tmpIdx] });
    }
  }

  React.useEffect(() => {
    if (props.scrollTo) {
      scroll.current?.scrollTo({
        y: props.scrollTo * itemHeight,
        animated: true,
      });
    }
  }, []);

  return (
    <View style={{ height: props.height, width: props.width }}>
      <ScrollView
        ref={scroll}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onScroll={(event) => onScroll(event)}
        snapToInterval={itemHeight}
        snapToAlignment="center"
        decelerationRate="fast"
        scrollEventThrottle={0}
      >
        {extItems.map((d, i) => (
          <PickerItem
            key={i}
            item={d}
            index={i}
            height={itemHeight}
            color={props.itemCol}
          />
        ))}
      </ScrollView>
      <View
        pointerEvents="none"
        style={[
          styles.gradientWrapper,
          styles.bottomBorder,
          { borderColor: props.borderCol },
        ]}
      >
        <LinearGradient
          colors={props.topGradientColors}
          style={[styles.pickerGradient, { height: gradHeight }]}
        />
      </View>
      <View
        pointerEvents="none"
        style={[
          styles.gradientWrapper,
          styles.topBorder,
          { borderColor: props.borderCol },
        ]}
      >
        <LinearGradient
          colors={props.bottomGradientColors}
          style={[styles.pickerGradient, { height: gradHeight }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  gradientWrapper: {
    position: "absolute",
    width: "100%",
  },
  bottomBorder: {
    top: 0,
    borderBottomWidth: 1,
  },
  topBorder: {
    bottom: 0,
    borderTopWidth: 1,
  },
  pickerGradient: {
    width: "100%",
  },
});

const LIGHT_TOP_GRAD = [
  "rgba( 255, 255, 255, 1 )",
  "rgba( 255, 255, 255, 0.9 )",
  "rgba( 255, 255, 255, 0.7 )",
  "rgba( 255, 255, 255, 0.5 )",
];

const LIGHT_BOT_GRAD = [
  "rgba( 255, 255, 255, 0.5 )",
  "rgba( 255, 255, 255, 0.7 )",
  "rgba( 255, 255, 255, 0.9 )",
  "rgba( 255, 255, 255, 1 )",
];

const DARK_TOP_GRAD = [
  "rgba( 0, 0, 0, 1 )",
  "rgba( 0, 0, 0, 0.9 )",
  "rgba( 0, 0, 0, 0.7 )",
  "rgba( 0, 0, 0, 0.5 )",
];

const DARK_BOT_GRAD = [
  "rgba( 0, 0, 0, 0.5 )",
  "rgba( 0, 0, 0, 0.7 )",
  "rgba( 0, 0, 0, 0.9 )",
  "rgba( 0, 0, 0, 1 )",
];

interface ThemedSelectProps {
  items: ItemType[];
  onScroll: (d: number) => void;
}

export function ThemedSelect(props: ThemedSelectProps): JSX.Element {
  const { darkMode } = useTheme();

  return (
    <ScrollSelectionPicker
      items={props.items}
      onScroll={(d) => props.onScroll(d.item.value)}
      width={200}
      height={200}
      scrollTo={2}
      transparentRows={3}
      itemCol={darkMode ? "white" : "black"}
      borderCol="gray"
      topGradientColors={darkMode ? DARK_TOP_GRAD : LIGHT_TOP_GRAD}
      bottomGradientColors={darkMode ? DARK_BOT_GRAD : LIGHT_BOT_GRAD}
    />
  );
}
