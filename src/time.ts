import assert from 'assert';
import { AnyId, Value } from './core';

export type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd';

declare module './core' {
  interface AnyId {
    time(unit?: TimeUnit): AnyId;
    since(t: Date): AnyId;
  }
}

export class TimeValue extends Value {
  private epoch = 0;

  constructor(owner: AnyId, private divisor: number) {
    super(owner);
  }

  value(): Buffer {
    const ms = Date.now() - this.epoch;
    const t = (this.divisor > 1) ? Math.floor(ms / this.divisor) : ms;
    return this.returnValue(t);
  }

  since(t: Date): void {
    this.epoch = t.getTime();
  }
}

export class Time {

  time(this: AnyId, unit: TimeUnit = 'ms'): AnyId {
    let divisor: number = 1;
    switch (unit) {
      case 's': divisor = 1000; break;
      case 'm': divisor = 60000; break;
      case 'h': divisor = 3600000; break;
      case 'd': divisor = 86400000; break;
    }
    this.addValue(new TimeValue(this, divisor));
    return this;
  }

  since(this: AnyId, t: Date): AnyId {
    assert(this.lastValue() instanceof TimeValue, 'since() must follow time()');
    (this.lastValue() as TimeValue).since(t);
    return this;
  }

}
