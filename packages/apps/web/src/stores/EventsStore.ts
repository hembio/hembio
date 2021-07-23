import { observable } from "mobx";
import { HEMBIO_WS_URL } from "~/constants";

let id = 0;

interface Notification {
  type: string;
  timestamp: number;
  message: string;
}

export class EventsStore {
  private socket: WebSocket;

  @observable
  public notifications: Notification[] = [];

  public constructor() {
    this.socket = new WebSocket(HEMBIO_WS_URL);

    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
  }

  public onOpen(): void {
    console.log("[ws] Connected!");
    this.socket.send(
      JSON.stringify({
        event: "events",
      }),
    );
  }

  public onMessage(event: MessageEvent): void {
    console.log(`[ws] Got message(${++id}):`, JSON.parse(event.data));
  }
}
