import { AnyId, Value } from './core';
import { toBuffer } from './utils';


export type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd';

declare module './core' {
  interface AnyId {
    time(unit?: TimeUnit): AnyId;
  }
}

class TimeValue extends Value {
  constructor(private divisor: number) {
    super();
  }

  value(): Buffer {
    const t = (this.divisor > 1) ? Math.floor(Date.now() / this.divisor) : Date.now();
    return toBuffer(t);
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
    this.addValue(new TimeValue(divisor));
    return this;
  }
}
