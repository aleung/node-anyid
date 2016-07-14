import * as assert from 'assert';
import * as crypto from 'crypto';
import { AnyId, Value } from './core';

declare module './core' {
  interface AnyId {
    random(): AnyId;
  }
}

class RandomValue extends Value {
  value(): Buffer {
    assert(this.bits, 'Length or bits must be set for random');
    return crypto.randomBytes(Math.ceil(this.bits / 8));
  }
}

export class Random {
  random(this: AnyId): AnyId {
    this.addValue(new RandomValue());
    return this;
  }
}
