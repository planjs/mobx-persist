import {
  list as _list,
  map as _map,
  object as _object,
  custom,
} from "serializr";

function _walk(v: any) {
  if (typeof v === "object" && v) Object.keys(v).map((k) => _walk(v[k]));
  return v;
}

function _default() {
  return custom(_walk, (v: any) => v);
}

export type Types = "object" | "list" | "map";
export const types: Record<Types, (s?: any) => any> = {
  object(s: any) {
    return s ? _object(s) : _default();
  },
  list(s: any) {
    return _list(this.object(s));
  },
  map(s: any) {
    return _map(this.object(s));
  },
};
