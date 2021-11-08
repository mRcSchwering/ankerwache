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

interface subscribeLocationUpdatesProps {
  locationSubscription: (location: LocationType) => void;
  errorMsgSubscription: (msg: string | null) => void;
}

export async function subscribeLocationUpdates({
  locationSubscription,
  errorMsgSubscription,
}: subscribeLocationUpdatesProps) {
  let resp: Location.LocationPermissionResponse | null = null;
  try {
    resp = await Location.requestForegroundPermissionsAsync();
  } catch (err) {
    // @ts-ignore
    errorMsgSubscription(err.message);
    return;
  }
  if (!resp.granted) {
    errorMsgSubscription("Persmission to get current location was denied");
    return;
  }

  locationService.subscribe(locationSubscription);
  const opts = {
    accuracy: Location.Accuracy.Highest,
    timeInterval: 5000,
    foregroundService: {
      notificationTitle: "Watching location...",
      notificationBody: "Regularly requests current location to check drift.",
      notificationColor: "#b2b2b2",
    },
    pausesUpdatesAutomatically: false,
    distanceInterval: 1,
  };
  Location.startLocationUpdatesAsync(ANCHOR_WATCH_TASK, opts);
}

export async function unsubscribeLocationUpdates(
  locationSubscription: (location: LocationType) => void
) {
  locationService.unsubscribe(locationSubscription);
  Location.stopLocationUpdatesAsync(ANCHOR_WATCH_TASK);
}
