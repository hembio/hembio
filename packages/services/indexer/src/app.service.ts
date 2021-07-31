import { Injectable } from "@nestjs/common";
import pkg from "../package.json";

@Injectable()
export class AppService {
  public getVersion(): string {
    return pkg.version;
  }
}
