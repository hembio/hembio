type ReturnValue<T> = T | null | undefined;
type PutFunction<T> = () => ReturnValue<T> | Promise<ReturnValue<T>>;

export class LRU<T> {
  protected values = new Map<string, { v: T; t?: number }>();
  public constructor(private size = 20, private ttl = Infinity) {}

  private _set(key: string, value: T): void {
    if (this.ttl !== Infinity) {
      this.values.set(key, { v: value, t: Date.now() + this.ttl });
    } else {
      this.values.set(key, { v: value });
    }
  }

  public get(key: string): T | undefined {
    const c = this.values.get(key);
    if (c) {
      if (c.t && c.t >= Date.now()) {
        this.values.delete(key);
        return undefined;
      }
      // peek the entry, re-insert for LRU strategy
      this.values.delete(key);
      this._set(key, c.v);
    }
    return c ? c.v : undefined;
  }

  public set(key: string, value: T): void {
    if (this.values.size >= this.size) {
      // least-recently used cache eviction strategy
      const keyToDelete = this.values.keys().next().value;
      this.values.delete(keyToDelete);
    }
    this._set(key, value);
  }

  public delete(key: string): void {
    this.values.delete(key);
  }

  public async getOrSet(
    key: string,
    fn: PutFunction<T>,
  ): Promise<T | undefined> {
    let value: ReturnValue<T> = this.get(key);
    if (!value) {
      const res = fn();
      value = res instanceof Promise ? await res : res;
      if (!value) {
        return undefined;
      }
      this._set(key, value);
    }
    return value;
  }
}
