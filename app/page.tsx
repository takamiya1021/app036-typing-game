import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-12 max-w-4xl w-full text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 md:mb-4">
          タイピングゲーム
        </h1>
        <p className="text-base md:text-xl text-white/80 mb-8 md:mb-12">
          AI搭載タイピング練習アプリ
        </p>

        <div className="space-y-4 md:space-y-6">
          <Link
            href="/practice"
            className="block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-lg text-lg md:text-xl transition-colors shadow-lg"
          >
            練習を始める
          </Link>

          <Link
            href="/history"
            className="block bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 md:px-8 rounded-lg transition-colors backdrop-blur-sm"
          >
            📈 履歴を見る
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 md:mt-16 border-t border-white/10 pt-8 md:pt-12">
            <div className="p-2">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4 bg-white/5 w-16 h-16 md:w-20 md:h-20 mx-auto flex items-center justify-center rounded-full shadow-inner border border-white/10">🤖</div>
              <h3 className="text-white font-bold mb-1 md:mb-2 text-base md:text-lg">AI文章生成</h3>
              <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                難易度に合わせた練習文章を<br className="hidden md:block" />AIが自動生成
              </p>
            </div>

            <div className="p-2">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4 bg-white/5 w-16 h-16 md:w-20 md:h-20 mx-auto flex items-center justify-center rounded-full shadow-inner border border-white/10">📊</div>
              <h3 className="text-white font-bold mb-1 md:mb-2 text-base md:text-lg">詳細な統計</h3>
              <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                WPM、正確性、<br className="hidden md:block" />キーごとの分析
              </p>
            </div>

            <div className="p-2">
              <div className="text-3xl md:text-4xl mb-3 md:mb-4 bg-white/5 w-16 h-16 md:w-20 md:h-20 mx-auto flex items-center justify-center rounded-full shadow-inner border border-white/10">⚡</div>
              <h3 className="text-white font-bold mb-1 md:mb-2 text-base md:text-lg">オフライン対応</h3>
              <p className="text-white/60 text-xs md:text-sm leading-relaxed">
                PWA対応で、<br className="hidden md:block" />どこでも練習可能
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
