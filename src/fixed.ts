import { AnyId, Value } from './core';
import { toBuffer } from './utils';

declare module './core' {
  interface AnyId {
    fixed(n: number | Buffer): AnyId;
  }
}

class FixedValue extends Value {
  constructor(private v: Buffer) {
    super();
  }

  value(): Buffer {
    return this.returnValue(this.v);
  }
}

export class Fixed {
  fixed(this: AnyId, v: number | Buffer): AnyId {
    this.addValue(new FixedValue(toBuffer(v)));
    return this;
  }
}
