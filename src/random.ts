import {AnyId} from './core';

declare module './core' {
  interface AnyId {
    random(): AnyId;
  }
}

export class Random {

  random() {
    // TODO
    return this;
  }
}
