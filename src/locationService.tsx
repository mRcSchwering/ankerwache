import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { ANCHOR_WATCH_TASK } from "./hooks";

interface AnchorWatchTaskExecutorBody {
  data: any;
  error: TaskManager.TaskManagerError | null;
}

TaskManager.defineTask(
  ANCHOR_WATCH_TASK,
  ({ data, error }: AnchorWatchTaskExecutorBody) => {
    const location: Location.LocationObject = data.locations[0];

    if (error) {
      console.log("Error in ANCHOR_WATCH_TASK", error.message);
      return;
    }

    const { latitude, longitude, accuracy } = location.coords;
    locationService.setLocation({
      lat: latitude,
      lng: longitude,
      acc: accuracy,
      ts: location.timestamp,
    });
  }
);

export interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

type SubscriptionType = (location: LocationType) => void;

interface LocationServiceType {
  subscribe: (sub: SubscriptionType) => void;
  setLocation: (location: LocationType) => void;
  unsubscribe: (sub: SubscriptionType) => void;
}

function LocationService(): LocationServiceType {
  let subscribers: SubscriptionType[] = [];
  let thisLocation: LocationType = {
    lat: 0,
    lng: 0,
    ts: null,
    acc: null,
  };

  return {
    subscribe: (sub: SubscriptionType) => subscribers.push(sub),
    setLocation: (location: LocationType) => {
      thisLocation = location; // TODO: needed?
      subscribers.forEach((sub) => sub(location));
    },
    unsubscribe: (sub: SubscriptionType) => {
      subscribers = subscribers.filter((_sub) => _sub !== sub);
    },
  };
}

export const locationService = LocationService();

export async function subscribeLocationUpdates(
  locationSubscription: (location: LocationType) => void
) {
  locationService.subscribe(locationSubscription);
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status === "granted") {
    const opts = {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      foregroundService: {
        notificationTitle: "Watching anchor...",
        notificationBody:
          "Regularly checks current location. Raises alarm if too far away.",
        notificationColor: "#b2b2b2",
      },
      pausesUpdatesAutomatically: false,
      distanceInterval: 1,
    };
    await Location.startLocationUpdatesAsync(ANCHOR_WATCH_TASK, opts);
  }
}

export async function unsubscribeLocationUpdates(
  locationSubscription: (location: LocationType) => void
) {
  locationService.unsubscribe(locationSubscription);
  await Location.stopLocationUpdatesAsync(ANCHOR_WATCH_TASK);
}
