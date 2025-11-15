'use client';

import { useMemo } from 'react';

interface GameStatsProps {
  wpm: number;
  accuracy: number;
  characterCount: number;
}

export default function GameStats({ wpm, accuracy, characterCount }: GameStatsProps) {
  // 精度に基づいた色を決定
  const accuracyColor = useMemo(() => {
    if (accuracy >= 90) return 'text-green-500';
    if (accuracy >= 70) return 'text-yellow-500';
    return 'text-red-500';
  }, [accuracy]);

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      {/* WPM */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
        <div className="text-5xl font-bold text-white mb-2">{wpm}</div>
        <div className="text-sm text-white/70 uppercase tracking-wider">WPM</div>
      </div>

      {/* 正確性 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
        <div className={`text-5xl font-bold mb-2 ${accuracyColor}`}>{accuracy}%</div>
        <div className="text-sm text-white/70 uppercase tracking-wider">正確性</div>
      </div>

      {/* 文字数 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
        <div className="text-5xl font-bold text-white mb-2">{characterCount}</div>
        <div className="text-sm text-white/70 uppercase tracking-wider">文字</div>
      </div>
    </div>
  );
}
