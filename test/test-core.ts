import { expect } from 'chai';
import { AnyId } from '../src/core';
import { FilledValue, FillBits } from './fill';
import { Fixed } from '../src/fixed';

AnyId.use(Fixed);
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

    it('length and bits', () => {
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

    it('trim to bits', () => {
      expect(
        new AnyId().encode('0-23456789').length(8).bits(3).fixed(0xff).id()
      ).to.equal('00000111');
    });

    it('pad to length', () => {
      expect(
        new AnyId().encode('0+ABCDEF').length(16).fixed(0x0f).id()
      ).to.equal('000000000000000F');
    });

    it('section and delimiter', () => {
      expect(
        new AnyId().encode('0-23456789')
          .section(new AnyId().length(4).fill())
          .delimiter('-')
          .section(new AnyId().length(4).fill())
          .id()
      ).to.equal('1111-1111');
    });

    it('do not allow section mix with value', () => {
      expect(() =>
        new AnyId().encode('0-23456789')
          .section(new AnyId().length(4).fill())
          .fill()
          .id()
      ).to.throw(/section/);
      expect(() =>
        new AnyId().encode('0-23456789')
          .fill()
          .section(new AnyId().length(4).fill())
          .id()
      ).to.throw(/section/);
      expect(() =>
        new AnyId().encode('0-23456789')
          .fill()
          .delimiter('-')
          .id()
      ).to.throw(/delimiter/);
      expect(() =>
        new AnyId().encode('0-23456789')
          .delimiter('-')
          .fill()
          .id()
      ).to.throw(/delimiter/);
    });

  });
});
