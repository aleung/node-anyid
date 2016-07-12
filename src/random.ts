import {AnyId, Value, EncodeBuffer} from './core';

declare module './core' {
  interface AnyId {
    random(): AnyId;
  }
}

class RandomValue extends Value {
  value(): EncodeBuffer {
    // TODO
    return null;
  }
}

export class Random {
  random(this: AnyId): AnyId {
    this.addValue(new RandomValue());
    return this;
  }
}
