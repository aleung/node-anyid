import * as assert from 'assert';
import * as _ from 'lodash';
import { AnyId, Value, IdArg } from './core';


declare module './core' {
  interface AnyId {
    variable(name?: string): AnyId;
  }
}

class VariableValue extends Value {
  constructor(private name?: string) {
    super();
  }

  value(arg: IdArg): Buffer {
    assert(!_.isUndefined(arg), 'Variable requires to be given in id()');
    if (typeof arg === 'number' || arg instanceof Buffer) {
      assert(!this.name, 'Expect an object to be passed into id()');
      return this.returnValue(arg);
    } else {
      if (this.name) {
        assert(_.has(arg, this.name), `Missing property ${this.name} in object passed into id()`);
        const property = arg[this.name];
        if (typeof property === 'number' || property instanceof Buffer) {
          return this.returnValue(property);
        }
        throw new Error(`Expect variable ${this.name} to be a number or a Buffer`);
      }
      throw new Error('Expect a number or a Buffer to be passed into id() instead of object');
    }
  }
}

export class Variable {
  variable(this: AnyId, name?: string): AnyId {
    this.addValue(new VariableValue(name));
    return this;
  }
}
