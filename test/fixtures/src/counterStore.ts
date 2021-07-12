import { action, observable, reaction } from "mobx";
import { persist, hydrate } from "../../../";

const hydrateStore = hydrate();

class CounterStore {
  @persist @observable count = 0;

  @action add = () => {
    this.count++;
  };

  @action sub = () => {
    this.count--;
  };
}

const counterStore = new CounterStore();

reaction(
  () => counterStore.count,
  (count) => {
    console.log("change", count);
  }
);

const persistCounterStore = hydrateStore("@planjs/persist", counterStore);

persistCounterStore.then((store) => {
  console.log("persist count", store.count);
});

export { persistCounterStore };
export default counterStore;
