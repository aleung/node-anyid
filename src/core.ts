import * as assert from 'assert';
import * as _ from 'lodash';
import { Codec, codec } from './encode';
import { concatBits, toBuffer } from './utils';


export type IdArg = number | Buffer | {[name: string]: any};

export abstract class Value {
  parent: AnyId;
  private _bits: number | undefined;

  abstract value(arg?: IdArg): Buffer;

  set bits(n: number | undefined) {
    this._bits = n;
  }

  get bits(): number | undefined {
    if (!this._bits) {
      this._bits = this.parent.sectionBitLength();
    }
    return this._bits;
  }

  protected returnValue(v: number | Buffer): Buffer {
    return this.bits ? toBuffer(v, Math.ceil(this.bits / 8)) : toBuffer(v);
  }
}

class Delimiter {
  constructor(private delimiter: string) { }
  id() { return this.delimiter; }
}

export class AnyId {

  static use(mixin: any): void {
    let prototype: any = AnyId.prototype;
    Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
      prototype[name] = mixin.prototype[name];
    });
  }

  private _parent: AnyId;
  private _codec: Codec | undefined;
  private _length: number;
  private _sections: (AnyId | Delimiter)[] = [];
  private _values: Value[] = [];
  private _bits: number | undefined;

  private get codec(): Codec {
    return this._codec ? this._codec : this._parent.codec;
  }

  id(arg?: IdArg): string {
    if (this.hasValue()) {
      const {bits, buf} = _.reduceRight(this._values,
        (result: { bits: number, buf: Buffer }, value: Value) => {
          const v = value.value(arg);
          const bits = value.bits || v.length * 8;
          return {
            bits: bits + result.bits,
            buf: concatBits(v, bits, result.buf, result.bits)
          };
        }, { bits: 0, buf: Buffer.alloc(0) });
      const c = this.codec.encode(buf);
      if (this._length) {
        if (c.length > this._length) {
          return c.substr(c.length - this._length);
        }
        if (c.length < this._length) {
          return _.padStart(c, this._length, this.codec.padChar());
        }
      }
      return c;
    }
    return this._sections.map((section) => section.id(arg)).join('');
  }

  section(anyid: AnyId): AnyId {
    assert(!this.hasValue(), 'Do not mix section with value');
    anyid._parent = this;
    this._sections.push(anyid);
    return this;
  }

  delimiter(d: string): AnyId {
    assert(!this.hasValue(), 'Do not mix delimiter with value');
    this._sections.push(new Delimiter(d));
    return this;
  }

  encode(charset: string): AnyId {
    assert(!this._codec, 'Duplicated encode');
    this._codec = codec(charset);
    return this;
  }

  length(n: number): AnyId {
    assert(!this._length, 'Duplicated length');
    assert(n > 0, 'Length must be larger than zero');
    this._length = n;
    return this;
  }

  bits(n: number): AnyId {
    assert(n > 0, 'Bit must be larger than zero');
    this._bits = n;
    return this;
  }

  // ---- below methods are not public API ----

  private hasSection(): boolean {
    return this._sections.length > 0;
  }

  private hasValue(): boolean {
    return this._values.length > 0;
  }

  addValue(value: Value): void {
    assert(!this.hasSection(), 'Section/delimiter already exist. Value need to be put inside section');
    value.parent = this;
    value.bits = this._bits;
    this._bits = undefined;
    this._values.push(value);
  }

  lastValue(): Value {
    return _.last(this._values);
  }

  findValueByType(type: string): Value | undefined {
    for (let v of this._values) {
      if (v.constructor.name === type) {
        return v;
      }
    }
    for (let s of this._sections) {
      if (s instanceof AnyId) {
        const v = s.findValueByType(type);
        if (v) {
          return v;
        }
      }
    }
    return this._parent ? this._parent.findValueByType(type) : undefined;
  }

  sectionBitLength(): number | undefined {
    return this._length ? this.codec.bytesForLength(this._length) * 8 : undefined;
  }
}
