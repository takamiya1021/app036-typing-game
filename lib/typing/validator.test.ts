/**
 * タイピング入力検証ロジックのテスト（Red）
 */
import { validateInput, compareCharacters, CharacterResult } from './validator';

describe('validator', () => {
  describe('compareCharacters', () => {
    it('should return correct for matching characters', () => {
      const result = compareCharacters('a', 'a');
      expect(result).toEqual<CharacterResult>({
        expected: 'a',
        actual: 'a',
        isCorrect: true,
      });
    });

    it('should return incorrect for non-matching characters', () => {
      const result = compareCharacters('a', 'b');
      expect(result).toEqual<CharacterResult>({
        expected: 'a',
        actual: 'b',
        isCorrect: false,
      });
    });

    it('should handle Japanese characters', () => {
      const result = compareCharacters('あ', 'あ');
      expect(result).toEqual<CharacterResult>({
        expected: 'あ',
        actual: 'あ',
        isCorrect: true,
      });
    });

    it('should handle special characters', () => {
      const result = compareCharacters('!', '!');
      expect(result).toEqual<CharacterResult>({
        expected: '!',
        actual: '!',
        isCorrect: true,
      });
    });

    it('should be case-sensitive', () => {
      const result = compareCharacters('A', 'a');
      expect(result).toEqual<CharacterResult>({
        expected: 'A',
        actual: 'a',
        isCorrect: false,
      });
    });
  });

  describe('validateInput', () => {
    it('should validate correct input', () => {
      const targetText = 'Hello';
      const typedText = 'Hello';
      const results = validateInput(targetText, typedText);

      expect(results).toHaveLength(5);
      expect(results.every(r => r.isCorrect)).toBe(true);
    });

    it('should validate partially correct input', () => {
      const targetText = 'Hello';
      const typedText = 'Hallo';
      const results = validateInput(targetText, typedText);

      expect(results).toHaveLength(5);
      expect(results[0].isCorrect).toBe(true);  // H
      expect(results[1].isCorrect).toBe(false); // e vs a
      expect(results[2].isCorrect).toBe(true);  // l
      expect(results[3].isCorrect).toBe(true);  // l
      expect(results[4].isCorrect).toBe(true);  // o
    });

    it('should handle shorter input', () => {
      const targetText = 'Hello';
      const typedText = 'Hel';
      const results = validateInput(targetText, typedText);

      expect(results).toHaveLength(3);
      expect(results.every(r => r.isCorrect)).toBe(true);
    });

    it('should handle longer input', () => {
      const targetText = 'Hello';
      const typedText = 'Hello World';
      const results = validateInput(targetText, typedText);

      // 入力が目標より長い場合、目標の長さまでのみ検証
      expect(results).toHaveLength(5);
    });

    it('should handle empty target text', () => {
      const targetText = '';
      const typedText = 'Hello';
      const results = validateInput(targetText, typedText);

      expect(results).toHaveLength(0);
    });

    it('should handle empty typed text', () => {
      const targetText = 'Hello';
      const typedText = '';
      const results = validateInput(targetText, typedText);

      expect(results).toHaveLength(0);
    });

    it('should handle Japanese text', () => {
      const targetText = 'こんにちは';
      const typedText = 'こんにちは';
      const results = validateInput(targetText, typedText);

      expect(results).toHaveLength(5);
      expect(results.every(r => r.isCorrect)).toBe(true);
    });

    it('should handle mixed Japanese and English text', () => {
      const targetText = 'Hello世界';
      const typedText = 'Hello世界';
      const results = validateInput(targetText, typedText);

      expect(results).toHaveLength(7);
      expect(results.every(r => r.isCorrect)).toBe(true);
    });

    it('should handle special characters', () => {
      const targetText = 'Hello, World!';
      const typedText = 'Hello, World!';
      const results = validateInput(targetText, typedText);

      expect(results).toHaveLength(13);
      expect(results.every(r => r.isCorrect)).toBe(true);
    });
  });
});
