import React from "react";
import { Text, Button } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const LOCATION_TASK_NAME = "anchorwatch-geofencing-location-task";

async function requestPermissions(region: AnchorRegion) {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === "granted") {
    await Location.startGeofencingAsync(LOCATION_TASK_NAME, [region]);
  }
}

interface AnchorRegion {
  latitude: number;
  longitude: number;
  radius: number;
}

export default function StartAnchorWatch(props: {
  region: AnchorRegion;
}): JSX.Element {
  return (
    <Button onPress={() => requestPermissions(props.region)} title="start" />
  );
}

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }: any) => {
  const eventType: Location.LocationGeofencingEventType = data.eventType;
  const region: Location.LocationRegion = data.region;

  if (error) {
    console.log(error.message);
    return;
  }

  if (eventType === Location.LocationGeofencingEventType.Enter) {
    console.log("You've entered region:", region);
  } else if (eventType === Location.LocationGeofencingEventType.Exit) {
    console.log("You've left region:", region);
  }
});
