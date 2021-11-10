import React from "react";
import { StyleSheet, Pressable, View, Modal, FlatList } from "react-native";
import { Txt, Btn } from "./components";
import { formatHeading, getCoordsFromVector } from "./util";
import { useDarkMode, useCurrentHeading } from "./hooks";

const DISTANCES = [0, 5, 10, 15, 20, 25, 30, 35, 40];

interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

interface AnchorSettingViewProps {
  loc?: LocationType;
  onSetAnchor: (loc: LocationType | undefined) => void;
}

export default function AnchorSettingView(
  props: AnchorSettingViewProps
): JSX.Element {
  const [isVisible, setIsVisible] = React.useState(false);
  const head = useCurrentHeading(isVisible);
  const { bkgCol, blueBkg } = useDarkMode();

  function handleSelect(d: number) {
    if (head && props.loc) {
      const res = getCoordsFromVector(
        head.tru,
        d / 1000,
        props.loc.lat,
        props.loc.lng
      );
      props.onSetAnchor({ ...res, ts: props.loc.ts, acc: props.loc.acc });
    }
    setIsVisible(false);
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
        transparent={false}
        visible={isVisible}
        onRequestClose={() => setIsVisible((d) => !d)}
      >
        <View style={[styles.modalBkg, bkgCol]}>
          <Txt size={20} bold={true}>
            Where is your anchor?
          </Txt>
          <View style={styles.section}>
            <Txt size={15} bold={true}>
              In which direction is your anchor?
            </Txt>
            <Txt>
              Point your cellphone into that direction. Check the headings
              below. Are they correct? (Some smartphones have a high deviation)
            </Txt>
          </View>
          <View style={styles.section}>
            <Txt size={20} bold={true} pre={true}>
              {formatHeading(head?.tru)} (T)
            </Txt>
          </View>
          <View style={styles.section}>
            <Txt size={20} bold={true}>
              How far away is the anchor?
            </Txt>
            <Txt>
              Remember the water depth and catenary. We just need the horizontal
              distance. So, this should be less than the amount of chain/rode
              you payed out. Select one to "set" anchor position.
            </Txt>
          </View>
          <View style={styles.section}>
            <FlatList
              data={DISTANCES}
              renderItem={renderItem}
              keyExtractor={(d) => d.toString()}
              numColumns={3}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.btnsContainer}>
        <Btn
          onPress={() => setIsVisible(true)}
          disabled={props.loc === undefined}
          label="Set"
          style={blueBkg}
        />
        <Btn
          onPress={() => props.onSetAnchor(undefined)}
          disabled={props.loc === undefined}
          label="Retrieve"
          style={blueBkg}
        />
      </View>
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
  selectOpt: {
    width: 50,
    height: 50,
    borderRadius: 4,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnsContainer: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
