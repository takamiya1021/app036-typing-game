/**
 * 統計計算ロジックのテスト（Red）
 */
import { calculateWPM, calculateAccuracy, calculateTypingSpeed } from './calculator';

describe('calculator', () => {
  describe('calculateWPM', () => {
    it('should calculate WPM correctly for 60 seconds', () => {
      const characterCount = 300; // 60文字/分 × 5文字/単語 = 60WPM
      const durationInSeconds = 60;
      const wpm = calculateWPM(characterCount, durationInSeconds);
      expect(wpm).toBe(60);
    });

    it('should calculate WPM correctly for 30 seconds', () => {
      const characterCount = 150; // 30秒で150文字 = 60WPM
      const durationInSeconds = 30;
      const wpm = calculateWPM(characterCount, durationInSeconds);
      expect(wpm).toBe(60);
    });

    it('should calculate WPM correctly for 120 seconds', () => {
      const characterCount = 450; // 120秒で450文字 = 45WPM
      const durationInSeconds = 120;
      const wpm = calculateWPM(characterCount, durationInSeconds);
      expect(wpm).toBe(45);
    });

    it('should return 0 for 0 duration', () => {
      const characterCount = 100;
      const durationInSeconds = 0;
      const wpm = calculateWPM(characterCount, durationInSeconds);
      expect(wpm).toBe(0);
    });

    it('should return 0 for 0 characters', () => {
      const characterCount = 0;
      const durationInSeconds = 60;
      const wpm = calculateWPM(characterCount, durationInSeconds);
      expect(wpm).toBe(0);
    });

    it('should handle fractional WPM', () => {
      const characterCount = 100;
      const durationInSeconds = 60;
      const wpm = calculateWPM(characterCount, durationInSeconds);
      expect(wpm).toBe(20);
    });

    it('should round WPM to nearest integer', () => {
      const characterCount = 127;
      const durationInSeconds = 60;
      const wpm = calculateWPM(characterCount, durationInSeconds);
      expect(wpm).toBe(25); // 127 / 5 / 1 = 25.4 → 25
    });
  });

  describe('calculateAccuracy', () => {
    it('should calculate 100% accuracy for perfect input', () => {
      const correctCount = 50;
      const totalCount = 50;
      const accuracy = calculateAccuracy(correctCount, totalCount);
      expect(accuracy).toBe(100);
    });

    it('should calculate 0% accuracy for all incorrect', () => {
      const correctCount = 0;
      const totalCount = 50;
      const accuracy = calculateAccuracy(correctCount, totalCount);
      expect(accuracy).toBe(0);
    });

    it('should calculate 50% accuracy', () => {
      const correctCount = 25;
      const totalCount = 50;
      const accuracy = calculateAccuracy(correctCount, totalCount);
      expect(accuracy).toBe(50);
    });

    it('should calculate 92% accuracy', () => {
      const correctCount = 46;
      const totalCount = 50;
      const accuracy = calculateAccuracy(correctCount, totalCount);
      expect(accuracy).toBe(92);
    });

    it('should return 0 for 0 total count', () => {
      const correctCount = 0;
      const totalCount = 0;
      const accuracy = calculateAccuracy(correctCount, totalCount);
      expect(accuracy).toBe(0);
    });

    it('should round accuracy to nearest integer', () => {
      const correctCount = 33;
      const totalCount = 100;
      const accuracy = calculateAccuracy(correctCount, totalCount);
      expect(accuracy).toBe(33);
    });

    it('should handle fractional accuracy', () => {
      const correctCount = 67;
      const totalCount = 100;
      const accuracy = calculateAccuracy(correctCount, totalCount);
      expect(accuracy).toBe(67);
    });
  });

  describe('calculateTypingSpeed', () => {
    it('should calculate characters per second', () => {
      const characterCount = 120;
      const durationInSeconds = 60;
      const speed = calculateTypingSpeed(characterCount, durationInSeconds);
      expect(speed).toBe(2); // 2文字/秒
    });

    it('should return 0 for 0 duration', () => {
      const characterCount = 100;
      const durationInSeconds = 0;
      const speed = calculateTypingSpeed(characterCount, durationInSeconds);
      expect(speed).toBe(0);
    });

    it('should return 0 for 0 characters', () => {
      const characterCount = 0;
      const durationInSeconds = 60;
      const speed = calculateTypingSpeed(characterCount, durationInSeconds);
      expect(speed).toBe(0);
    });

    it('should round to 2 decimal places', () => {
      const characterCount = 100;
      const durationInSeconds = 60;
      const speed = calculateTypingSpeed(characterCount, durationInSeconds);
      expect(speed).toBe(1.67);
    });
  });
});
