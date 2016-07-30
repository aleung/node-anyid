import { expect } from 'chai';
import { AnyId, Value } from '../src/core';
import { FilledValue, FillBits } from './fill';

AnyId.use(FillBits);

describe('core', () => {

  describe('Value', () => {
    it('bits', () => {
      const testValue = new FilledValue(0);
      const anyid = new AnyId().encode('0-90'); // charset size is 8, 4 bits per char
      anyid.addValue(testValue);
      expect(testValue.bits).to.be.undefined;
      anyid.length(4);
      expect(testValue.bits).to.equal(4 * 4);
      testValue.bits = 3;
      expect(testValue.bits).to.equal(3);
    });
  });

  describe('AnyId', () => {

    it('bits', () => {
      expect(
        new AnyId().encode('0-23456789').length(8).bits(3).fill().id()
      ).to.equal('00000111');
      expect(
        new AnyId().encode('0-23456789').length(16).bits(3).fill(1).bits(7).fill(0).id()
      ).to.equal('0000001110000000');
      expect(
        new AnyId().encode('0+ABCDEF').length(20).bits(4).fill(1).bits(36).fill(0).bits(36).fill(1).id()
      ).to.equal('0F000000000FFFFFFFFF');
    });

  });
});
