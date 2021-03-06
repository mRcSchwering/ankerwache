/**
 * - Defines background location task (5s locations with foreground notice)
 * - initializes Publisher object for background location subscriptions
 * - related convenience functions
 */
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
    bkgLocationService.setLocation({
      lat: latitude,
      lng: longitude,
      acc: accuracy,
      ts: location.timestamp,
    });
  }
);

interface LocationType {
  lat: number;
  lng: number;
  ts: number | null;
  acc: number | null;
}

type SubscriptionType = (location: LocationType) => void;

interface BkgLocationServiceType {
  subscribe: (sub: SubscriptionType) => void;
  setLocation: (location: LocationType) => void;
  unsubscribe: (sub: SubscriptionType) => void;
}

function BkgLocationService(): BkgLocationServiceType {
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

const bkgLocationService = BkgLocationService();

interface subscribeBkgLocationUpdatesProps {
  locationSubscription: (location: LocationType) => void;
  errorMsgSubscription: (msg?: string) => void;
}

export async function subscribeBkgLocationUpdates({
  locationSubscription,
  errorMsgSubscription,
}: subscribeBkgLocationUpdatesProps) {
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

  bkgLocationService.subscribe(locationSubscription);
  const opts = {
    accuracy: Location.Accuracy.Highest,
    timeInterval: 5000,
    foregroundService: {
      notificationTitle: "Regular location updates...",
      notificationBody:
        "Sounds alarm if drift is persistently higher than radius",
      notificationColor: "#0c555d",
    },
    pausesUpdatesAutomatically: false,
    distanceInterval: 1,
  };

  try {
    await stopDanglingTasks();
    await Location.startLocationUpdatesAsync(WATCH_LOCATION_TASK, opts);
  } catch (err) {
    // @ts-ignore
    errorMsgSubscription(err.message);
    return;
  }
}

export async function unsubscribeBkgLocationUpdates(
  locationSubscription: (location: LocationType) => void
) {
  bkgLocationService.unsubscribe(locationSubscription);
  if (await TaskManager.isTaskRegisteredAsync(WATCH_LOCATION_TASK)) {
    await TaskManager.unregisterTaskAsync(WATCH_LOCATION_TASK);
  }
}

/**
 * cleans up possible left-over background location tasks
 */
export async function stopDanglingTasks() {
  if (await TaskManager.isTaskRegisteredAsync(WATCH_LOCATION_TASK)) {
    await TaskManager.unregisterTaskAsync(WATCH_LOCATION_TASK);
  }
}
