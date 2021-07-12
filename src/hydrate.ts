import type { IReactionDisposer } from "mobx/lib/internal";
import { getDefaultModelSchema, serialize, update } from "serializr";
import { action, reaction } from "mobx";
import mergeObservables from "./merge-observables";
import type IStorage from "./adapters/storage";
import LocalStorage from "./adapters/localstorage";

export interface HydrateResultOptions {
  /**
   * Storage adapters
   * @default LocalStorage
   */
  storage?: IStorage;
  /**
   * Whether to use JSON serialization when reading and writing
   * @default true
   */
  jsonify?: boolean;
  /**
   * Delayed execution persistence
   * @default 0
   */
  debounce?: number;
  /**
   * Syncing LocalStorage across multiple tabs
   * @default true
   */
  sync?: boolean;
}

export interface HydrateResult<T> extends Promise<T> {
  /**
   * Regain the persistent value
   */
  rehydrate: () => HydrateResult<T>;
  /**
   * Unpersistent
   */
  dispose: IReactionDisposer;
  /**
   * Clear storage
   */
  clear: () => void;
}

function hydrate({
  storage = new LocalStorage(),
  jsonify = true,
  debounce = 0,
  sync = true,
}: HydrateResultOptions = {}) {
  return function <T extends Object>(
    /**
     * persist key
     */
    key: string,
    /**
     * mobx store
     */
    store: T,
    initialState: any = {},
    customArgs: any = {}
  ): HydrateResult<T> {
    const schema = getDefaultModelSchema(store as any);

    function hydration() {
      const promise = storage
        .getItem(key)
        .then((d: any) => (!jsonify ? d : JSON.parse(d)))
        .then(
          action(`[mobx-persist ${key}] LOAD_DATA`, (persisted: any) => {
            if (persisted && typeof persisted === "object") {
              update(
                schema,
                store,
                persisted,
                (err) => {
                  if (err) {
                    console.error("[mobx-persist] Mobx update error", err);
                  }
                },
                customArgs
              );
            }
            mergeObservables(store, initialState);
            return store;
          })
        ) as HydrateResult<T>;

      promise.rehydrate = hydration;

      // Multiple tab sync state
      if (sync) {
        storage.onChange = (changeKey) => {
          if (changeKey === key) {
            promise.rehydrate();
          }
        };
      }

      return promise;
    }

    const result = hydration();

    result.clear = () => {
      storage.removeItem(key);
    };

    if (schema) {
      result.dispose = reaction(
        () => serialize(schema, store),
        (data: any) =>
          storage.setItem(key, !jsonify ? data : JSON.stringify(data)),
        { delay: debounce }
      );
    } else {
      console.error("[mobx-persist] No cacheable value");
    }
    return result;
  };
}

export default hydrate;
