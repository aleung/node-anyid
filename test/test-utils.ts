import {expect} from 'chai';
import * as _ from 'lodash';
import {concatBits} from '../src/utils';

describe('utils', () => {

  it('oncatenate two bit streams', () => {
    console.log(concatBits(Buffer.from([0xFF, 0xFF, 0xFF, 0xFF, 0xFF]), 36, Buffer.from([0xF0, 0, 0, 0, 0]), 36));
  });

});
