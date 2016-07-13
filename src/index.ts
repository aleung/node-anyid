
import { AnyId } from './core';
import { Time } from './time';
import { Random } from './random';

AnyId.use(Time);
AnyId.use(Random);

export function anyid(): AnyId {
  return new AnyId();
}
