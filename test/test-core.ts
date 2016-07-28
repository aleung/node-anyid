import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import {AnyId, Value} from '../src/core';

const expect = chai.use(sinonChai).expect;

class TestValue extends Value {
  value(): Buffer {
    return undefined;
  }
}

describe('core', () => {

  describe('Value', () => {

    it('bits', () => {
      const anyid = new AnyId().encode('0-90'); // charset size is 8, 4 bits per char
      const testValue = new TestValue();
      anyid.addValue(testValue);
      expect(testValue.bits).to.be.undefined;
      anyid.length(4);
      expect(testValue.bits).to.equal(4 * 4);
      testValue.bits = 3;
      expect(testValue.bits).to.equal(3);
    });


  });
});
