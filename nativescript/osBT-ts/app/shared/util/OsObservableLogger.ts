import { multicast, Observable, Observer, refCount, share, Subject, Subscriber, Subscription } from "rxjs";
import { OsLogger } from "./OsLogger";

export class OsObservableLogger implements OsLogger {

  private subscriber: Subscriber<string>;
  private observable = new Observable(subscriber => {
    this.subscriber = subscriber;
  });
  // private subject = new Subject();
  // private refCounted = this.observable.pipe(multicast(this.subject), refCount());
  private shared = this.observable.pipe( share({ connector: () => new Subject() }));

  constructor() {
  }

  log(message: string): void {
    if (this.subscriber)
      this.subscriber.next(message);
  }

  subscribe(observer: Observer<string>): Subscription {
    return this.shared.subscribe(observer);
  }

}
