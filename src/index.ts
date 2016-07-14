
import { AnyId } from './core';
import { Time } from './time';
import { Random } from './random';
import { Fix } from './fix';
import { Sequence } from './seq';
import { Func } from './function';

AnyId.use(Time);
AnyId.use(Random);
AnyId.use(Fix);
AnyId.use(Sequence);
AnyId.use(Func);

export function anyid(): AnyId {
  return new AnyId();
}
