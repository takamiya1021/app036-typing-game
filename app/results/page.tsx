'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AnalysisReport from '@/components/AnalysisReport';
import KeyboardHeatmap from '@/components/KeyboardHeatmap';
import { analyzeTypingPerformance } from '@/app/actions/ai';
import { analyzeKeyStats, KeyStat } from '@/lib/typing/analyzer';
import { saveSession } from '@/lib/db/operations';
import { getApiKey } from '@/lib/api-key';
import Link from 'next/link';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL パラメータから結果を取得
  const wpm = parseInt(searchParams.get('wpm') || '0', 10);
  const accuracy = parseInt(searchParams.get('accuracy') || '0', 10);
  const characterCount = parseInt(searchParams.get('characterCount') || '0', 10);
  const mode = searchParams.get('mode') as 'challenge' | 'completion' || 'challenge';
  const difficulty = searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced' || 'beginner';
  const textType = searchParams.get('textType') as 'random' | 'sentence' | 'programming' || 'sentence';
  const targetText = searchParams.get('targetText') || '';
  const typedText = searchParams.get('typedText') || '';
  const duration = parseInt(searchParams.get('duration') || '0', 10);
  const hasInputData = characterCount > 0 && typedText.length > 0;

  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [keyStats, setKeyStats] = useState<KeyStat[]>([]);
  const [hasUserApiKey, setHasUserApiKey] = useState(false);

  useEffect(() => {
    // ブラウザ環境でのみsessionStorageにアクセス
    if (typeof window === 'undefined') return;

    // sessionStorage からキー押下データを取得
    const keyPressesData = sessionStorage.getItem('keyPresses');
    const keyPresses = keyPressesData ? JSON.parse(keyPressesData) : [];

    // キー統計を分析
    const stats = analyzeKeyStats(keyPresses);
    setKeyStats(stats);

    const userApiKey = getApiKey();
    setHasUserApiKey(!!userApiKey);

    if (!hasInputData) {
      setAiAdvice('入力データが記録されていません。タイピングを行ってから結果を確認してください。');
      setIsAnalyzing(false);
      return;
    }

    // 苦手なキーを抽出（ミス率が30%以上のキー）
    const weakKeys = stats
      .filter(stat => {
        const totalPresses = stat.correctCount + stat.missCount;
        const missRate = totalPresses > 0 ? stat.missCount / totalPresses : 0;
        return missRate > 0.3;
      })
      .map(stat => stat.key)
      .slice(0, 5);

    // AIアドバイスを生成してセッションを保存
    const generateAdvice = async () => {
      try {
        const advice = await analyzeTypingPerformance(wpm, accuracy, weakKeys, userApiKey || undefined);
        setAiAdvice(advice);

        // セッションをIndexedDBに保存
        await saveSession({
          timestamp: Date.now(),
          mode,
          difficulty,
          textType,
          targetText,
          typedText,
          duration,
          wpm,
          accuracy,
          keyStats: stats,
          aiAdvice: advice,
        });
      } catch (error) {
        console.error('Failed to generate AI advice:', error);
        setAiAdvice('アドバイスの生成に失敗しました。');

        // エラーの場合でもセッションを保存（アドバイスなし）
        try {
          await saveSession({
            timestamp: Date.now(),
            mode,
            difficulty,
            textType,
            targetText,
            typedText,
            duration,
            wpm,
            accuracy,
            keyStats: stats,
            aiAdvice: '',
          });
        } catch (saveError) {
          console.error('Failed to save session:', saveError);
        }
      } finally {
        setIsAnalyzing(false);
      }
    };

    generateAdvice();
  }, [hasInputData, wpm, accuracy, mode, difficulty, textType, targetText, typedText, duration]);

  // データがない場合は練習ページへリダイレクト
  useEffect(() => {
    if (!wpm && !accuracy && !characterCount) {
      router.push('/practice');
    }
  }, [wpm, accuracy, characterCount, router]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-4 md:p-8 max-w-4xl w-full">
        {/* ヘッダー */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">タイピング結果</h1>
          <p className="text-white/70 text-sm md:text-base">お疲れ様でした！</p>
        </div>

        {/* APIキー未設定警告 */}
        {!hasUserApiKey && (
          <div className="mb-6 bg-red-500/10 border border-red-500 rounded-lg p-4">
            <p className="text-red-500 text-center font-medium text-sm md:text-base">
              ⚠️ APIキーが設定されていません。デフォルトの内容で回答しています。
            </p>
          </div>
        )}

        {/* 分析レポート */}
        <div className="mb-6 md:mb-8">
          <AnalysisReport
            wpm={wpm}
            accuracy={accuracy}
            characterCount={characterCount}
            aiAdvice={isAnalyzing ? '' : aiAdvice}
          />
        </div>

        {/* キーボードヒートマップ */}
        <div className="mb-6 md:mb-8 overflow-hidden">
          <KeyboardHeatmap keyStats={keyStats} />
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            href="/practice"
            className="px-8 py-3 md:py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors text-center"
          >
            もう一度挑戦
          </Link>
          <Link
            href="/"
            className="px-8 py-3 md:py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors backdrop-blur-sm text-center"
          >
            ホームへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-8">
          <div className="text-2xl text-white">読み込み中...</div>
        </main>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
