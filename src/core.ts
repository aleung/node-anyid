import * as assert from 'assert';
import { EncodeBuffer, Codec, codec } from './encode';

export {EncodeBuffer}

export abstract class Value {
  bits: number;
  parent: AnyId;
  abstract value(): EncodeBuffer;
}

class Delimiter {
  constructor(private delimiter: string) { }
  id() { return this.delimiter }
}

export class AnyId {

  static use(mixin: any): void {
    let prototype: any = AnyId.prototype;
    Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
      console.log('Mixes property ', name);
      prototype[name] = mixin.prototype[name];
    });
  }

  private _parent: AnyId;
  private _codec: Codec;
  private _length: number;
  private _sections: (AnyId | Delimiter)[] = [];
  private _values: Value[] = [];
  private _bits: number;


  id(args?: {}): string {
    return this._sections.map((section) => section.id(args)).join('');
  }

  section(anyid: AnyId): AnyId {
    assert(!this.hasValue(), 'Do not mix section with value');
    anyid._parent = this;
    this._sections.push(anyid);
    return this;
  }

  delimiter(d: string): AnyId {
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
    assert(!this.hasSection(), 'Section already exist. Value need to be put inside section');
    value.bits = this._bits;
    this._bits = undefined;
    this._values.push(value);
  }

  sectionBitLength(): number {
    return this._length;
  }
}
