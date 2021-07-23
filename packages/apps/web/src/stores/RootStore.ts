import { AuthStore } from "./AuthStore";
import { EventsStore } from "./EventsStore";
import { LoadingStore } from "./LoadingStore";
import { PlayerStore } from "./PlayerStore";

export class RootStore {
  public eventsStore = new EventsStore();
  public authStore = new AuthStore();
  public playerStore = new PlayerStore();
  public loadingStore = new LoadingStore();
}
