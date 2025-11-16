'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateTypingText } from '@/app/actions/ai';
import { calculateWPM, calculateAccuracy } from '@/lib/typing/calculator';
import { getApiKey } from '@/lib/api-key';
import TypingArea from '@/components/TypingArea';
import GameStats from '@/components/GameStats';
import Timer from '@/components/Timer';
import DifficultySelector from '@/components/DifficultySelector';
import ApiKeyModal from '@/components/ApiKeyModal';
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
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasUserApiKey, setHasUserApiKey] = useState(false);

  // 統計情報
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [keyPresses, setKeyPresses] = useState<KeyPress[]>([]);

  // useRefで常に最新のkeyPressesを保持（状態更新の非同期問題を回避）
  const keyPressesRef = useRef<KeyPress[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const lastLoadedDifficultyRef = useRef<Difficulty | null>(null);

  // 文章生成
  const loadNewText = useCallback(async () => {
    setIsLoading(true);
    setIsCompleted(false);
    setTypedText('');
    setIsTimerActive(false);
    setStartTime(null);
    setCharacterCount(0);
    setWpm(0);
    setAccuracy(0);
    setKeyPresses([]);
    keyPressesRef.current = []; // Refもリセット
    startTimeRef.current = null;

    try {
      // ユーザーが設定したAPIキーを取得
      const userApiKey = getApiKey();
      setHasUserApiKey(!!userApiKey);
      const text = await generateTypingText(difficulty, 'sentence', userApiKey || undefined);
      setTargetText(text);
    } catch (error) {
      console.error('Failed to generate text:', error);
      setTargetText('文章の生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, [difficulty]);

  // 初回ロードおよび難易度変更時のロード
  useEffect(() => {
    if (lastLoadedDifficultyRef.current === difficulty) {
      return;
    }
    lastLoadedDifficultyRef.current = difficulty;
    loadNewText();
  }, [difficulty, loadNewText]);

  const startSessionIfNeeded = useCallback(() => {
    if (!startTimeRef.current) {
      const now = Date.now();
      startTimeRef.current = now;
      setStartTime(now);
    }
    if (!isTimerActive) {
      setIsTimerActive(true);
    }
  }, [isTimerActive]);

  // キー押下時の処理（物理的なキー入力を記録）
  const handleKeyPress = useCallback(
    (key: string, timestamp: number) => {
      // Backspaceキーの場合、直前のキー押下をミスとしてマーク
      if (key === 'Backspace' && keyPressesRef.current.length > 0) {
        const lastIndex = keyPressesRef.current.length - 1;
        if (lastIndex >= 0) {
          // 直前のキー押下をミスとしてマーク
          keyPressesRef.current[lastIndex] = {
            ...keyPressesRef.current[lastIndex],
            isCorrect: false,
          };
          setKeyPresses([...keyPressesRef.current]);
        }
        // Backspace自体は記録しない（統計に含めない）
        return;
      }

      // キー押下を記録
      const keyPress: KeyPress = {
        key: key,
        timestamp: timestamp,
        isCorrect: true, // 初期値として正しいと仮定（Backspaceで遡って修正）
      };

      // Refに追加（同期的に更新）
      keyPressesRef.current = [...keyPressesRef.current, keyPress];
      // Stateも更新（表示用）
      setKeyPresses(keyPressesRef.current);
    },
    []
  );

  // タイピング変更時の処理
  const handleTypingChange = useCallback(
    (newTypedText: string, _isCorrect: boolean) => {
      setTypedText(newTypedText);

      // 統計更新
      setCharacterCount(newTypedText.length);

      if (newTypedText.length === 0) {
        setWpm(0);
        setAccuracy(0);
        return;
      }

      startSessionIfNeeded();

      const sessionStart = startTimeRef.current ?? Date.now();
      const elapsedSeconds = (Date.now() - sessionStart) / 1000;
      const currentWpm = calculateWPM(newTypedText.length, elapsedSeconds);
      setWpm(currentWpm);

      // 正確性の計算（簡易版）
      const correctChars = newTypedText.split('').filter((char, index) => {
        return char === targetText[index];
      }).length;
      const currentAccuracy = calculateAccuracy(correctChars, newTypedText.length);
      setAccuracy(currentAccuracy);
    },
    [startSessionIfNeeded, targetText]
  );

  // タイピング完了時の処理
  const handleTypingComplete = useCallback(() => {
    setIsTimerActive(false);
    setIsCompleted(true);

    // 結果データを sessionStorage に保存（Refから最新の値を使用）
    sessionStorage.setItem('keyPresses', JSON.stringify(keyPressesRef.current));

    // プレイ時間を計算
    const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    // 結果ページへ遷移
    const params = new URLSearchParams({
      wpm: wpm.toString(),
      accuracy: accuracy.toString(),
      characterCount: characterCount.toString(),
      mode: 'challenge',
      difficulty: difficulty,
      textType: 'sentence',
      targetText: targetText,
      typedText: typedText,
      duration: duration.toString(),
    });
    router.push(`/results?${params.toString()}`);
  }, [wpm, accuracy, characterCount, difficulty, targetText, typedText, startTime, router]);

  // タイマー完了時の処理
  const handleTimerComplete = useCallback(() => {
    setIsTimerActive(false);
    setIsCompleted(true);

    // 結果データを sessionStorage に保存（Refから最新の値を使用）
    sessionStorage.setItem('keyPresses', JSON.stringify(keyPressesRef.current));

    // プレイ時間を計算
    const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

    // 結果ページへ遷移
    const params = new URLSearchParams({
      wpm: wpm.toString(),
      accuracy: accuracy.toString(),
      characterCount: characterCount.toString(),
      mode: 'challenge',
      difficulty: difficulty,
      textType: 'sentence',
      targetText: targetText,
      typedText: typedText,
      duration: duration.toString(),
    });
    router.push(`/results?${params.toString()}`);
  }, [wpm, accuracy, characterCount, difficulty, targetText, typedText, startTime, router]);

  // 難易度変更時の処理
  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-8">
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-6xl w-full">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm"
              title="ホームへ戻る"
            >
              ← ホーム
            </Link>
            <h1 className="text-4xl font-bold text-white">タイピングゲーム</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors backdrop-blur-sm flex items-center gap-2"
              title="APIキー設定"
            >
              🔑 AI設定
            </button>
            <DifficultySelector selected={difficulty} onSelect={handleDifficultyChange} />
          </div>
        </div>

        {/* 統計表示 */}
        <GameStats wpm={wpm} accuracy={accuracy} characterCount={characterCount} />

        {/* APIキー未設定警告 */}
        {!hasUserApiKey && (
          <div className="mb-6 bg-red-500/10 border border-red-500 rounded-lg p-4">
            <p className="text-red-500 text-center font-medium">
              ⚠️ APIキーが設定されていません。デフォルトの内容で回答しています。
            </p>
          </div>
        )}

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
            onKeyPress={handleKeyPress}
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

      {/* APIキー設定モーダル */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </main>
  );
}
