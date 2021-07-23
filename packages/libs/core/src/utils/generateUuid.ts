import { v4, v5 } from "uuid";

export function generateUuid(): string {
  return v4().toString();
}

export function generateNamespacedUuid(
  namespace: string,
  value: string,
): string {
  return v5(value, namespace);
}
