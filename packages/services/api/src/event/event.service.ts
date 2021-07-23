import { Injectable } from "@nestjs/common";
import { Observable, Subject } from "rxjs";
import { EventDto } from "./dto/event.dto";

@Injectable()
export class EventService {
  private readonly eventStream = new Subject<EventDto<unknown>>();

  public getStream(): Observable<EventDto<unknown>> {
    return this.eventStream.asObservable();
  }

  public emit<T>(event: string, data: T): void {
    this.eventStream.next({ event, data });
  }
}
