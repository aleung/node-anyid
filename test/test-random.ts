import * as sinon from 'sinon';
import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import {Random} from '../src/random';
import {AnyId, Value} from '../src/core';

const expect = chai.use(sinonChai).expect;

AnyId.use(Random);

function anyidValue(f: (anyid: AnyId) => void): Value {
  const anyid = new AnyId();
  const spy = sinon.spy(anyid, 'addValue');
  f(anyid);
  const value = spy.args[0][0];
  spy.reset();
  return <Value>value;
}

const valueObj = anyidValue( (anyid) => anyid.random() );
valueObj.value();
// TODO