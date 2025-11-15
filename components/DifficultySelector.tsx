'use client';

import { useMemo } from 'react';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

interface DifficultySelectorProps {
  selected: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
}

interface DifficultyOption {
  value: Difficulty;
  label: string;
  color: string;
}

export default function DifficultySelector({
  selected,
  onSelect,
}: DifficultySelectorProps) {
  const difficulties: DifficultyOption[] = useMemo(
    () => [
      { value: 'beginner', label: '初級', color: 'bg-green-500' },
      { value: 'intermediate', label: '中級', color: 'bg-blue-500' },
      { value: 'advanced', label: '上級', color: 'bg-red-500' },
    ],
    []
  );

  return (
    <div className="flex gap-4 justify-center mb-6">
      {difficulties.map((difficulty) => (
        <button
          key={difficulty.value}
          type="button"
          onClick={() => onSelect(difficulty.value)}
          className={`
            px-6 py-3 rounded-lg font-bold text-white transition-all
            ${
              selected === difficulty.value
                ? `${difficulty.color} scale-110 shadow-lg`
                : 'bg-white/10 hover:bg-white/20'
            }
          `}
        >
          {difficulty.label}
        </button>
      ))}
    </div>
  );
}
