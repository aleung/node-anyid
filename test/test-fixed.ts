import { expect } from 'chai';
import { AnyId } from '../src/core';
import { Fixed } from '../src/fixed';

AnyId.use(Fixed);

describe('fixed', () => {

  it('fixed number', () => {
    expect(
      new AnyId().encode('0+ABCDEF').length(3).fixed(0x12).id()
    ).to.equal('012');
    expect(
      new AnyId().encode('0+ABCDEF').fixed(0xffffffff).id()
    ).to.equal('FFFFFFFF');
  });

  it('buffer', () => {
    expect(
      new AnyId().encode('0+ABCDEF').length(13).fixed(Buffer.from([0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC])).id()
    ).to.equal('0123456789ABC');
  });

});