'use client';

import { useState, useEffect, useCallback } from 'react';

interface TimerProps {
  duration: number; // 秒
  onComplete: () => void;
  isActive?: boolean;
  label?: string;
}

export default function Timer({
  duration,
  onComplete,
  isActive = false,
  label,
}: TimerProps) {
  const [remainingTime, setRemainingTime] = useState(duration);

  // durationが変更されたらリセット
  useEffect(() => {
    setRemainingTime(duration);
  }, [duration]);

  // タイマーのカウントダウン
  useEffect(() => {
    if (!isActive || remainingTime <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          onComplete();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isActive, remainingTime, onComplete]);

  // 時間をMM:SS形式にフォーマット
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  return (
    <div className="text-center">
      {label && (
        <div className="text-sm text-white/70 uppercase tracking-wider mb-2">
          {label}
        </div>
      )}
      <div className="text-3xl font-bold text-white font-mono">
        {formatTime(remainingTime)}
      </div>
    </div>
  );
}
