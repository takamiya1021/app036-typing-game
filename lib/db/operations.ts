/**
 * IndexedDB 操作関数
 * タイピングセッションとユーザー設定の保存・取得
 */
import { db, TypingSession, UserSettings } from './schema';

/**
 * 簡易UUID生成関数
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * セッション保存時のオプション
 */
export interface SessionInput extends Partial<TypingSession> {
  timestamp: number;
  mode: 'challenge' | 'completion';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  textType: 'random' | 'sentence' | 'programming';
  targetText: string;
  typedText: string;
  duration: number;
  wpm: number;
  accuracy: number;
  keyStats: any[];
  aiAdvice: string;
}

/**
 * セッション取得時のフィルター
 */
export interface SessionFilter {
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  mode?: 'challenge' | 'completion';
  limit?: number;
}

/**
 * タイピングセッションを保存
 * @param session セッションデータ
 * @returns 保存されたセッションのID
 */
export async function saveSession(session: SessionInput): Promise<string> {
  const id = session.id || generateId();

  const fullSession: TypingSession = {
    id,
    timestamp: session.timestamp,
    mode: session.mode,
    difficulty: session.difficulty,
    textType: session.textType,
    targetText: session.targetText,
    typedText: session.typedText,
    duration: session.duration,
    wpm: session.wpm,
    accuracy: session.accuracy,
    keyStats: session.keyStats,
    aiAdvice: session.aiAdvice,
  };

  await db.sessions.put(fullSession);
  return id;
}

/**
 * セッションを取得（フィルター・ソート可能）
 * @param filter フィルター条件
 * @returns セッション配列（新しい順）
 */
export async function getSessions(
  filter: SessionFilter = {}
): Promise<TypingSession[]> {
  let query = db.sessions.orderBy('timestamp').reverse();

  // 難易度でフィルター
  if (filter.difficulty) {
    const allSessions = await query.toArray();
    const filtered = allSessions.filter(
      (s) => s.difficulty === filter.difficulty
    );
    query = {
      toArray: async () => filtered,
    } as any;
  }

  // モードでフィルター
  if (filter.mode) {
    const currentSessions = await query.toArray();
    const filtered = currentSessions.filter((s) => s.mode === filter.mode);
    query = {
      toArray: async () => filtered,
    } as any;
  }

  // 結果を取得
  let sessions = await query.toArray();

  // 制限
  if (filter.limit) {
    sessions = sessions.slice(0, filter.limit);
  }

  return sessions;
}

/**
 * 最近のセッションを取得
 * @param limit 取得件数（デフォルト: 10）
 * @returns 最近のセッション配列
 */
export async function getRecentSessions(
  limit: number = 10
): Promise<TypingSession[]> {
  return db.sessions.orderBy('timestamp').reverse().limit(limit).toArray();
}

/**
 * セッションを削除
 * @param id セッションID
 */
export async function deleteSession(id: string): Promise<void> {
  await db.sessions.delete(id);
}

/**
 * ユーザー設定を取得（存在しない場合はデフォルトを返す）
 * @returns ユーザー設定
 */
export async function getSettings(): Promise<UserSettings> {
  const settings = await db.settings.get('user-1');

  if (settings) {
    return settings;
  }

  // デフォルト設定
  return {
    id: 'user-1',
    theme: 'light',
    soundEnabled: true,
    defaultDifficulty: 'beginner',
  };
}

/**
 * ユーザー設定を更新
 * @param updates 更新する設定
 */
export async function updateSettings(
  updates: Partial<Omit<UserSettings, 'id'>>
): Promise<void> {
  const current = await getSettings();
  const updated: UserSettings = {
    ...current,
    ...updates,
  };

  await db.settings.put(updated);
}
