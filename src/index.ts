
import { AnyId } from './core';
import { Time } from './time';
import { Random } from './random';
import { Fix } from './fix';

AnyId.use(Time);
AnyId.use(Random);
AnyId.use(Fix);

export function anyid(): AnyId {
  return new AnyId();
}
