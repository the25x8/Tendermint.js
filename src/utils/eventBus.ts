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
  on(eventName: string, callback: object): { off: object };
  off(eventName: string): void;
}

export default class EventBus implements EventBus {
  private events = {};
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
  }

  public on(eventName: string, callback: object): { off: object } {
    const id: number = this.getNextId();

    if (!this.events[eventName]) {
      this.events[eventName] = {};
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

  // Remove listener with him subscribers
  public off(eventName: string) {
    delete this.events[eventName];
  }
}
