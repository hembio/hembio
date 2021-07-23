import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Observable } from "rxjs";
// import { Server } from "socket.io";
import { Server } from "ws";
import { EventDto } from "./dto/event.dto";
import { EventService } from "./event.service";

@WebSocketGateway()
export class EventGateway {
  public constructor(private readonly eventsService: EventService) {}

  @WebSocketServer()
  public server!: Server;

  @SubscribeMessage("events")
  public events(@MessageBody() _data: unknown): Observable<EventDto<unknown>> {
    return this.eventsService.getStream();
  }
}
