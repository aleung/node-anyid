import { expect } from 'chai';
import { AnyId } from '../src/core';
import { Time } from '../src/time';
import { Sequence } from '../src/seq';

AnyId.use(Sequence);
AnyId.use(Time);

function sleep(millisec: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    setTimeout(resolve, millisec);
  });
}

describe('seq', () => {

  it('start with given number', () => {
    const anyid = new AnyId().encode('0').length(2).seq().startWith(5);
    expect(anyid.id()).to.equal('05');
    expect(anyid.id()).to.equal('06');
  });

  it('rewind at max', () => {
    const anyid = new AnyId().encode('0').length(2).seq().max(2);
    expect(anyid.id()).to.equal('00');
    expect(anyid.id()).to.equal('01');
    expect(anyid.id()).to.equal('02');
    expect(anyid.id()).to.equal('00');
  });

  it('reset by time', async () => {
    const anyid = new AnyId().encode('0')
      .section(new AnyId().time('s').since(new Date()))
      .delimiter('-')
      .section(new AnyId().length(2).seq().resetByTime());
    expect(anyid.id().split('-')[1]).to.equal('00');
    expect(anyid.id().split('-')[1]).to.equal('01');
    await sleep(1000);
    expect(anyid.id().split('-')[1]).to.equal('00');
  });

});