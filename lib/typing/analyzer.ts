/**
 * タイピングキー分析ロジック
 */

/**
 * キー押下情報
 */
export interface KeyPress {
  key: string;
  timestamp: number;
  isCorrect: boolean;
}

/**
 * キーごとの統計情報
 */
export interface KeyStat {
  key: string;
  finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
  hand: 'left' | 'right';
  correctCount: number;
  missCount: number;
  averageTime: number;
}

/**
 * タイピングセッション情報
 */
export interface TypingSession {
  targetText: string;
  typedText: string;
  duration: number;
  wpm: number;
  accuracy: number;
  keyStats: KeyStat[];
}

/**
 * キーと指のマッピング
 */
const keyToFingerMap: Record<string, { finger: KeyStat['finger']; hand: KeyStat['hand'] }> = {
  // 左手
  '`': { finger: 'pinky', hand: 'left' },
  '1': { finger: 'pinky', hand: 'left' },
  'q': { finger: 'pinky', hand: 'left' },
  'a': { finger: 'pinky', hand: 'left' },
  'z': { finger: 'pinky', hand: 'left' },

  '2': { finger: 'ring', hand: 'left' },
  'w': { finger: 'ring', hand: 'left' },
  's': { finger: 'ring', hand: 'left' },
  'x': { finger: 'ring', hand: 'left' },

  '3': { finger: 'middle', hand: 'left' },
  'e': { finger: 'middle', hand: 'left' },
  'd': { finger: 'middle', hand: 'left' },
  'c': { finger: 'middle', hand: 'left' },

  '4': { finger: 'index', hand: 'left' },
  '5': { finger: 'index', hand: 'left' },
  'r': { finger: 'index', hand: 'left' },
  't': { finger: 'index', hand: 'left' },
  'f': { finger: 'index', hand: 'left' },
  'g': { finger: 'index', hand: 'left' },
  'v': { finger: 'index', hand: 'left' },
  'b': { finger: 'index', hand: 'left' },

  // 右手
  '6': { finger: 'index', hand: 'right' },
  '7': { finger: 'index', hand: 'right' },
  'y': { finger: 'index', hand: 'right' },
  'u': { finger: 'index', hand: 'right' },
  'h': { finger: 'index', hand: 'right' },
  'j': { finger: 'index', hand: 'right' },
  'n': { finger: 'index', hand: 'right' },
  'm': { finger: 'index', hand: 'right' },

  '8': { finger: 'middle', hand: 'right' },
  'i': { finger: 'middle', hand: 'right' },
  'k': { finger: 'middle', hand: 'right' },
  ',': { finger: 'middle', hand: 'right' },

  '9': { finger: 'ring', hand: 'right' },
  'o': { finger: 'ring', hand: 'right' },
  'l': { finger: 'ring', hand: 'right' },
  '.': { finger: 'ring', hand: 'right' },

  '0': { finger: 'pinky', hand: 'right' },
  '-': { finger: 'pinky', hand: 'right' },
  '=': { finger: 'pinky', hand: 'right' },
  'p': { finger: 'pinky', hand: 'right' },
  '[': { finger: 'pinky', hand: 'right' },
  ']': { finger: 'pinky', hand: 'right' },
  ';': { finger: 'pinky', hand: 'right' },
  "'": { finger: 'pinky', hand: 'right' },
  '/': { finger: 'pinky', hand: 'right' },
};

/**
 * キーから指と手を推定
 */
function getFingerAndHand(key: string): { finger: KeyStat['finger']; hand: KeyStat['hand'] } {
  const lowerKey = key.toLowerCase();

  if (keyToFingerMap[lowerKey]) {
    return keyToFingerMap[lowerKey];
  }

  // 日本語などのマッピングされていないキーはデフォルト値
  return { finger: 'index', hand: 'left' };
}

/**
 * キー押下データから統計を分析
 */
export function analyzeKeyStats(keyPresses: KeyPress[]): KeyStat[] {
  if (keyPresses.length === 0) {
    return [];
  }

  // キーごとに集計
  const keyMap = new Map<string, {
    correctCount: number;
    missCount: number;
    times: number[];
  }>();

  keyPresses.forEach((press, index) => {
    const existing = keyMap.get(press.key) || {
      correctCount: 0,
      missCount: 0,
      times: [],
    };

    if (press.isCorrect) {
      existing.correctCount++;
    } else {
      existing.missCount++;
    }

    // 前回のキー押下からの時間差を計算
    if (index > 0) {
      const timeDiff = press.timestamp - keyPresses[index - 1].timestamp;
      existing.times.push(timeDiff);
    }

    keyMap.set(press.key, existing);
  });

  // KeyStatの配列に変換
  const stats: KeyStat[] = [];

  keyMap.forEach((value, key) => {
    const { finger, hand } = getFingerAndHand(key);
    const averageTime = value.times.length > 0
      ? value.times.reduce((sum, t) => sum + t, 0) / value.times.length
      : 0;

    stats.push({
      key,
      finger,
      hand,
      correctCount: value.correctCount,
      missCount: value.missCount,
      averageTime: Math.round(averageTime),
    });
  });

  return stats;
}

/**
 * 苦手なキーを特定（ミス率が高いキー）
 */
export function identifyWeakKeys(keyStats: KeyStat[], threshold: number = 0.3): KeyStat[] {
  return keyStats.filter(stat => {
    const total = stat.correctCount + stat.missCount;
    if (total === 0) return false;

    const missRate = stat.missCount / total;
    return missRate >= threshold;
  });
}
