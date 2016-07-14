import { AnyId, Value } from './core';

export type ValueCallback = () => number | Buffer;

declare module './core' {
  interface AnyId {
    of(f: ValueCallback): AnyId;
  }
}

class FunctionValue extends Value {
  constructor(private f: ValueCallback) {
    super();
  }

  value(): Buffer {
    return this.returnValue(this.f());
  }
}

export class Func {
  of(this: AnyId, f: ValueCallback): AnyId {
    this.addValue(new FunctionValue(f));
    return this;
  }
}
