# タイピングゲーム - AI搭載練習アプリ

[![Tests](https://img.shields.io/badge/tests-174%20passing-success)](https://github.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![PWA](https://img.shields.io/badge/PWA-enabled-purple)](https://web.dev/progressive-web-apps/)

AI（Google Gemini）を活用したタイピング練習アプリケーション。PWA対応により、オフラインでも利用可能です。

## ✨ 主な機能

### 🤖 AI文章生成
- Google Gemini APIによる練習文章の自動生成
- 難易度別（初級・中級・上級）の最適な文章提供

### 📊 詳細な統計・分析
- **WPM（Words Per Minute）**: タイピング速度の計測
- **正確性（Accuracy）**: 入力の正確さをパーセンテージで表示
- **キーごとの分析**: 各キーの正誤率、平均入力時間を集計
- **苦手キー検出**: ミス率の高いキーを自動検出

### 🎨 キーボードヒートマップ
- キーボードを視覚化し、各キーの正誤率を色分け表示
- ホバーで詳細な統計情報を表示
- 指と手の割り当て情報

### 💡 AIアドバイス
- タイピング結果をAIが分析し改善アドバイスを提供
- 苦手なキーに基づいたパーソナライズされたフィードバック

### 📈 履歴管理
- IndexedDBによるローカル保存
- 過去20件のプレイ記録を保持
- タイムスタンプ、スコア、難易度の一覧表示

### ⚡ PWA対応
- Service Workerによる完全なオフライン動作
- ホーム画面へのインストール可能

## 🛠️ 技術スタック

- **Next.js 14** (App Router)
- **React 18** / **TypeScript 5**
- **Tailwind CSS**
- **IndexedDB** (Dexie.js)
- **Google Gemini API**
- **Jest** + **React Testing Library**

## 📦 セットアップ

### 前提条件
- Node.js 18.x 以上

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/yourusername/app036-typing-game.git
cd app036-typing-game

# 依存関係をインストール
npm install

# 環境変数の設定
cp .env.local.example .env.local
# .env.localにGoogle Gemini API Keyを設定

# 開発サーバー起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### APIキーの取得
1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. 新しいAPIキーを作成
3. `.env.local`の`GOOGLE_GENERATIVE_AI_API_KEY`に設定

## 🧪 テスト

```bash
# テスト実行
npm test

# カバレッジレポート
npm test -- --coverage
```

**テスト状況**: 174テスト / 100%合格 / カバレッジ80%以上

## 📁 プロジェクト構造

```
app036-typing-game/
├── app/                      # Next.js App Router
│   ├── actions/ai.ts         # AI API Server Actions
│   ├── history/              # 履歴ページ
│   ├── practice/             # 練習ページ
│   └── results/              # 結果ページ
├── components/               # Reactコンポーネント
│   ├── AnalysisReport.tsx
│   ├── KeyboardHeatmap.tsx
│   ├── GameStats.tsx
│   └── ...
├── lib/
│   ├── db/                   # IndexedDB操作
│   ├── typing/               # タイピングロジック
│   └── utils/                # ユーティリティ
└── doc/                      # ドキュメント
```

## 📝 ドキュメント

- [要件定義書](doc/requirements.md)
- [技術設計書](doc/technical-design.md)
- [実装計画書](doc/implementation-plan.md)

## 📊 開発手法

**TDD（Test-Driven Development）**で実装
- Red → Green → Refactor サイクル
- Phase 0-8の段階的実装
- 全テストパス + カバレッジ80%以上

## 📄 ライセンス

MIT License
