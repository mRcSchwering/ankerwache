import { TaskManagerError, defineTask } from "expo-task-manager";
import { LocationObject } from "expo-location";

export const ANCHOR_WATCH_TASK = "anchor-watch-background-task";

interface AnchorWatchTaskExecutorBody {
  data: any;
  error: TaskManagerError | null;
}

export default function defineTasks() {
  defineTask(
    ANCHOR_WATCH_TASK,
    ({ data, error }: AnchorWatchTaskExecutorBody) => {
      const locations: LocationObject[] = data.locations;

      if (error) {
        console.log(error.message);
        return;
      }
      console.log("Received new locations", locations);
    }
  );
}
