import { WsResponse } from "@nestjs/websockets";

export interface EventDto<T> extends WsResponse {
  event: string;
  data: T;
}
