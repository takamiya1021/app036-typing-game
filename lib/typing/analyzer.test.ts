/**
 * キー分析ロジックのテスト（Red）
 */
import { analyzeKeyStats, KeyStat, TypingSession } from './analyzer';

describe('Key Analyzer', () => {
  describe('analyzeKeyStats', () => {
    it('should analyze key statistics from typing session', () => {
      const targetText = 'Hello';
      const typedText = 'Hello';
      const keyPresses = [
        { key: 'H', timestamp: 100, isCorrect: true },
        { key: 'e', timestamp: 200, isCorrect: true },
        { key: 'l', timestamp: 300, isCorrect: true },
        { key: 'l', timestamp: 400, isCorrect: true },
        { key: 'o', timestamp: 500, isCorrect: true },
      ];

      const stats = analyzeKeyStats(keyPresses);

      // 'l'が2回出現するため、ユニークキーは4個（H, e, l, o）
      expect(stats).toHaveLength(4);

      const hStat = stats.find(s => s.key === 'H');
      expect(hStat).toBeDefined();
      expect(hStat!.correctCount).toBe(1);
      expect(hStat!.missCount).toBe(0);

      const lStat = stats.find(s => s.key === 'l');
      expect(lStat).toBeDefined();
      expect(lStat!.correctCount).toBe(2); // 'l'が2回
    });

    it('should track correct and incorrect key presses', () => {
      const keyPresses = [
        { key: 'a', timestamp: 100, isCorrect: true },
        { key: 'b', timestamp: 200, isCorrect: false },
        { key: 'a', timestamp: 300, isCorrect: true },
        { key: 'a', timestamp: 400, isCorrect: false },
      ];

      const stats = analyzeKeyStats(keyPresses);

      const aStat = stats.find(s => s.key === 'a');
      expect(aStat).toBeDefined();
      expect(aStat!.correctCount).toBe(2);
      expect(aStat!.missCount).toBe(1);

      const bStat = stats.find(s => s.key === 'b');
      expect(bStat).toBeDefined();
      expect(bStat!.correctCount).toBe(0);
      expect(bStat!.missCount).toBe(1);
    });

    it('should calculate average time per key', () => {
      const keyPresses = [
        { key: 'a', timestamp: 0, isCorrect: true },
        { key: 'a', timestamp: 100, isCorrect: true },
        { key: 'a', timestamp: 200, isCorrect: true },
      ];

      const stats = analyzeKeyStats(keyPresses);
      const aStat = stats.find(s => s.key === 'a');

      expect(aStat).toBeDefined();
      expect(aStat!.averageTime).toBeGreaterThan(0);
      expect(aStat!.averageTime).toBeLessThan(200);
    });

    it('should identify finger and hand for each key', () => {
      const keyPresses = [
        { key: 'a', timestamp: 100, isCorrect: true },
        { key: 'f', timestamp: 200, isCorrect: true },
        { key: 'j', timestamp: 300, isCorrect: true },
        { key: ';', timestamp: 400, isCorrect: true },
      ];

      const stats = analyzeKeyStats(keyPresses);

      const aStat = stats.find(s => s.key === 'a');
      expect(aStat!.hand).toBe('left');
      expect(aStat!.finger).toBe('pinky');

      const fStat = stats.find(s => s.key === 'f');
      expect(fStat!.hand).toBe('left');
      expect(fStat!.finger).toBe('index');

      const jStat = stats.find(s => s.key === 'j');
      expect(jStat!.hand).toBe('right');
      expect(jStat!.finger).toBe('index');
    });

    it('should handle Japanese characters', () => {
      const keyPresses = [
        { key: 'あ', timestamp: 100, isCorrect: true },
        { key: 'い', timestamp: 200, isCorrect: true },
        { key: 'う', timestamp: 300, isCorrect: false },
      ];

      const stats = analyzeKeyStats(keyPresses);

      expect(stats).toHaveLength(3);
      expect(stats[0].key).toBe('あ');
      expect(stats[2].missCount).toBe(1);
    });

    it('should calculate accuracy per key', () => {
      const keyPresses = [
        { key: 'a', timestamp: 100, isCorrect: true },
        { key: 'a', timestamp: 200, isCorrect: true },
        { key: 'a', timestamp: 300, isCorrect: false },
        { key: 'a', timestamp: 400, isCorrect: true },
      ];

      const stats = analyzeKeyStats(keyPresses);
      const aStat = stats.find(s => s.key === 'a');

      expect(aStat!.correctCount).toBe(3);
      expect(aStat!.missCount).toBe(1);

      const accuracy = (aStat!.correctCount / (aStat!.correctCount + aStat!.missCount)) * 100;
      expect(accuracy).toBe(75);
    });

    it('should identify weak keys (high miss rate)', () => {
      const keyPresses = [
        { key: 'p', timestamp: 100, isCorrect: false },
        { key: 'p', timestamp: 200, isCorrect: false },
        { key: 'p', timestamp: 300, isCorrect: false },
        { key: 'p', timestamp: 400, isCorrect: true },
        { key: 'a', timestamp: 500, isCorrect: true },
        { key: 'a', timestamp: 600, isCorrect: true },
      ];

      const stats = analyzeKeyStats(keyPresses);

      const pStat = stats.find(s => s.key === 'p');
      const aStat = stats.find(s => s.key === 'a');

      expect(pStat!.missCount).toBe(3);
      expect(aStat!.missCount).toBe(0);
    });

    it('should handle empty key presses', () => {
      const stats = analyzeKeyStats([]);
      expect(stats).toHaveLength(0);
    });

    it('should aggregate statistics for the same key', () => {
      const keyPresses = [
        { key: 'l', timestamp: 100, isCorrect: true },
        { key: 'l', timestamp: 200, isCorrect: true },
        { key: 'l', timestamp: 300, isCorrect: false },
      ];

      const stats = analyzeKeyStats(keyPresses);

      expect(stats).toHaveLength(1);
      expect(stats[0].key).toBe('l');
      expect(stats[0].correctCount).toBe(2);
      expect(stats[0].missCount).toBe(1);
    });
  });
});
