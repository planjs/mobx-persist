/**
 * Basic Storage
 */
export default abstract class IStorage {
  getItem(key: string): Promise<string> {
    throw new Error("IStorage has to implement `getItem` method");
  }
  removeItem(key: string): Promise<void> {
    throw new Error("IStorage has to implement `removeItem` method");
  }
  setItem(key: string, value: string): Promise<void> {
    throw new Error("IStorage has to implement `setItem` method");
  }
  clear(): Promise<void> {
    throw new Error("IStorage has to implement `clear` method");
  }
  onChange(key: string, newValue: string, oldValue: string): void {}
}
