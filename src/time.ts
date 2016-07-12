import {AnyId} from './core';

export type TimeUnit = 'ms' | 's' | 'm' | 'h' | 'd';

declare module './core' {
  interface AnyId {
    time(unit?: TimeUnit): AnyId;
  }
}

export class Time {

  time(unit: TimeUnit = 'ms') {
    // TODO
    return this;
  }
}
