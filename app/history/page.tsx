'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecentSessions, clearSessions } from '@/lib/db/operations';
import { TypingSession } from '@/lib/db/schema';

const difficultyLabels = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級',
};

const modeLabels = {
  challenge: 'チャレンジ',
  completion: '完走',
};

function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'たった今';
  if (minutes < 60) return `${minutes}分前`;
  if (hours < 24) return `${hours}時間前`;
  if (days < 7) return `${days}日前`;

  // 1週間以上前は日付表示
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<TypingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getRecentSessions(20);
        setSessions(data);
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleClearHistory = async () => {
    if (sessions.length === 0 || isClearing) {
      return;
    }

    const confirmed = window.confirm('履歴をすべて削除しますか？この操作は元に戻せません。');
    if (!confirmed) return;

    setIsClearing(true);
    setErrorMessage(null);
    try {
      await clearSessions();
      setSessions([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
      setErrorMessage('履歴の削除に失敗しました。もう一度お試しください。');
    } finally {
      setIsClearing(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-8">
        <div className="text-2xl text-white">読み込み中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">タイピング履歴</h1>
          <p className="text-white/70">過去のプレイ記録を確認できます</p>
          {sessions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleClearHistory}
                disabled={isClearing}
                className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
                  isClearing
                    ? 'bg-red-400/40 text-white/70 cursor-not-allowed'
                    : 'bg-red-500/80 hover:bg-red-600 text-white'
                }`}
              >
                履歴を削除
              </button>
              {isClearing && (
                <span className="text-white/70 text-sm">削除中...</span>
              )}
            </div>
          )}
          {errorMessage && (
            <p className="mt-3 text-red-300 text-sm">{errorMessage}</p>
          )}
        </div>

        {/* 履歴リスト */}
        {sessions.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-12 text-center">
            <p className="text-xl text-white/70 mb-6">履歴がありません</p>
            <Link
              href="/practice"
              className="inline-block px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
            >
              練習を始める
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white/5 backdrop-blur-lg rounded-xl shadow-xl p-6 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  {/* 左側: 統計情報 */}
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {session.wpm}
                      </div>
                      <div className="text-sm text-white/60">WPM</div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {session.accuracy}%
                      </div>
                      <div className="text-sm text-white/60">正確性</div>
                    </div>

                    <div className="text-left">
                      <div className="text-white font-medium">
                        {difficultyLabels[session.difficulty]} ·{' '}
                        {modeLabels[session.mode]}
                      </div>
                      <div className="text-sm text-white/60">
                        {session.duration}秒
                      </div>
                    </div>
                  </div>

                  {/* 右側: タイムスタンプ */}
                  <div className="text-right">
                    <div className="text-white/70 text-sm">
                      {formatTimestamp(session.timestamp)}
                    </div>
                  </div>
                </div>

                {/* AIアドバイス（あれば表示） */}
                {session.aiAdvice && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-sm text-white/80">
                      💡 {session.aiAdvice}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ナビゲーションボタン */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/practice"
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
          >
            練習する
          </Link>
          <Link
            href="/"
            className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors backdrop-blur-sm"
          >
            ホームへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
