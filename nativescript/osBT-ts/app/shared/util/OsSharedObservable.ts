import { Observable, Observer, share, Subject, Subscriber, Subscription } from "rxjs";

export class OsSharedObservable<MessageType> {

  private subscriber: Subscriber<MessageType>;
  private observable = new Observable(subscriber => {
    this.subscriber = subscriber;
  });
  private shared = this.observable.pipe( share({ connector: () => new Subject() }));

  private subscriberErr: Subscriber<any>;
  private observableErr = new Observable(subscriberErr => {
    this.subscriberErr = subscriberErr;
  });
  private sharedErr = this.observableErr.pipe( share({ connector: () => new Subject() }));

  private subscriberDone: Subscriber<void>;
  private observableDone = new Observable(subscriberDone => {
    this.subscriberDone = subscriberDone;
  });
  private sharedDone = this.observableDone.pipe( share({ connector: () => new Subject() }));

  constructor() {
  }

  send(message: MessageType): boolean {
    if (this.subscriber) {
      this.subscriber.next(message);
      return true;
    }
    else
      return false;
  }

  error(message: any): void {
    if (this.subscriberErr)
      this.subscriberErr.next(message);
  }

  done(): void {
    if (this.subscriberDone)
      this.subscriberDone.next();
  }

  onMessage(observer: Observer<MessageType>): Subscription {
    return this.shared.subscribe(observer);
  }

  onError(observer: Observer<any>): Subscription {
    return this.sharedErr.subscribe(observer);
  }

  onDone(observer: Observer<void>): Subscription {
    return this.sharedDone.subscribe(observer);
  }

}
