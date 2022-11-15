import React from "react";
import { StyleSheet, View, Modal } from "react-native";
import { Txt, Btn } from "./components";
import { ThemedSelect } from "./ScrollSelectionPicker";
import { formatHeading, getCoordsFromVector } from "./util";
import { useTheme, useCurrentHeading } from "./hooks";
import { DISTANCES } from "./constants";

const DIST_ITEMS = DISTANCES.map((d) => ({ value: d, label: `${d} m` }));

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
  const [dist, setDist] = React.useState(0);
  const head = useCurrentHeading(isVisible);
  const { bkgCol, blueBkg } = useTheme();

  function handleSet() {
    if (head && props.loc) {
      const res = getCoordsFromVector(
        head.tru,
        dist / 1000,
        props.loc.lat,
        props.loc.lng
      );
      props.onSetAnchor({ ...res, ts: props.loc.ts, acc: props.loc.acc });
    }
    setIsVisible(false);
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
            <Txt size={15} bold={true}>
              How far away is the anchor?
            </Txt>
            <Txt>
              This is probably slightly less than the length of chain or rode
              you payed out. Select one to "set" anchor position.
            </Txt>
          </View>
          <ThemedSelect items={DIST_ITEMS} onScroll={(d) => setDist(d)} />
          <View style={styles.section}>
            <Btn onPress={handleSet} label="Set Anchor" style={blueBkg} />
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
    justifyContent: "center",
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
    marginTop: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
});
