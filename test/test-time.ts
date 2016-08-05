import { expect } from 'chai';
import { anyid } from '../src/index';

describe('time', () => {

  it('time', () => {
    const t = Date.now();
    expect(
      parseInt(anyid().encode('0').time().id())
    ).to.be.closeTo(parseInt(anyid().encode('0').fixed(t).id()), 10);
    expect(
      parseInt(anyid().encode('0').time('ms').id())
    ).to.be.closeTo(parseInt(anyid().encode('0').fixed(t).id()), 10);
    expect(
      parseInt(anyid().encode('0').time('s').id())
    ).to.be.closeTo(parseInt(anyid().encode('0').fixed(t / 1000).id()), 1);
    expect(
      parseInt(anyid().encode('0').time('m').id())
    ).to.be.closeTo(parseInt(anyid().encode('0').fixed(t / 60000).id()), 1);
    expect(
      parseInt(anyid().encode('0').time('h').id())
    ).to.be.closeTo(parseInt(anyid().encode('0').fixed(t / 3600000).id()), 1);
    expect(
      parseInt(anyid().encode('0').time('d').id())
    ).to.be.closeTo(parseInt(anyid().encode('0').fixed(t / (24 * 3600 * 1000)).id()), 1);
  });

  it('since', () => {
    const now = new Date();
    expect(
      anyid().encode('0+ABCDEF').length(3).time('s').since(now).id()
    ).to.equal('000');
  });

});