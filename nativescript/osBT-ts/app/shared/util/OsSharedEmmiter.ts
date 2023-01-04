import { Observable, Observer, share, Subject, Subscriber, Subscription } from "rxjs";

export class OsSharedEmmiter<MessageType> {

  private subscriber: Subscriber<MessageType>;
  private observable = new Observable(subscriber => {
    this.subscriber = subscriber;
  });
  private shared = this.observable.pipe( share({ connector: () => new Subject() }));

  constructor() {
  }

  emit(message: MessageType): void {
    if (this.subscriber)
      this.subscriber.next(message);
  }

  subscribe(observer: Observer<MessageType>): Subscription {
    return this.shared.subscribe(observer);
  }

}
