import {
  isObservableMap,
  isObservableArray,
  isObservableObject,
  set,
} from "mobx";

function mergeObservables<A extends Object, B extends Object>(
  target: A,
  source: B,
  keys: string[] = []
): A {
  const t: any = target;
  const s: any = source;
  if (typeof t === "object" && typeof s === "object") {
    for (const key in t) {
      if (!keys.length || keys.includes(key)) {
        if (
          t[key] &&
          typeof t[key] === "object" &&
          typeof s[key] === "object"
        ) {
          if (isObservableMap(t[key])) t[key].merge(s[key]);
          else if (isObservableArray(t[key])) t[key].replace(s[key]);
          else if (isObservableObject(t[key])) set(t[key], s[key]);
        } else if (s[key] !== undefined) {
          t[key] = s[key];
        }
      }
    }
  }
  return t;
}

export default mergeObservables;
