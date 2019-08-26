import assert from 'assert';
import { randomBytes } from 'crypto';
import { AnyId, Value } from './core';

declare module './core' {
  interface AnyId {
    random(): AnyId;
  }
}

class RandomValue extends Value {
  constructor(owner: AnyId) {
    super(owner);
  }

  value(): Buffer {
    assert(this.bits, 'Length or bits must be set for random');
    return randomBytes(Math.ceil(this.bits! / 8));
  }
}

export class Random {
  random(this: AnyId): AnyId {
    this.addValue(new RandomValue(this));
    return this;
  }
}
