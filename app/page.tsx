export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-8">
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          タイピングゲーム
        </h1>
        <p className="text-white/80 text-center">
          AI搭載タイピング練習アプリ
        </p>
      </div>
    </main>
  );
}
