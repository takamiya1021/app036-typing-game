/**
 * データベース操作関数のテスト（Red）
 */
import {
  saveSession,
  getSessions,
  getRecentSessions,
  deleteSession,
  getSettings,
  updateSettings,
} from './operations';
import { TypingGameDB } from './schema';
import Dexie from 'dexie';

describe('Database Operations', () => {
  let db: TypingGameDB;

  beforeEach(async () => {
    db = new TypingGameDB();
    await db.open();
  });

  afterEach(async () => {
    if (db.isOpen()) {
      await db.close();
    }
    await Dexie.delete('TypingGameDB');
  });

  describe('saveSession', () => {
    it('should save a new typing session', async () => {
      const session = {
        id: 'test-1',
        timestamp: Date.now(),
        mode: 'challenge' as const,
        difficulty: 'beginner' as const,
        textType: 'sentence' as const,
        targetText: 'Hello World',
        typedText: 'Hello World',
        duration: 10,
        wpm: 50,
        accuracy: 100,
        keyStats: [],
        aiAdvice: 'Great job!',
      };

      await saveSession(session);
      const retrieved = await db.sessions.get('test-1');

      expect(retrieved).toEqual(session);
    });

    it('should generate UUID if id is not provided', async () => {
      const session = {
        timestamp: Date.now(),
        mode: 'challenge' as const,
        difficulty: 'beginner' as const,
        textType: 'sentence' as const,
        targetText: 'Test',
        typedText: 'Test',
        duration: 5,
        wpm: 40,
        accuracy: 90,
        keyStats: [],
        aiAdvice: '',
      };

      const savedId = await saveSession(session);
      expect(savedId).toBeDefined();
      expect(typeof savedId).toBe('string');
      expect(savedId.length).toBeGreaterThan(0);

      const retrieved = await db.sessions.get(savedId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.wpm).toBe(40);
    });
  });

  describe('getSessions', () => {
    beforeEach(async () => {
      // テストデータを準備
      const sessions = [
        {
          id: 's1',
          timestamp: Date.now() - 3000,
          mode: 'challenge' as const,
          difficulty: 'beginner' as const,
          textType: 'sentence' as const,
          targetText: 'Test 1',
          typedText: 'Test 1',
          duration: 5,
          wpm: 40,
          accuracy: 90,
          keyStats: [],
          aiAdvice: '',
        },
        {
          id: 's2',
          timestamp: Date.now() - 2000,
          mode: 'completion' as const,
          difficulty: 'intermediate' as const,
          textType: 'random' as const,
          targetText: 'Test 2',
          typedText: 'Test 2',
          duration: 8,
          wpm: 55,
          accuracy: 95,
          keyStats: [],
          aiAdvice: '',
        },
        {
          id: 's3',
          timestamp: Date.now() - 1000,
          mode: 'challenge' as const,
          difficulty: 'advanced' as const,
          textType: 'programming' as const,
          targetText: 'Test 3',
          typedText: 'Test 3',
          duration: 10,
          wpm: 70,
          accuracy: 98,
          keyStats: [],
          aiAdvice: '',
        },
      ];

      await db.sessions.bulkAdd(sessions);
    });

    it('should get all sessions sorted by timestamp (newest first)', async () => {
      const sessions = await getSessions();

      expect(sessions).toHaveLength(3);
      expect(sessions[0].id).toBe('s3');
      expect(sessions[1].id).toBe('s2');
      expect(sessions[2].id).toBe('s1');
    });

    it('should filter sessions by difficulty', async () => {
      const sessions = await getSessions({ difficulty: 'beginner' });

      expect(sessions).toHaveLength(1);
      expect(sessions[0].id).toBe('s1');
    });

    it('should filter sessions by mode', async () => {
      const sessions = await getSessions({ mode: 'challenge' });

      expect(sessions).toHaveLength(2);
      expect(sessions[0].id).toBe('s3');
      expect(sessions[1].id).toBe('s1');
    });

    it('should limit the number of sessions returned', async () => {
      const sessions = await getSessions({ limit: 2 });

      expect(sessions).toHaveLength(2);
      expect(sessions[0].id).toBe('s3');
      expect(sessions[1].id).toBe('s2');
    });

    it('should combine multiple filters', async () => {
      const sessions = await getSessions({
        mode: 'challenge',
        difficulty: 'advanced',
        limit: 5,
      });

      expect(sessions).toHaveLength(1);
      expect(sessions[0].id).toBe('s3');
    });
  });

  describe('getRecentSessions', () => {
    beforeEach(async () => {
      const sessions = Array.from({ length: 15 }, (_, i) => ({
        id: `s${i}`,
        timestamp: Date.now() - (15 - i) * 1000,
        mode: 'challenge' as const,
        difficulty: 'beginner' as const,
        textType: 'sentence' as const,
        targetText: `Test ${i}`,
        typedText: `Test ${i}`,
        duration: 5,
        wpm: 40 + i,
        accuracy: 90,
        keyStats: [],
        aiAdvice: '',
      }));

      await db.sessions.bulkAdd(sessions);
    });

    it('should get the 10 most recent sessions by default', async () => {
      const sessions = await getRecentSessions();

      expect(sessions).toHaveLength(10);
      expect(sessions[0].id).toBe('s14'); // 最新
      expect(sessions[9].id).toBe('s5');
    });

    it('should accept custom limit', async () => {
      const sessions = await getRecentSessions(5);

      expect(sessions).toHaveLength(5);
      expect(sessions[0].id).toBe('s14');
      expect(sessions[4].id).toBe('s10');
    });
  });

  describe('deleteSession', () => {
    it('should delete a session by id', async () => {
      const session = {
        id: 'delete-test',
        timestamp: Date.now(),
        mode: 'challenge' as const,
        difficulty: 'beginner' as const,
        textType: 'sentence' as const,
        targetText: 'Test',
        typedText: 'Test',
        duration: 5,
        wpm: 40,
        accuracy: 90,
        keyStats: [],
        aiAdvice: '',
      };

      await db.sessions.add(session);
      await deleteSession('delete-test');

      const retrieved = await db.sessions.get('delete-test');
      expect(retrieved).toBeUndefined();
    });

    it('should not throw error when deleting non-existent session', async () => {
      await expect(deleteSession('non-existent')).resolves.not.toThrow();
    });
  });

  describe('getSettings', () => {
    it('should return default settings when no settings exist', async () => {
      const settings = await getSettings();

      expect(settings).toEqual({
        id: 'user-1',
        theme: 'light',
        soundEnabled: true,
        defaultDifficulty: 'beginner',
      });
    });

    it('should return existing settings', async () => {
      const customSettings = {
        id: 'user-1',
        theme: 'dark' as const,
        soundEnabled: false,
        defaultDifficulty: 'advanced' as const,
      };

      await db.settings.add(customSettings);
      const settings = await getSettings();

      expect(settings).toEqual(customSettings);
    });
  });

  describe('updateSettings', () => {
    it('should create settings if they do not exist', async () => {
      await updateSettings({ theme: 'dark' });

      const settings = await db.settings.get('user-1');
      expect(settings?.theme).toBe('dark');
      expect(settings?.soundEnabled).toBe(true); // デフォルト値
    });

    it('should update existing settings', async () => {
      await db.settings.add({
        id: 'user-1',
        theme: 'light',
        soundEnabled: true,
        defaultDifficulty: 'beginner',
      });

      await updateSettings({ theme: 'dark', soundEnabled: false });

      const settings = await db.settings.get('user-1');
      expect(settings?.theme).toBe('dark');
      expect(settings?.soundEnabled).toBe(false);
      expect(settings?.defaultDifficulty).toBe('beginner'); // 変更されない
    });

    it('should partially update settings', async () => {
      await db.settings.add({
        id: 'user-1',
        theme: 'light',
        soundEnabled: true,
        defaultDifficulty: 'beginner',
      });

      await updateSettings({ defaultDifficulty: 'advanced' });

      const settings = await db.settings.get('user-1');
      expect(settings?.theme).toBe('light');
      expect(settings?.soundEnabled).toBe(true);
      expect(settings?.defaultDifficulty).toBe('advanced');
    });
  });
});
