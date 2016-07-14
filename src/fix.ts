import { AnyId, Value } from './core';
import { toBuffer } from './utils';

declare module './core' {
  interface AnyId {
    fix(n: number): AnyId;
  }
}

class FixValue extends Value {
  constructor(private v: Buffer) {
    super();
  }

  value(): Buffer {
    return this.v;
  }
}

export class Fix {
  fix(this: AnyId, v: number | Buffer): AnyId {
    this.addValue(new FixValue(toBuffer(v)));
    return this;
  }
}
