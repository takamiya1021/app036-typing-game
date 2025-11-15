/**
 * KeyboardHeatmapコンポーネント
 * タイピング結果をキーボード上に視覚化して表示
 */
import React, { useState, useMemo } from 'react';
import { KeyStat } from '@/lib/typing/analyzer';
import {
  keyboardLayout,
  getKeyInfo,
  getKeyColor,
  getAllKeys,
} from '@/lib/utils/keyboard';

interface KeyboardHeatmapProps {
  keyStats: KeyStat[];
}

interface KeyData {
  key: string;
  accuracy: number;
  correctCount: number;
  missCount: number;
  averageTime: number;
  finger?: string;
  hand?: string;
}

const fingerNames: Record<string, string> = {
  thumb: '親指',
  index: '人差し指',
  middle: '中指',
  ring: '薬指',
  pinky: '小指',
};

const handNames: Record<string, string> = {
  left: '左手',
  right: '右手',
};

export default function KeyboardHeatmap({ keyStats }: KeyboardHeatmapProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  // キーごとのデータをマップに変換
  const keyDataMap = useMemo(() => {
    const map = new Map<string, KeyData>();

    keyStats.forEach(stat => {
      const totalCount = stat.correctCount + stat.missCount;
      const accuracy = totalCount > 0 ? (stat.correctCount / totalCount) * 100 : -1;

      map.set(stat.key, {
        key: stat.key,
        accuracy,
        correctCount: stat.correctCount,
        missCount: stat.missCount,
        averageTime: stat.averageTime,
        finger: fingerNames[stat.finger],
        hand: handNames[stat.hand],
      });
    });

    return map;
  }, [keyStats]);

  // キーコンポーネント
  const KeyButton = ({ keyChar }: { keyChar: string }) => {
    const keyData = keyDataMap.get(keyChar);
    const keyInfo = getKeyInfo(keyChar);
    const accuracy = keyData?.accuracy ?? -1;
    const backgroundColor = getKeyColor(accuracy);

    return (
      <div
        data-key={keyChar}
        className="relative inline-block m-0.5"
        onMouseEnter={() => setHoveredKey(keyChar)}
        onMouseLeave={() => setHoveredKey(null)}
      >
        <div
          className="w-12 h-12 flex items-center justify-center rounded border-2 border-gray-300 font-mono text-sm font-bold cursor-pointer transition-transform hover:scale-110"
          style={{ backgroundColor }}
        >
          {keyChar === ' ' ? 'Space' : keyChar.toUpperCase()}
        </div>

        {/* ツールチップ */}
        {hoveredKey === keyChar && (
          <div className="absolute z-10 bg-gray-900 text-white p-3 rounded shadow-lg text-xs whitespace-nowrap -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full">
            <div className="font-bold mb-2">
              キー: {keyChar === ' ' ? 'Space' : keyChar.toUpperCase()}
            </div>

            {keyData ? (
              <>
                <div>正答率: {accuracy.toFixed(0)}%</div>
                <div>
                  正解/ミス: {keyData.correctCount}/{keyData.missCount}
                </div>
                <div>平均時間: {keyData.averageTime.toFixed(0)}ms</div>
                {keyData.hand && <div>{keyData.hand}</div>}
                {keyData.finger && <div>{keyData.finger}</div>}
              </>
            ) : (
              <>
                <div>データなし</div>
                {keyInfo && (
                  <>
                    <div>{handNames[keyInfo.hand]}</div>
                    <div>{fingerNames[keyInfo.finger]}</div>
                  </>
                )}
              </>
            )}

            {/* 三角形の矢印 */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </div>
        )}
      </div>
    );
  };

  // キーボード行コンポーネント
  const KeyboardRow = ({ keys, rowNumber }: { keys: string[]; rowNumber: number }) => (
    <div
      data-testid={`keyboard-row-${rowNumber}`}
      className="flex justify-center mb-1"
      style={{ marginLeft: `${rowNumber * 0.5}rem` }}
    >
      {keys.map(key => (
        <KeyButton key={key} keyChar={key} />
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">キーボードヒートマップ</h3>

      {/* キーボード */}
      <div
        data-testid="keyboard-heatmap"
        className="bg-gray-100 p-4 rounded-lg inline-block"
      >
        <KeyboardRow keys={keyboardLayout.row1} rowNumber={1} />
        <KeyboardRow keys={keyboardLayout.row2} rowNumber={2} />
        <KeyboardRow keys={keyboardLayout.row3} rowNumber={3} />
        <KeyboardRow keys={keyboardLayout.row4} rowNumber={4} />
        <div className="flex justify-center mt-1">
          <KeyButton keyChar=" " />
        </div>
      </div>

      {/* 凡例 */}
      <div className="mt-6">
        <h4 className="text-sm font-bold text-gray-700 mb-2">凡例</h4>
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: getKeyColor(0) }}
            />
            <span>0% - 50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: getKeyColor(75) }}
            />
            <span>50% - 90%</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: getKeyColor(100) }}
            />
            <span>90% - 100%</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded border border-gray-300"
              style={{ backgroundColor: getKeyColor(-1) }}
            />
            <span>データなし</span>
          </div>
        </div>
      </div>
    </div>
  );
}
