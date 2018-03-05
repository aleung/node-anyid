import { AnyId, Value } from './core';
import { toBuffer } from './utils';

declare module './core' {
  interface AnyId {
    fixed(n: number | Buffer): AnyId;
  }
}

class FixedValue extends Value {
  constructor(owner: AnyId, private v: Buffer) {
    super(owner);
  }

  value(): Buffer {
    return this.returnValue(this.v);
  }
}

export class Fixed {
  fixed(this: AnyId, v: number | Buffer): AnyId {
    this.addValue(new FixedValue(this, toBuffer(v)));
    return this;
  }
}
