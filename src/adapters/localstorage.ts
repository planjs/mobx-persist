import IStorage from './storage';

class LocalStorage extends IStorage {
  constructor() {
    super();
    try {
      window.addEventListener('storage', (ev) => {
        this.onChange?.(ev.key, ev.newValue, ev.oldValue);
      });
    } catch (e) {
      console.error('[mobx-persist] LocalStorage error', e);
    }
  }

  getItem(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      try {
        const value = window.localStorage.getItem(key);
        resolve(value);
      } catch (err) {
        reject(err);
      }
    });
  }

  removeItem(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.removeItem(key);
        resolve(null);
      } catch (err) {
        reject(err);
      }
    });
  }

  setItem(key: string, value: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.setItem(key, value);
        resolve(null);
      } catch (err) {
        reject(err);
      }
    });
  }

  clear(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.clear();
        resolve(null);
      } catch (err) {
        reject(err);
      }
    });
  }

  onChange(key: string, newVal: any, oldVal: any): void {}
}

export default LocalStorage;
