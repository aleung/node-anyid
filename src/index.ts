import { AnyId } from './core';
import { Time } from './time';
import { Random } from './random';
import { Fixed } from './fixed';
import { Sequence } from './seq';
import { Func } from './function';
import { Variable } from './variable';

AnyId.use(Time);
AnyId.use(Random);
AnyId.use(Fixed);
AnyId.use(Sequence);
AnyId.use(Func);
AnyId.use(Variable);

function anyid(): AnyId {
  return new AnyId();
}

export {
  AnyId,
  Time, Random, Fixed, Sequence, Func, Variable,
  anyid
};
