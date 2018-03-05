import { expect } from 'chai';
import { anyid } from '../src/index';

function sleep(millisec: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, millisec);
  });
}

describe('seq', () => {

  it('start with given number', () => {
    const ids = anyid().encode('0').length(2).seq().startWith(5);
    expect(ids.id()).to.equal('05');
    expect(ids.id()).to.equal('06');
  });

  it('rewind at max', () => {
    const ids = anyid().encode('0').length(2).seq().max(2);
    expect(ids.id()).to.equal('00');
    expect(ids.id()).to.equal('01');
    expect(ids.id()).to.equal('02');
    expect(ids.id()).to.equal('00');
  });

  it('reset by time', async () => {
    const ids = anyid().encode('0')
      .section(anyid().time('s').since(new Date()))
      .delimiter('-')
      .section(anyid().length(2).seq().resetByTime());
    expect(ids.id().split('-')[1]).to.equal('00');
    expect(ids.id().split('-')[1]).to.equal('01');
    await sleep(1000);
    expect(ids.id().split('-')[1]).to.equal('00');
  });

  it('throw error on invalid usage', () => {
    expect(() =>
      anyid().encode('A0').startWith(10).max(19).id()
    ).to.throw(/follow/);
    expect(() =>
      anyid().encode('A0').seq().resetByTime().id()
    ).to.throw(/time/);
  });

});
