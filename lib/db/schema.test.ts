/**
 * IndexedDB スキーマのテスト（Red）
 */
import { TypingGameDB } from './schema';
import Dexie from 'dexie';

describe('TypingGameDB Schema', () => {
  let db: TypingGameDB;

  beforeEach(async () => {
    // 各テスト前に新しいDBインスタンスを作成
    db = new TypingGameDB();
    await db.open();
  });

  afterEach(async () => {
    if (db.isOpen()) {
      await db.close();
    }
    // データベースを削除してクリーンアップ
    await Dexie.delete('TypingGameDB');
  });

  describe('Database Initialization', () => {
    it('should create database with correct name', () => {
      expect(db.name).toBe('TypingGameDB');
    });

    it('should have sessions table', () => {
      expect(db.sessions).toBeDefined();
      expect(typeof db.sessions.add).toBe('function');
      expect(typeof db.sessions.get).toBe('function');
    });

    it('should have settings table', () => {
      expect(db.settings).toBeDefined();
      expect(typeof db.settings.add).toBe('function');
      expect(typeof db.settings.get).toBe('function');
    });

    it('should have correct version', () => {
      expect(db.verno).toBe(1);
    });
  });

  describe('Sessions Table', () => {
    it('should add a typing session', async () => {
      const session = {
        id: 'test-session-1',
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

      await db.sessions.add(session);
      const retrieved = await db.sessions.get('test-session-1');

      expect(retrieved).toEqual(session);
    });

    it('should query sessions by timestamp', async () => {
      const now = Date.now();
      const session1 = {
        id: 'session-1',
        timestamp: now - 1000,
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
      };

      const session2 = {
        id: 'session-2',
        timestamp: now,
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
      };

      await db.sessions.bulkAdd([session1, session2]);

      const sessions = await db.sessions.orderBy('timestamp').reverse().toArray();
      expect(sessions).toHaveLength(2);
      expect(sessions[0].id).toBe('session-2');
      expect(sessions[1].id).toBe('session-1');
    });

    it('should query sessions by difficulty', async () => {
      const sessions = [
        {
          id: 's1',
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
        },
        {
          id: 's2',
          timestamp: Date.now(),
          mode: 'challenge' as const,
          difficulty: 'advanced' as const,
          textType: 'sentence' as const,
          targetText: 'Test',
          typedText: 'Test',
          duration: 5,
          wpm: 70,
          accuracy: 95,
          keyStats: [],
          aiAdvice: '',
        },
      ];

      await db.sessions.bulkAdd(sessions);

      const beginnerSessions = await db.sessions
        .where('difficulty')
        .equals('beginner')
        .toArray();

      expect(beginnerSessions).toHaveLength(1);
      expect(beginnerSessions[0].id).toBe('s1');
    });

    it('should delete a session', async () => {
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
      await db.sessions.delete('delete-test');

      const retrieved = await db.sessions.get('delete-test');
      expect(retrieved).toBeUndefined();
    });

    it('should update a session', async () => {
      const session = {
        id: 'update-test',
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
      await db.sessions.update('update-test', { aiAdvice: 'Updated advice' });

      const retrieved = await db.sessions.get('update-test');
      expect(retrieved?.aiAdvice).toBe('Updated advice');
    });
  });

  describe('Settings Table', () => {
    it('should add user settings', async () => {
      const settings = {
        id: 'user-1',
        theme: 'dark' as const,
        soundEnabled: true,
        defaultDifficulty: 'intermediate' as const,
      };

      await db.settings.add(settings);
      const retrieved = await db.settings.get('user-1');

      expect(retrieved).toEqual(settings);
    });

    it('should update settings', async () => {
      const settings = {
        id: 'user-1',
        theme: 'dark' as const,
        soundEnabled: true,
        defaultDifficulty: 'beginner' as const,
      };

      await db.settings.add(settings);
      await db.settings.update('user-1', { theme: 'light' as const });

      const retrieved = await db.settings.get('user-1');
      expect(retrieved?.theme).toBe('light');
    });

    it('should have only one settings record', async () => {
      const settings1 = {
        id: 'user-1',
        theme: 'dark' as const,
        soundEnabled: true,
        defaultDifficulty: 'beginner' as const,
      };

      const settings2 = {
        id: 'user-1',
        theme: 'light' as const,
        soundEnabled: false,
        defaultDifficulty: 'advanced' as const,
      };

      await db.settings.add(settings1);
      await db.settings.put(settings2); // put replaces if exists

      const all = await db.settings.toArray();
      expect(all).toHaveLength(1);
      expect(all[0].theme).toBe('light');
    });
  });

  describe('Data Integrity', () => {
    it('should handle large keyStats arrays', async () => {
      const keyStats = Array.from({ length: 100 }, (_, i) => ({
        key: String.fromCharCode(97 + (i % 26)),
        finger: 'index' as const,
        hand: 'left' as const,
        correctCount: i,
        missCount: 100 - i,
        averageTime: 100 + i,
      }));

      const session = {
        id: 'large-stats',
        timestamp: Date.now(),
        mode: 'challenge' as const,
        difficulty: 'beginner' as const,
        textType: 'sentence' as const,
        targetText: 'Test',
        typedText: 'Test',
        duration: 5,
        wpm: 40,
        accuracy: 90,
        keyStats,
        aiAdvice: '',
      };

      await db.sessions.add(session);
      const retrieved = await db.sessions.get('large-stats');

      expect(retrieved?.keyStats).toHaveLength(100);
      expect(retrieved?.keyStats[0].key).toBe('a');
    });

    it('should handle concurrent writes', async () => {
      const promises = Array.from({ length: 10 }, (_, i) =>
        db.sessions.add({
          id: `concurrent-${i}`,
          timestamp: Date.now() + i,
          mode: 'challenge' as const,
          difficulty: 'beginner' as const,
          textType: 'sentence' as const,
          targetText: `Test ${i}`,
          typedText: `Test ${i}`,
          duration: 5,
          wpm: 40 + i,
          accuracy: 90 + i,
          keyStats: [],
          aiAdvice: '',
        })
      );

      await Promise.all(promises);

      const count = await db.sessions.count();
      expect(count).toBe(10);
    });
  });
});
