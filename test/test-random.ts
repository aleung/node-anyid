import * as _ from 'lodash';
import { expect } from 'chai';
import { anyid } from '../src/index';

describe('random', () => {

  it('has no duplication (p = 0.055%)', () => {
    // The probability of duplication is 0.055%
    const idGen = anyid().encode('Aa0').length(5).random();
    const ids = _.times(1000, () => idGen.id());
    expect(_.uniq(ids).length).to.equal(1000);
  });

  it('throw error on missing length or bits', () => {
    expect(() =>
      anyid().encode('Aa0').random().id()
    ).to.throw(/.*/);
  });

});
