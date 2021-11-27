import { serializable } from 'serializr';
import { types } from './types';
import type { Types } from './types';
import { persistObject } from './persist-object';

function persist(
  type: Types,
  schema?: any,
): (target: Object, key: string, baseDescriptor?: PropertyDescriptor) => void; // two
function persist(target: Object, key: string, baseDescriptor?: PropertyDescriptor): void;
function persist(schema: Object): <T>(target: T) => T; // object
function persist(...args: any[]): any {
  const [a, b] = args;
  if (a in types) {
    return serializable(types[a as Types](b));
  }
  if (args.length === 1) {
    return (target: any) => persistObject(target, a);
  }
  // eslint-disable-next-line prefer-spread
  return serializable.apply(null, args);
}

export default persist;
