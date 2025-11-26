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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      {/* WPM */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center flex flex-row md:flex-col items-center justify-between md:justify-center">
        <div className="text-sm text-white/70 uppercase tracking-wider order-2 md:order-1">WPM</div>
        <div className="text-3xl md:text-5xl font-bold text-white mb-0 md:mb-2 order-1 md:order-2">{wpm}</div>
      </div>

      {/* 正確性 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center flex flex-row md:flex-col items-center justify-between md:justify-center">
        <div className="text-sm text-white/70 uppercase tracking-wider order-2 md:order-1">正確性</div>
        <div className={`text-3xl md:text-5xl font-bold mb-0 md:mb-2 order-1 md:order-2 ${accuracyColor}`}>{accuracy}%</div>
      </div>

      {/* 文字数 */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 md:p-6 text-center flex flex-row md:flex-col items-center justify-between md:justify-center">
        <div className="text-sm text-white/70 uppercase tracking-wider order-2 md:order-1">文字</div>
        <div className="text-3xl md:text-5xl font-bold text-white mb-0 md:mb-2 order-1 md:order-2">{characterCount}</div>
      </div>
    </div>
  );
}
