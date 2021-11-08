import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const WATCH_LOCATION_TASK = "watch-location-task";

interface AnchorWatchTaskExecutorBody {
  data: any;
  error: TaskManager.TaskManagerError | null;
}

TaskManager.defineTask(
  WATCH_LOCATION_TASK,
  ({ data, error }: AnchorWatchTaskExecutorBody) => {
    const location: Location.LocationObject = data.locations[0];

    if (error) {
      console.log("Error in WATCH_LOCATION_TASK", error.message);
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

  return {
    subscribe: (sub: SubscriptionType) => subscribers.push(sub),
    setLocation: (location: LocationType) =>
      subscribers.forEach((sub) => sub(location)),
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

  try {
    await Location.startLocationUpdatesAsync(WATCH_LOCATION_TASK, opts);
  } catch (err) {
    // @ts-ignore
    errorMsgSubscription(err.message);
    return;
  }
}

export async function unsubscribeLocationUpdates(
  locationSubscription: (location: LocationType) => void
) {
  locationService.unsubscribe(locationSubscription);
  Location.stopLocationUpdatesAsync(WATCH_LOCATION_TASK);
}
