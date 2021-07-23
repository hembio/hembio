import { action, observable } from "mobx";

export class LoadingStore {
  @observable
  public progress = 0;

  @observable
  public buffer = 0;

  @action
  public setProgress(progress: number): void {
    this.progress = progress;
  }

  @action
  public setBuffer(buffer: number): void {
    this.progress = buffer;
  }

  @action
  public setDone(): void {
    this.progress = 100;
  }

  @action
  public setBegin(): void {
    this.progress = 0;
  }
}
