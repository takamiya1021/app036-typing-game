'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { generateTypingText } from '@/app/actions/ai';
import { calculateWPM, calculateAccuracy } from '@/lib/typing/calculator';
import TypingArea from '@/components/TypingArea';
import GameStats from '@/components/GameStats';
import Timer from '@/components/Timer';
import DifficultySelector from '@/components/DifficultySelector';
import { KeyPress } from '@/lib/typing/analyzer';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export default function PracticePage() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [targetText, setTargetText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // 統計情報
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [characterCount, setCharacterCount] = useState(0);
  const [keyPresses, setKeyPresses] = useState<KeyPress[]>([]);

  // 文章生成
  const loadNewText = useCallback(async () => {
    setIsLoading(true);
    setIsCompleted(false);
    setTypedText('');
    setIsTimerActive(false);
    setStartTime(null);
    setCharacterCount(0);
    setWpm(0);
    setAccuracy(100);
    setKeyPresses([]);

    try {
      const text = await generateTypingText(difficulty, 'sentence');
      setTargetText(text);
    } catch (error) {
      console.error('Failed to generate text:', error);
      setTargetText('文章の生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, [difficulty]);

  // 初回ロード
  useEffect(() => {
    loadNewText();
  }, [loadNewText]);

  // タイピング変更時の処理
  const handleTypingChange = useCallback(
    (newTypedText: string, isCorrect: boolean) => {
      const previousLength = typedText.length;
      setTypedText(newTypedText);

      // 初回入力でタイマー開始
      if (!isTimerActive && newTypedText.length === 1) {
        setIsTimerActive(true);
        setStartTime(Date.now());
      }

      // 新しく入力されたキーを記録
      if (newTypedText.length > previousLength) {
        const newChar = newTypedText[previousLength];
        const expectedChar = targetText[previousLength];
        const keyPress: KeyPress = {
          key: newChar,
          timestamp: Date.now(),
          isCorrect: newChar === expectedChar,
        };
        setKeyPresses(prev => [...prev, keyPress]);
      }

      // 統計更新
      setCharacterCount(newTypedText.length);

      if (startTime && newTypedText.length > 0) {
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const currentWpm = calculateWPM(newTypedText.length, elapsedSeconds);
        setWpm(currentWpm);

        // 正確性の計算（簡易版）
        const correctChars = newTypedText.split('').filter((char, index) => {
          return char === targetText[index];
        }).length;
        const currentAccuracy = calculateAccuracy(correctChars, newTypedText.length);
        setAccuracy(currentAccuracy);
      }
    },
    [isTimerActive, startTime, targetText, typedText]
  );

  // タイピング完了時の処理
  const handleTypingComplete = useCallback(() => {
    setIsTimerActive(false);
    setIsCompleted(true);

    // 結果データを sessionStorage に保存
    sessionStorage.setItem('keyPresses', JSON.stringify(keyPresses));

    // 結果ページへ遷移
    const params = new URLSearchParams({
      wpm: wpm.toString(),
      accuracy: accuracy.toString(),
      characterCount: characterCount.toString(),
    });
    router.push(`/results?${params.toString()}`);
  }, [keyPresses, wpm, accuracy, characterCount, router]);

  // タイマー完了時の処理
  const handleTimerComplete = useCallback(() => {
    setIsTimerActive(false);
    setIsCompleted(true);

    // 結果データを sessionStorage に保存
    sessionStorage.setItem('keyPresses', JSON.stringify(keyPresses));

    // 結果ページへ遷移
    const params = new URLSearchParams({
      wpm: wpm.toString(),
      accuracy: accuracy.toString(),
      characterCount: characterCount.toString(),
    });
    router.push(`/results?${params.toString()}`);
  }, [keyPresses, wpm, accuracy, characterCount, router]);

  // 難易度変更時の処理
  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-8">
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-6xl w-full">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">タイピングゲーム</h1>
          <DifficultySelector selected={difficulty} onSelect={handleDifficultyChange} />
        </div>

        {/* 統計表示 */}
        <GameStats wpm={wpm} accuracy={accuracy} characterCount={characterCount} />

        {/* タイマー */}
        <div className="mb-8">
          <Timer
            duration={60}
            isActive={isTimerActive}
            onComplete={handleTimerComplete}
            label="残り時間"
          />
        </div>

        {/* タイピングエリア */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="text-2xl text-white/70">文章を生成中...</div>
          </div>
        ) : (
          <TypingArea
            targetText={targetText}
            onTypingChange={handleTypingChange}
            onTypingComplete={handleTypingComplete}
          />
        )}

        {/* 完了時のアクション */}
        {isCompleted && (
          <div className="mt-8 text-center">
            <button
              onClick={loadNewText}
              className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
            >
              もう一度挑戦
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
