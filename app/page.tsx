import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-8">
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-12 max-w-4xl w-full text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          タイピングゲーム
        </h1>
        <p className="text-xl text-white/80 mb-12">
          AI搭載タイピング練習アプリ
        </p>

        <div className="space-y-6">
          <Link
            href="/practice"
            className="block bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors shadow-lg"
          >
            練習を始める
          </Link>

          <Link
            href="/history"
            className="block bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg transition-colors backdrop-blur-sm"
          >
            📈 履歴を見る
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-white font-bold mb-2">AI文章生成</h3>
              <p className="text-white/70 text-sm">
                難易度に合わせた練習文章をAIが自動生成
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-white font-bold mb-2">詳細な統計</h3>
              <p className="text-white/70 text-sm">
                WPM、正確性、キーごとの分析
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-white font-bold mb-2">オフライン対応</h3>
              <p className="text-white/70 text-sm">
                PWA対応で、どこでも練習可能
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
