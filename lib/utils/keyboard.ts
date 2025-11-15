/**
 * キーボードレイアウト定義
 * QWERTY配列のキーボードレイアウトと指割り当て
 */

export type Finger = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';
export type Hand = 'left' | 'right';

export interface KeyInfo {
  key: string;
  finger: Finger;
  hand: Hand;
  row: number;
  col: number;
}

/**
 * キーボードレイアウト定義（QWERTY配列）
 */
export const keyboardLayout = {
  row1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  row2: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  row3: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  row4: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  row5: [' '], // スペースバー
};

/**
 * キーごとの指割り当て定義
 */
const fingerAssignments: Record<string, { finger: Finger; hand: Hand }> = {
  // Row 1 (数字列)
  '1': { finger: 'pinky', hand: 'left' },
  '2': { finger: 'ring', hand: 'left' },
  '3': { finger: 'middle', hand: 'left' },
  '4': { finger: 'index', hand: 'left' },
  '5': { finger: 'index', hand: 'left' },
  '6': { finger: 'index', hand: 'right' },
  '7': { finger: 'index', hand: 'right' },
  '8': { finger: 'middle', hand: 'right' },
  '9': { finger: 'ring', hand: 'right' },
  '0': { finger: 'pinky', hand: 'right' },
  '-': { finger: 'pinky', hand: 'right' },
  '=': { finger: 'pinky', hand: 'right' },

  // Row 2 (QWERTY列)
  'q': { finger: 'pinky', hand: 'left' },
  'w': { finger: 'ring', hand: 'left' },
  'e': { finger: 'middle', hand: 'left' },
  'r': { finger: 'index', hand: 'left' },
  't': { finger: 'index', hand: 'left' },
  'y': { finger: 'index', hand: 'right' },
  'u': { finger: 'index', hand: 'right' },
  'i': { finger: 'middle', hand: 'right' },
  'o': { finger: 'ring', hand: 'right' },
  'p': { finger: 'pinky', hand: 'right' },
  '[': { finger: 'pinky', hand: 'right' },
  ']': { finger: 'pinky', hand: 'right' },

  // Row 3 (ホームロー)
  'a': { finger: 'pinky', hand: 'left' },
  's': { finger: 'ring', hand: 'left' },
  'd': { finger: 'middle', hand: 'left' },
  'f': { finger: 'index', hand: 'left' },
  'g': { finger: 'index', hand: 'left' },
  'h': { finger: 'index', hand: 'right' },
  'j': { finger: 'index', hand: 'right' },
  'k': { finger: 'middle', hand: 'right' },
  'l': { finger: 'ring', hand: 'right' },
  ';': { finger: 'pinky', hand: 'right' },
  "'": { finger: 'pinky', hand: 'right' },

  // Row 4 (下段)
  'z': { finger: 'pinky', hand: 'left' },
  'x': { finger: 'ring', hand: 'left' },
  'c': { finger: 'middle', hand: 'left' },
  'v': { finger: 'index', hand: 'left' },
  'b': { finger: 'index', hand: 'left' },
  'n': { finger: 'index', hand: 'right' },
  'm': { finger: 'middle', hand: 'right' },
  ',': { finger: 'middle', hand: 'right' },
  '.': { finger: 'ring', hand: 'right' },
  '/': { finger: 'pinky', hand: 'right' },

  // スペースバー
  ' ': { finger: 'thumb', hand: 'right' }, // 両手の親指だが、右手として扱う
};

/**
 * キーの位置（行・列）を取得
 */
export function getKeyPosition(key: string): { row: number; col: number } | null {
  const lowerKey = key.toLowerCase();

  // 各行を検索
  const rows = [
    keyboardLayout.row1,
    keyboardLayout.row2,
    keyboardLayout.row3,
    keyboardLayout.row4,
    keyboardLayout.row5,
  ];

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const colIndex = rows[rowIndex].indexOf(lowerKey);
    if (colIndex !== -1) {
      return { row: rowIndex + 1, col: colIndex };
    }
  }

  return null;
}

/**
 * キーの詳細情報（指割り当て、位置など）を取得
 */
export function getKeyInfo(key: string): KeyInfo | null {
  const lowerKey = key.toLowerCase();
  const position = getKeyPosition(lowerKey);
  const assignment = fingerAssignments[lowerKey];

  if (!position || !assignment) {
    return null;
  }

  return {
    key: lowerKey,
    finger: assignment.finger,
    hand: assignment.hand,
    row: position.row,
    col: position.col,
  };
}

/**
 * すべてのキーを取得（行順）
 */
export function getAllKeys(): string[] {
  return [
    ...keyboardLayout.row1,
    ...keyboardLayout.row2,
    ...keyboardLayout.row3,
    ...keyboardLayout.row4,
    ...keyboardLayout.row5,
  ];
}

/**
 * キーの色を計算（正誤率に基づく）
 * @param accuracy 正答率 (0-100)
 * @returns HSL色文字列
 */
export function getKeyColor(accuracy: number): string {
  if (accuracy === -1) {
    // データなし
    return 'hsl(0, 0%, 95%)'; // 薄いグレー
  }

  // 正答率に基づいて色相を計算
  // 0% (赤) → 50% (黄) → 100% (緑)
  // 色相: 0 (赤) → 60 (黄) → 120 (緑)
  const hue = (accuracy / 100) * 120;
  const saturation = 70;
  const lightness = 50;

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
