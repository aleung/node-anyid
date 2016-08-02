import { expect } from 'chai';
import { AnyId } from '../src/core';
import { Func } from '../src/function';

AnyId.use(Func);

describe('function', () => {

  it('function returns number', () => {
    expect(
      new AnyId().encode('0+ABCDEF').length(3).of(() => 0x12).id()
    ).to.equal('012');
  });

  it('function returns buffer', () => {
    expect(
      new AnyId().encode('0+ABCDEF').length(13).of(() => Buffer.from([0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC])).id()
    ).to.equal('0123456789ABC');
  });

});