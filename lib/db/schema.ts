/**
 * IndexedDB スキーマ定義（Dexie.js）
 * タイピング履歴とユーザー設定を保存
 */
import Dexie, { Table } from 'dexie';
import { KeyStat } from '@/lib/typing/analyzer';

/**
 * タイピングセッション
 */
export interface TypingSession {
  id: string; // UUID
  timestamp: number; // 開始時刻（Unix time）
  mode: 'challenge' | 'completion'; // ゲームモード
  difficulty: 'beginner' | 'intermediate' | 'advanced'; // 難易度
  textType: 'random' | 'sentence' | 'programming'; // 文章タイプ
  targetText: string; // 提示された文章
  typedText: string; // 実際に入力された文字列
  duration: number; // プレイ時間（秒）
  wpm: number; // Words Per Minute
  accuracy: number; // 正確性（%）
  keyStats: KeyStat[]; // キーごとの統計
  aiAdvice: string; // AIアドバイス
}

/**
 * ユーザー設定
 */
export interface UserSettings {
  id: string; // 固定値 'user-1'
  theme: 'light' | 'dark'; // テーマ
  soundEnabled: boolean; // サウンド有効
  defaultDifficulty: 'beginner' | 'intermediate' | 'advanced'; // デフォルト難易度
}

/**
 * タイピングゲーム用 IndexedDB
 */
export class TypingGameDB extends Dexie {
  // テーブル定義
  sessions!: Table<TypingSession, string>;
  settings!: Table<UserSettings, string>;

  constructor() {
    super('TypingGameDB');

    // スキーマバージョン1
    this.version(1).stores({
      sessions: 'id, timestamp, difficulty, mode', // idをプライマリキーとし、timestamp, difficulty, modeにインデックス
      settings: 'id', // idをプライマリキー
    });
  }
}

// シングルトンインスタンス
export const db = new TypingGameDB();
