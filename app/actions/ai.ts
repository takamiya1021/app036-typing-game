'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini APIのクライアント初期化
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * 難易度と文章タイプに応じたプロンプトを生成
 */
function generatePrompt(difficulty: string, textType: string): string {
  const basePrompts: Record<string, string> = {
    beginner: '日本語の短文（20-30文字）を生成してください。常用漢字のみを使用し、シンプルで読みやすい文章にしてください。',
    intermediate: '日本語の中文（40-60文字）を生成してください。記号（、。！？）を含む自然な文章にしてください。',
    advanced: '日本語の長文（80-120文字）を生成してください。複雑な表現や記号を含む、読み応えのある文章にしてください。',
  };

  const typeModifiers: Record<string, string> = {
    random: 'ランダムな文字列を含む',
    sentence: '日常的な文章や名言を',
    programming: 'プログラミング用語やコードスニペットを含む',
  };

  const basePrompt = basePrompts[difficulty] || basePrompts.beginner;
  const typeModifier = typeModifiers[textType] || typeModifiers.sentence;

  return `${typeModifier}${basePrompt}\n\n重要: 生成する文章のみを返してください。説明や追加のコメントは不要です。`;
}

/**
 * フォールバック用のサンプル文章
 */
const fallbackTexts: Record<string, string[]> = {
  beginner: [
    'おはようございます',
    'こんにちは、元気ですか',
    '今日はいい天気ですね',
    'ありがとうございます',
    'お疲れ様でした',
  ],
  intermediate: [
    '急がば回れ、という言葉があります。焦らず丁寧に進めましょう。',
    'プログラミングは創造性と論理性の融合です。',
    '継続は力なり。毎日少しずつ練習することが大切です。',
  ],
  advanced: [
    'タイピングスキルの向上には、正確性とスピードのバランスが重要です。焦らず、一文字一文字を丁寧に入力することで、自然とスピードも向上していきます。',
    'プログラミングにおいて、コードの可読性は非常に重要な要素です。適切な命名規則、コメント、そして一貫したスタイルを心がけることで、保守性の高いコードを書くことができます。',
  ],
};

/**
 * タイピング練習用のテキストを生成する
 * @param difficulty 難易度（beginner, intermediate, advanced）
 * @param textType 文章タイプ（random, sentence, programming）
 * @returns 生成されたテキスト
 */
export async function generateTypingText(
  difficulty: string,
  textType: string
): Promise<string> {
  // API キーが設定されていない場合はフォールバック
  if (!genAI) {
    console.warn('GEMINI_API_KEY is not set. Using fallback text.');
    const texts = fallbackTexts[difficulty] || fallbackTexts.beginner;
    return texts[Math.floor(Math.random() * texts.length)];
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = generatePrompt(difficulty, textType);

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // 生成されたテキストをクリーンアップ（改行や余分な空白を削除）
    const cleanedText = text.trim().replace(/\n/g, '');

    return cleanedText || fallbackTexts[difficulty][0];
  } catch (error) {
    console.error('Error generating text with Gemini API:', error);

    // エラー時はフォールバック文章を返す
    const texts = fallbackTexts[difficulty] || fallbackTexts.beginner;
    return texts[Math.floor(Math.random() * texts.length)];
  }
}
