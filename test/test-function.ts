import { expect } from 'chai';
import { anyid } from '../src/index';

describe('function', () => {

  it('function returns number', () => {
    expect(
      anyid().encode('0+ABCDEF').length(3).of(() => 0x12).id()
    ).to.equal('012');
  });

  it('function returns buffer', () => {
    expect(
      anyid().encode('0+ABCDEF').length(13).of(() => Buffer.from([0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC])).id()
    ).to.equal('0123456789ABC');
  });

});
