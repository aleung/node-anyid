import { expect } from 'chai';
import { AnyId, anyid } from '../src/index';
import { FilledValue, FillBits } from './fill';

AnyId.use(FillBits);

describe('core', () => {

  describe('Value', () => {
    it('bits', () => {
      const testValue = new FilledValue(0);
      const ids = anyid().encode('0-90'); // charset size is 8, 4 bits per char
      ids.addValue(testValue);
      expect(testValue.bits).to.be.undefined;
      ids.length(4);
      expect(testValue.bits).to.equal(4 * 4);
      testValue.bits = 3;
      expect(testValue.bits).to.equal(3);
    });
  });

  describe('AnyId', () => {

    it('length and bits', () => {
      expect(
        anyid().encode('0-23456789').length(8).bits(3).fill().id()
      ).to.equal('00000111');
      expect(
        anyid().encode('0-23456789').length(16).bits(3).fill(1).bits(7).fill(0).id()
      ).to.equal('0000001110000000');
      expect(
        anyid().encode('0+ABCDEF').length(20).bits(4).fill(1).bits(36).fill(0).bits(36).fill(1).id()
      ).to.equal('0F000000000FFFFFFFFF');
    });

    it('trim to bits', () => {
      expect(
        anyid().encode('0-23456789').length(8).bits(3).fixed(0xff).id()
      ).to.equal('00000111');
    });

    it('pad to length', () => {
      expect(
        anyid().encode('0+ABCDEF').length(16).fixed(0x0f).id()
      ).to.equal('000000000000000F');
    });

    it('section and delimiter', () => {
      expect(
        anyid().encode('0-23456789')
          .section(anyid().length(4).fill())
          .delimiter('-')
          .section(anyid().length(4).fill())
          .id()
      ).to.equal('1111-1111');
    });

    it('do not allow section mix with value', () => {
      expect(() =>
        anyid().encode('0-23456789')
          .section(anyid().length(4).fill())
          .fill()
          .id()
      ).to.throw(/section/);
      expect(() =>
        anyid().encode('0-23456789')
          .fill()
          .section(anyid().length(4).fill())
          .id()
      ).to.throw(/section/);
      expect(() =>
        anyid().encode('0-23456789')
          .fill()
          .delimiter('-')
          .id()
      ).to.throw(/delimiter/);
      expect(() =>
        anyid().encode('0-23456789')
          .delimiter('-')
          .fill()
          .id()
      ).to.throw(/delimiter/);
    });

  });
});
