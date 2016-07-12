import * as assert from 'assert';
import {EncodeBuffer, Codec, codec} from './encode';

interface Value {
  getValue(): EncodeBuffer;
}

class Delimiter {
  constructor(private delimiter: string) { }
}

export class AnyId {

  static use(mixin: any): void {
    let prototype: any = AnyId.prototype;
    Object.getOwnPropertyNames(mixin.prototype).forEach(name => {
      console.log('Mixes property ', name);
      prototype[name] = mixin.prototype[name];
    });
  }

  private _codec: Codec;
  private _length: number;
  private _sections: (AnyId | Delimiter)[] = [];
  // private _values: { bits: number; value: Value }[] = [];


  id(args?: {}): number | Buffer {
    // TODO
    return 0;
  }

  section(anyid: AnyId): AnyId {
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

}
