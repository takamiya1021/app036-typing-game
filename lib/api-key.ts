/**
 * APIキー管理ユーティリティ
 * ユーザーが設定したAPIキーをlocalStorageで管理
 */

const API_KEY_STORAGE_KEY = 'gemini_api_key';

/**
 * APIキーを保存
 */
export function saveApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
}

/**
 * APIキーを取得
 */
export function getApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(API_KEY_STORAGE_KEY);
}

/**
 * APIキーを削除
 */
export function deleteApiKey(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(API_KEY_STORAGE_KEY);
}

/**
 * APIキーが設定されているかチェック
 */
export function hasApiKey(): boolean {
  return getApiKey() !== null;
}
