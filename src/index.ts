import * as assert from 'assert';
import {Codec, codec} from './encode';

export class Id {

  private _codec: Codec;
  private _length: number;

  id(args?: {}): number | Buffer {
    // TODO
    return 0;
  }

  encode(charset: string): Id {
    assert(!this._codec, 'Duplicated encode');
    this._codec = codec(charset);
    return this;
  }

  length(n: number): Id {
    assert(!this._length, 'Duplicated length');
    assert(n > 0, 'Length must be larger than zero');
    this._length = n;
    return this;
  }

  random(): Id {
    // TODO
    return this;
  }
}

export function anyid(): Id {
  return new Id();
}