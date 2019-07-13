import assert from 'assert';
import { AnyId, Value } from './core';
import { TimeValue } from './time';

declare module './core' {
  interface AnyId {
    seq(): AnyId;
    startWith(n: number): AnyId;
    max(n: number): AnyId;
    resetByTime(): AnyId;
  }
}

class SequenceValue extends Value {

  private lowerBound = 0;
  private upperBound = 2 ^ 32;
  private seq: number | undefined;
  private _resetByTime = false;
  private timeValue: TimeValue | undefined;
  private time: Buffer | undefined;
  private initialized = false;

  startWith(n: number): void {
    this.lowerBound = n;
  }

  max(n: number): void {
    this.upperBound = n;
  }

  resetByTime(): void {
    this._resetByTime = true;
    // it's not the time to call init()
  }

  value(): Buffer {
    if (!this.initialized) {
      this.init();
    }
    if (!this.seq || this.seq > this.upperBound || this.toBeReset()) {
      this.seq = this.lowerBound;
    }
    return this.returnValue(this.seq++);
  }

  private init(): void {
    if (this._resetByTime) {
      this.timeValue = <TimeValue>this.owner.findValueByType(TimeValue.name);
      assert(this.timeValue, 'resetByTime() requires time()');
      this.time = this.timeValue.value();
    }
    this.initialized = true;
  }

  private toBeReset(): boolean {
    if (this._resetByTime) {
      const now = this.timeValue!.value();
      if (this.time!.compare(now) !== 0) {
        this.time = now;
        return true;
      }
    }
    return false;
  }

}

export class Sequence {

  seq(this: AnyId): AnyId {
    this.addValue(new SequenceValue(this));
    return this;
  }

  startWith(this: AnyId, n: number): AnyId {
    assert(this.lastValue() instanceof SequenceValue, 'startWith() must follow seq()');
    (this.lastValue() as SequenceValue).startWith(n);
    return this;
  }

  max(this: AnyId, n: number): AnyId {
    assert(this.lastValue() instanceof SequenceValue, 'max() must follow seq()');
    (this.lastValue() as SequenceValue).max(n);
    return this;
  }

  resetByTime(this: AnyId): AnyId {
    assert(this.lastValue() instanceof SequenceValue, 'resetByTime() must follow seq()');
    (this.lastValue() as SequenceValue).resetByTime();
    return this;
  }

}
