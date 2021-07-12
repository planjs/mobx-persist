export default abstract class IStorage {
  abstract getItem(key: string): Promise<string>;
  abstract removeItem(key: string): Promise<void>;
  abstract setItem(key: string, value: string): Promise<void>;
  abstract clear(): Promise<void>;
  onChange(key: string, newValue: string, oldValue: string): void {}
}
