/**
 * ストレージアダプターのインターフェース
 * 将来的な拡張性を考慮して、非同期操作として定義
 */
export interface StorageAdapter {
  getItem<T>(key: string): Promise<T | null>;
  setItem<T>(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * LocalStorageを使用したアダプター実装
 */
export class LocalStorageAdapter implements StorageAdapter {
  async getItem<T>(key: string): Promise<T | null> {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }
}

/**
 * ストレージアダプターのインスタンスを提供するファクトリ関数
 */
export function createStorageAdapter(): StorageAdapter {
  return new LocalStorageAdapter();
}
