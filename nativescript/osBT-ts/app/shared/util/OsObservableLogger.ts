import { Observable, Observer, Subscriber, Subscription } from "rxjs";
import { OsLogger } from "./OsLogger";

export class OsObservableLogger implements OsLogger {

  private subscriber: Subscriber<string>;
  private observable = new Observable(subscriber => {
    this.subscriber = subscriber;
  });

  constructor() {
  }

  log(message: string): void {
    this.subscriber.next(message);
  }

  subscribe(observer: Observer<string>): Subscription {
    return this.observable.subscribe(observer);
  }

}
