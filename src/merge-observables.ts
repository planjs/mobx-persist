import { isObservableMap, isObservableArray, isObservableObject } from 'mobx';

function mergeObservables<A extends Object, B extends Object>(
  target: A,
  source: B,
  keys: string[] = [],
): A {
  const t: any = target;
  const s: any = source;
  if (typeof t === 'object' && typeof s === 'object') {
    for (const key in t) {
      if (t[key] && typeof t[key] === 'object' && typeof s[key] === 'object') {
        if (isObservableMap(t[key])) t[key].merge(s[key]);
        else if (isObservableArray(t[key])) t[key].replace(s[key]);
        else if (isObservableObject(t[key])) t[key] = mergeObservables(t[key], s[key]);
      } else if (s[key] !== undefined) {
        t[key] = s[key];
      }
    }
  }
  return t;
}

export default mergeObservables;
