/**
 * タイピング入力検証ロジック
 */

/**
 * 文字比較結果
 */
export interface CharacterResult {
  expected: string;
  actual: string;
  isCorrect: boolean;
}

/**
 * 2つの文字を比較する
 * @param expected 期待される文字
 * @param actual 実際に入力された文字
 * @returns 比較結果
 */
export function compareCharacters(expected: string, actual: string): CharacterResult {
  return {
    expected,
    actual,
    isCorrect: expected === actual,
  };
}

/**
 * 目標テキストと入力テキストを検証する
 * @param targetText 目標テキスト
 * @param typedText 入力されたテキスト
 * @returns 各文字の比較結果の配列
 */
export function validateInput(targetText: string, typedText: string): CharacterResult[] {
  // 空文字の場合は空配列を返す
  if (!targetText || !typedText) {
    return [];
  }

  // 短い方の長さまで比較
  const length = Math.min(targetText.length, typedText.length);
  const results: CharacterResult[] = [];

  for (let i = 0; i < length; i++) {
    results.push(compareCharacters(targetText[i], typedText[i]));
  }

  return results;
}
