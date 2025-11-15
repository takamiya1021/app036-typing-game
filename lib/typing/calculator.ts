/**
 * タイピング統計計算ロジック
 */

/**
 * WPM（Words Per Minute）を計算する
 * @param characterCount 入力した文字数
 * @param durationInSeconds 入力にかかった時間（秒）
 * @returns WPM（整数）
 */
export function calculateWPM(characterCount: number, durationInSeconds: number): number {
  if (durationInSeconds === 0 || characterCount === 0) {
    return 0;
  }

  // 英語では平均的な単語は5文字と仮定
  // WPM = (文字数 / 5) / (秒数 / 60)
  const words = characterCount / 5;
  const minutes = durationInSeconds / 60;
  const wpm = words / minutes;

  return Math.round(wpm);
}

/**
 * 正確性（%）を計算する
 * @param correctCount 正解した文字数
 * @param totalCount 全体の文字数
 * @returns 正確性（0-100の整数）
 */
export function calculateAccuracy(correctCount: number, totalCount: number): number {
  if (totalCount === 0) {
    return 0;
  }

  const accuracy = (correctCount / totalCount) * 100;
  return Math.round(accuracy);
}

/**
 * タイピング速度（文字/秒）を計算する
 * @param characterCount 入力した文字数
 * @param durationInSeconds 入力にかかった時間（秒）
 * @returns 文字/秒（小数点以下2桁）
 */
export function calculateTypingSpeed(characterCount: number, durationInSeconds: number): number {
  if (durationInSeconds === 0 || characterCount === 0) {
    return 0;
  }

  const speed = characterCount / durationInSeconds;
  return Math.round(speed * 100) / 100; // 小数点以下2桁
}
