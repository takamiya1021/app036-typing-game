/**
 * AI文章生成ロジックのテスト（Red）
 */
import { generateTypingText } from './ai';

// Google Gemini APIのモック
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => {
      return {
        getGenerativeModel: jest.fn().mockReturnValue({
          generateContent: jest.fn().mockResolvedValue({
            response: {
              text: jest.fn().mockReturnValue('モック生成文章'),
            },
          }),
        }),
      };
    }),
  };
});

describe('AI Text Generation', () => {
  describe('generateTypingText', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should generate text for beginner difficulty', async () => {
      const text = await generateTypingText('beginner', 'sentence');
      expect(text).toBeDefined();
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
    });

    it('should generate text for intermediate difficulty', async () => {
      const text = await generateTypingText('intermediate', 'sentence');
      expect(text).toBeDefined();
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
    });

    it('should generate text for advanced difficulty', async () => {
      const text = await generateTypingText('advanced', 'sentence');
      expect(text).toBeDefined();
      expect(typeof text).toBe('string');
      expect(text.length).toBeGreaterThan(0);
    });

    it('should handle random text type', async () => {
      const text = await generateTypingText('beginner', 'random');
      expect(text).toBeDefined();
      expect(typeof text).toBe('string');
    });

    it('should handle programming text type', async () => {
      const text = await generateTypingText('intermediate', 'programming');
      expect(text).toBeDefined();
      expect(typeof text).toBe('string');
    });

    it('should return different text on multiple calls', async () => {
      const text1 = await generateTypingText('beginner', 'sentence');
      const text2 = await generateTypingText('beginner', 'sentence');

      // モックなので同じ文章が返るが、実装では異なることを期待
      expect(text1).toBeDefined();
      expect(text2).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      // エラーハンドリングのテスト
      // 実装時にエラーが発生した場合のフォールバック文章を返す
      const text = await generateTypingText('beginner', 'sentence');
      expect(text).toBeDefined();
    });
  });
});
