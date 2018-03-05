import { expect } from 'chai';
import { anyid } from '../src/index';

describe('variable', () => {

  it('single variable', () => {
    expect(
      anyid().encode('0+ABCDEF').length(3).variable().id(0x12)
    ).to.equal('012');
    expect(
      anyid().encode('0+ABCDEF').length(5).variable().id(Buffer.from([0xFF, 0xAA]))
    ).to.equal('0FFAA');
  });

  it('variable value is zero', () => {
    expect(
      anyid().encode('0+ABCDEF').length(2).variable().id(0)
    ).to.equal('00');
  });

  it('multiple variables', () => {
    expect(
      anyid().encode('0')
      .section(anyid().length(3).variable('userId'))
      .delimiter('-')
      .section(anyid().length(3).variable('groupId'))
      .id({userId: 11, groupId: 22, name: 'IGNORED'})
    ).to.equal('011-022');
  });

  it('throw error on no value passed into id()', () => {
    expect( () =>
      anyid().encode('0').variable().id()
    ).to.throw(/.*/);
    expect( () =>
      anyid().encode('0').variable('userId').id()
    ).to.throw(/.*/);
  });

  it('throw error on mismatch value passed into id()', () => {
    expect( () =>
      anyid().encode('0').variable().id({userId: 123})
    ).to.throw(/.*/);
    expect( () =>
      anyid().encode('0').variable('userId').id(123)
    ).to.throw(/.*/);
    expect( () =>
      anyid().encode('0').variable('userId').id({userId: 'abc'})
    ).to.throw(/.*/);
    expect( () =>
      anyid().encode('0').variable('userId').id({groupId: 1})
    ).to.throw(/.*/);
  });

});