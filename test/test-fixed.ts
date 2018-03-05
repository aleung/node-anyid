import { expect } from 'chai';
import { anyid } from '../src/index';

describe('fixed', () => {

  it('fixed number', () => {
    expect(
      anyid().encode('0+ABCDEF').length(3).fixed(0x12).id()
    ).to.equal('012');
    expect(
      anyid().encode('0+ABCDEF').fixed(0xffffffff).id()
    ).to.equal('FFFFFFFF');
  });

  it('buffer', () => {
    expect(
      anyid().encode('0+ABCDEF').length(13).fixed(Buffer.from([0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC])).id()
    ).to.equal('0123456789ABC');
  });

});
