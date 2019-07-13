import assert from 'assert';
import * as _ from 'lodash';
import { AnyId, Value } from '../src/core';

const BIT_MASKS = _.range(0, 7).map((i) => 0xFF & ~(0xFFFFFFFF << i));

declare module '../src/core' {
  interface AnyId {
    fill(v?: number): AnyId;
  }
}

export class FilledValue extends Value {

  constructor(owner: AnyId, private fillBit: number) {
    super(owner);
  }

  value(): Buffer {
    assert(this.bits, 'Bits must be set');
    const bytes = Math.ceil(this.bits! / 8);
    const buf = Buffer.alloc(bytes, this.fillBit ? 0xFF : 0);
    const remainBits = this.bits! % 8;
    if (this.fillBit && remainBits > 0) {
      buf.writeInt8(BIT_MASKS[remainBits], 0);
    }
    return buf;
  }
}

export class FillBits {
  fill(this: AnyId, v: number = 1): AnyId {
    this.addValue(new FilledValue(this, v));
    return this;
  }
}
