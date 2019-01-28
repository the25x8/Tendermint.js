function idGenerator() {
  let lastId = 0;

  return function getNextId(): number {
    lastId += 1;
    return lastId;
  };
}

export interface IEventBus {
  events: {};
  emit(eventName: string, payload: any): void;
  on(eventName: string, callback: object, once?: boolean): { off: object };
	once(eventName: string, callback: object): void;
  off(eventName: string): void;
}

export default class EventBus implements IEventBus {
  public events = {};
  public onceEventNames = {};
  private getNextId = idGenerator();

  constructor() {}

  public emit(eventName: string, payload: any): void {
    const subscription = this.events[eventName];

    if (!subscription) {
      return;
    }

    Object.keys(subscription).forEach((id) =>
      this.events[eventName][id](payload),
    );

    if(this.onceEventNames[eventName]) {
	    this.off(eventName);
    }
  }

  public on(eventName: string, callback: object, once = false): { off: object } {
    const id: number = this.getNextId();

    if (!this.events[eventName]) {
      this.events[eventName] = {};
    }

    if (once) {
      this.onceEventNames[eventName] = true;
    }

    this.events[eventName][id] = callback;

    return {
      // Remove current subscriber or listener
      // if his doesn't have subscribers
      off: () => {
        delete this.events[eventName][id];

        if (Object.keys(this.events[eventName]).length === 0) {
          delete this.events[eventName];
        }
      },
    };
  }

  public once(eventName: string, callback: object): void {
    this.on(eventName, callback, true);
  }

  // Remove listener with him subscribers
  public off(eventName: string) {
    delete this.events[eventName];

    if (this.onceEventNames[eventName]) {
	    delete this.onceEventNames[eventName];
    }
  }
}
