import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useTheme } from "./hooks";

interface ItemType {
  value: number;
  label: string;
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

function StepGradient(props: {
  height: number;
  layerCol: string;
  top: boolean;
}): JSX.Element {
  const n = 20;
  const just = props.top ? "flex-start" : "flex-end";

  let div = <></>;
  for (let i = 1; i <= n; i++) {
    div = (
      <View
        style={[
          styles.gradient,
          { justifyContent: just },
          { backgroundColor: props.layerCol },
          { height: (props.height * i) / n },
        ]}
      >
        {div}
      </View>
    );
  }
  return div;
}

const BORDER = 1;

function getOffsets(n: number, h: number): number[] {
  const offsets = [];
  for (let i = 0; i < n; i++) {
    offsets.push(BORDER + i * h);
  }
  return offsets;
}

interface ScrollSelectionPickerProps {
  items: ItemType[];
  onScroll: ({}: { d: ItemType; i: number }) => void;
  scrollTo?: number;
  itemCol: string;
  borderCol: string;
  backgroundCol: string;
  gradientCol: string;
  nTransparentRows?: number;
  width: number;
  height: number;
}

/**
 * Normal gradients and even images (png) will be converted to
 * some bright color whenever the dark mode is switched on (only visible on aab)
 * The background-color style does not seem to be affected by this.
 * That's why I'm using this to simulate a gradient.
 * See: https://stackoverflow.com/questions/69934764/standalone-apk-different-from-playstore-aab-lineargradient-uses-wrong-colors/69955769#69955769
 */
export default function ScrollSelectionPicker(
  props: ScrollSelectionPickerProps
): JSX.Element {
  const scroll = React.useRef<ScrollView>(null);
  const [idx, setIdx] = React.useState(props.scrollTo || 0);

  const n = props.nTransparentRows || 3;
  const itemHeight = (props.height - 2 * BORDER) / (n * 2 + 1);
  const gradHeight = n * itemHeight;
  const extItems = [...dummyFact(n), ...props.items, ...dummyFact(n)];
  const initScroll = props.scrollTo ? BORDER + itemHeight * props.scrollTo : 0;

  function onScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const tmpIdx = Math.round(event.nativeEvent.contentOffset.y / itemHeight);
    if (idx !== tmpIdx && tmpIdx >= 0 && tmpIdx < props.items.length) {
      setIdx(tmpIdx);
      props.onScroll({ i: tmpIdx, d: props.items[tmpIdx] });
    }
  }

  return (
    <View style={{ height: props.height, width: props.width }}>
      <View style={{ borderColor: props.backgroundCol, borderWidth: BORDER }}>
        <ScrollView
          ref={scroll}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          snapToOffsets={getOffsets(extItems.length, itemHeight)}
          contentOffset={{ y: initScroll, x: 0 }}
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
      </View>
      <View
        pointerEvents="none"
        style={[
          styles.gradientWrapper,
          styles.gradientWrapperTop,
          { borderColor: props.borderCol },
          { height: gradHeight },
        ]}
      >
        <StepGradient
          height={gradHeight}
          top={true}
          layerCol={props.gradientCol}
        />
      </View>
      <View
        pointerEvents="none"
        style={[
          styles.gradientWrapper,
          styles.gradientWrapperBottom,
          { borderColor: props.borderCol },
          { height: gradHeight },
        ]}
      >
        <StepGradient
          height={gradHeight}
          top={false}
          layerCol={props.gradientCol}
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
  gradientWrapperTop: {
    top: 0,
    borderBottomWidth: 1,
  },
  gradientWrapperBottom: {
    bottom: 0,
    borderTopWidth: 1,
  },
  gradient: {
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
  return (
    <ScrollSelectionPicker
      items={props.items}
      onScroll={(d) => props.onScroll(d.d.value)}
      scrollTo={props.scrollTo === undefined ? 2 : props.scrollTo}
      itemCol={darkMode ? "white" : "black"}
      borderCol="gray"
      backgroundCol={darkMode ? "black" : "white"}
      gradientCol={darkMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}
      width={200}
      height={200}
    />
  );
}
