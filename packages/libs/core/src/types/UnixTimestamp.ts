import { Type } from "@mikro-orm/core";

export class UnixTimestamp extends Type<Date, number> {
  public convertToDatabaseValue(value: Date | number): number {
    return value instanceof Date ? value.getTime() : value;
  }
  public convertToJSValue(value: Date | number): Date {
    return value instanceof Date ? value : new Date(value);
  }
  public getColumnType(): string {
    return "number";
  }
}
