'use server';

import { GoogleGenAI } from '@google/genai';

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
 * @param apiKey ユーザーが設定したAPIキー（オプション）
 * @returns 生成されたテキスト
 */
export async function generateTypingText(
  difficulty: string,
  textType: string,
  apiKey?: string
): Promise<string> {
  // APIキーの優先順位: ユーザー設定 > 環境変数
  const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

  // API キーが設定されていない場合はフォールバック
  if (!effectiveApiKey) {
    console.warn('GEMINI_API_KEY is not set. Using fallback text.');
    const texts = fallbackTexts[difficulty] || fallbackTexts.beginner;
    return texts[Math.floor(Math.random() * texts.length)];
  }

  try {
    const ai = new GoogleGenAI({ apiKey: effectiveApiKey });
    const prompt = generatePrompt(difficulty, textType);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';

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

/**
 * タイピング結果を分析してアドバイスを生成する
 * @param wpm Words Per Minute
 * @param accuracy 正確性（%）
 * @param weakKeys 苦手なキー（ミス率が高いキー）
 * @param apiKey ユーザーが設定したAPIキー（オプション）
 * @returns AIが生成したアドバイス
 */
export async function analyzeTypingPerformance(
  wpm: number,
  accuracy: number,
  weakKeys: string[],
  apiKey?: string
): Promise<string> {
  // APIキーの優先順位: ユーザー設定 > 環境変数
  const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

  // APIキーが設定されていない場合はフォールバックアドバイス
  if (!effectiveApiKey) {
    return generateFallbackAdvice(wpm, accuracy, weakKeys);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: effectiveApiKey });

    const prompt = `
タイピング練習の結果を分析し、具体的な改善アドバイスを提供してください。

【データ】
- WPM（1分あたりの単語数）: ${wpm}
- 正確性: ${accuracy}%
- 苦手なキー: ${weakKeys.length > 0 ? weakKeys.join(', ') : 'なし'}

【指示】
- 200文字程度で簡潔に
- 具体的な練習方法を提案
- ポジティブかつ建設的なトーンで
- 日本語で回答

重要: アドバイスのみを返してください。前置きや説明は不要です。
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const advice = (response.text || '').trim();

    return advice || generateFallbackAdvice(wpm, accuracy, weakKeys);
  } catch (error) {
    console.error('Error analyzing typing performance with Gemini API:', error);
    return generateFallbackAdvice(wpm, accuracy, weakKeys);
  }
}

/**
 * フォールバックアドバイスを生成
 */
function generateFallbackAdvice(wpm: number, accuracy: number, weakKeys: string[]): string {
  let advice = '';

  // WPMに基づくアドバイス
  if (wpm < 20) {
    advice += 'タイピング速度を上げるには、まず正確性を重視しましょう。スピードは自然とついてきます。';
  } else if (wpm < 40) {
    advice += '良いペースです。キーボードを見ずにタイピングする練習を続けましょう。';
  } else if (wpm < 60) {
    advice += 'かなり速いタイピングです。次は正確性を100%に近づけることを目指しましょう。';
  } else {
    advice += '素晴らしいタイピング速度です！このペースを維持しながら、さらに正確性を高めていきましょう。';
  }

  // 正確性に基づくアドバイス
  if (accuracy < 80) {
    advice += '\n\n正確性を向上させるため、急がず一文字一文字を確実に入力することを心がけてください。';
  } else if (accuracy < 95) {
    advice += '\n\n正確性は良好です。ミスを減らすため、特定のキーパターンに注意を払いましょう。';
  } else {
    advice += '\n\n非常に高い正確性です！この調子で練習を続けてください。';
  }

  // 苦手なキーに基づくアドバイス
  if (weakKeys.length > 0) {
    advice += `\n\n苦手なキー（${weakKeys.slice(0, 3).join(', ')}）は、単独で練習することで改善できます。`;
  }

  return advice;
}
