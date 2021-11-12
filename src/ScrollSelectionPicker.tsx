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

interface ThemedSelectProps {
  items: ItemType[];
  onScroll: (d: number) => void;
  scrollTo?: number;
}

export function ThemedSelect(props: ThemedSelectProps): JSX.Element {
  const { darkMode } = useTheme();

  function getTopGrad(dark: boolean) {
    if (dark) {
      return [
        "#FF000000", // rgba( 0, 0, 0, 1 )
        "#E6000000", // rgba( 0, 0, 0, 0.9 )
        "#B3000000", // rgba( 0, 0, 0, 0.7 )
        "#80000000", // rgba( 0, 0, 0, 0.5 )
      ];
    }
    return [
      "#FFffffff", // rgba( 255, 255, 255, 1 )
      "#E6ffffff", // rgba( 255, 255, 255, 0.9 )
      "#B3ffffff", // rgba( 255, 255, 255, 0.7 )
      "#80ffffff", // rgba( 255, 255, 255, 0.5 )
    ];
  }

  function getBotGrad(dark: boolean) {
    if (dark) {
      return [
        "#80000000", // rgba( 0, 0, 0, 0.5 )
        "#B3000000", // rgba( 0, 0, 0, 0.7 )
        "#E6000000", // rgba( 0, 0, 0, 0.9 )
        "#FF000000", // rgba( 0, 0, 0, 1 )
      ];
    }
    return [
      "#80ffffff", // rgba( 255, 255, 255, 0.5 )
      "#B3ffffff", // rgba( 255, 255, 255, 0.7 )
      "#E6ffffff", // rgba( 255, 255, 255, 0.9 )
      "#FFffffff", // rgba( 255, 255, 255, 1 )
    ];
  }

  return (
    <ScrollSelectionPicker
      items={props.items}
      onScroll={(d) => props.onScroll(d.item.value)}
      width={200}
      height={200}
      scrollTo={props.scrollTo === undefined ? 2 : props.scrollTo}
      transparentRows={3}
      itemCol={darkMode ? "white" : "black"}
      borderCol="gray"
      topGradientColors={getTopGrad(darkMode)}
      bottomGradientColors={getBotGrad(darkMode)}
    />
  );
}
