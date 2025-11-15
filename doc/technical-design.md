# タイピングゲーム - 技術設計書

## 技術スタック選択

### フロントエンド
- **Next.js 14.2.x**: App Router、Server Components 活用
- **React 18.x**: Hooks ベースの実装
- **TypeScript**: 型安全性確保
- **Tailwind CSS v3**: ユーティリティファーストCSS

**選択理由**:
- Next.js 14 の App Router により、PWA 対応が容易
- Server Actions で API ルートを簡潔に実装
- Tailwind CSS でレスポンシブデザインを効率的に実装

### AI 統合
- **Primary**: Google Gemini API（gemini-1.5-flash）
- **Fallback**: OpenAI API（gpt-4o-mini）

**選択理由**:
- Gemini Flash は高速・低コスト
- 文章生成タスクに最適
- OpenAI はフォールバック用

### データ管理
- **IndexedDB**: ローカルデータ永続化（Dexie.js 使用）
- **React Context**: グローバル状態管理

### PWA
- **Workbox**: Service Worker 管理（Next.js PWA プラグイン）
- **next-pwa**: Next.js 向け PWA 設定

---

## アーキテクチャ設計

### コンポーネント構成

```
app/
├── layout.tsx                    # ルートレイアウト
├── page.tsx                      # トップページ（モード選択）
├── practice/
│   └── page.tsx                  # 練習画面
├── results/
│   └── page.tsx                  # 結果・分析画面
├── history/
│   └── page.tsx                  # プレイ履歴
└── settings/
    └── page.tsx                  # 設定画面

components/
├── TypingArea.tsx                # タイピング入力エリア
├── GameStats.tsx                 # リアルタイム統計表示
├── Timer.tsx                     # タイマー表示
├── KeyboardHeatmap.tsx           # キーボード視覚化
├── AnalysisReport.tsx            # AI分析レポート
├── DifficultySelector.tsx        # 難易度選択
├── ModeSelector.tsx              # モード選択
└── ProgressChart.tsx             # 上達グラフ

lib/
├── ai/
│   ├── generateText.ts           # AI文章生成
│   └── analyzeTyping.ts          # AIタイピング分析
├── db/
│   ├── schema.ts                 # IndexedDB スキーマ
│   └── operations.ts             # CRUD 操作
├── typing/
│   ├── calculator.ts             # WPM等の計算
│   ├── analyzer.ts               # キー分析ロジック
│   └── validator.ts              # 入力検証
└── utils/
    ├── keyboard.ts               # キーボード定義
    └── constants.ts              # 定数定義
```

---

## データモデル設計

### 1. TypingSession（練習セッション）
```typescript
interface TypingSession {
  id: string;                     // UUID
  timestamp: number;              // 開始時刻（Unix time）
  mode: 'challenge' | 'completion'; // ゲームモード
  difficulty: 'beginner' | 'intermediate' | 'advanced'; // 難易度
  textType: 'random' | 'sentence' | 'programming'; // 文章タイプ
  targetText: string;             // 提示された文章
  typedText: string;              // 実際に入力された文字列
  duration: number;               // プレイ時間（秒）
  wpm: number;                    // Words Per Minute
  accuracy: number;               // 正確性（%）
  keyStats: KeyStat[];            // キーごとの統計
  aiAdvice: string;               // AIアドバイス
}
```

### 2. KeyStat（キー統計）
```typescript
interface KeyStat {
  key: string;                    // キー（例: 'a', 'Shift'）
  finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky'; // 使用する指
  hand: 'left' | 'right';         // 手
  correctCount: number;           // 正解回数
  missCount: number;              // ミス回数
  averageTime: number;            // 平均入力時間（ms）
}
```

### 3. UserSettings（ユーザー設定）
```typescript
interface UserSettings {
  darkMode: boolean;              // ダークモード
  soundEnabled: boolean;          // 効果音
  showKeyboard: boolean;          // キーボード表示
  aiProvider: 'gemini' | 'openai'; // AI プロバイダー
  offlineTextCache: string[];     // オフライン用文章キャッシュ
}
```

---

## AI API 統合設計

### 文章生成フロー

```
1. ユーザーが難易度・文章タイプを選択
   ↓
2. generateText() 関数を呼び出し
   ↓
3. AI API にプロンプト送信
   プロンプト例:
   「日本語の短文（30文字程度）を1つ生成してください。
   難易度: 初級、常用漢字のみ使用」
   ↓
4. 生成された文章を取得
   ↓
5. IndexedDB にキャッシュ保存（オフライン用）
   ↓
6. 練習画面に表示
```

### AI分析フロー

```
1. タイピング完了後、セッションデータを収集
   ↓
2. analyzeTyping() 関数を呼び出し
   ↓
3. AI API にプロンプト送信
   プロンプト例:
   「以下のタイピングデータを分析し、改善アドバイスを提供してください。
   - WPM: 45
   - 正確性: 92%
   - 苦手キー: 'p', 'q', ';'（左手薬指・小指）」
   ↓
4. AI アドバイスを取得
   ↓
5. 結果画面に表示
```

### API 実装（Server Actions）

**app/actions/ai.ts**
```typescript
'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateTypingText(
  difficulty: string,
  textType: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompts = {
    beginner: '日本語の短文（20-30文字）を生成してください。常用漢字のみ。',
    intermediate: '日本語の中文（40-60文字）を生成してください。記号を含む。',
    advanced: '日本語の長文（80-120文字）を生成してください。複雑な表現を含む。',
  };

  const result = await model.generateContent(prompts[difficulty]);
  return result.response.text();
}

export async function analyzeTypingPerformance(
  sessionData: TypingSession
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
タイピング練習の結果を分析し、具体的な改善アドバイスを提供してください。

【データ】
- WPM: ${sessionData.wpm}
- 正確性: ${sessionData.accuracy}%
- 苦手なキー: ${sessionData.keyStats
    .filter(k => k.missCount > 2)
    .map(k => k.key)
    .join(', ')}

【指示】
- 200文字程度で簡潔に
- 具体的な練習方法を提案
- ポジティブなトーンで
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

---

## IndexedDB スキーマ（Dexie.js）

**lib/db/schema.ts**
```typescript
import Dexie, { Table } from 'dexie';

export class TypingGameDB extends Dexie {
  sessions!: Table<TypingSession>;
  settings!: Table<UserSettings>;

  constructor() {
    super('TypingGameDB');
    this.version(1).stores({
      sessions: 'id, timestamp, difficulty, mode',
      settings: 'id',
    });
  }
}

export const db = new TypingGameDB();
```

---

## PWA 実装設計

### Service Worker 戦略

**キャッシュ戦略**:
- **App Shell**: Cache First（HTML、CSS、JS）
- **API レスポンス**: Network First → Cache Fallback
- **画像・アイコン**: Cache First

**next.config.js**
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // Next.js config
});
```

**public/manifest.json**
```json
{
  "name": "タイピングゲーム",
  "short_name": "タイピング",
  "description": "AI搭載タイピング練習アプリ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1e3a8a",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### オフライン対応

1. **文章キャッシュ**: AI生成文章を最大50件キャッシュ
2. **IndexedDB**: 全データローカル保存
3. **オフライン検出**: `navigator.onLine` で状態監視
4. **フォールバック**: オフライン時はキャッシュ文章を使用

---

## ファイル構成

```
app036-typing-game/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── practice/
│   ├── results/
│   ├── history/
│   ├── settings/
│   └── actions/
│       └── ai.ts
├── components/
│   ├── TypingArea.tsx
│   ├── GameStats.tsx
│   ├── Timer.tsx
│   ├── KeyboardHeatmap.tsx
│   ├── AnalysisReport.tsx
│   ├── DifficultySelector.tsx
│   ├── ModeSelector.tsx
│   └── ProgressChart.tsx
├── lib/
│   ├── ai/
│   ├── db/
│   ├── typing/
│   └── utils/
├── public/
│   ├── manifest.json
│   ├── icon-192.png
│   ├── icon-512.png
│   └── sw.js
├── styles/
│   └── globals.css
├── doc/
│   ├── requirements.md
│   ├── technical-design.md
│   └── implementation-plan.md
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## セキュリティ・パフォーマンス考慮

### セキュリティ
- ✅ API キー環境変数管理（`.env.local`）
- ✅ HTTPS 必須（PWA 要件）
- ✅ XSS 対策（React デフォルト）

### パフォーマンス
- ✅ キー入力イベントのデバウンス回避（ダイレクトハンドリング）
- ✅ AI API レスポンスのローディング UI
- ✅ IndexedDB の非同期操作
- ✅ Service Worker によるキャッシュ

---

## テスト戦略

### 単体テスト（Jest）
- `lib/typing/calculator.ts`: WPM 計算ロジック
- `lib/typing/analyzer.ts`: キー分析ロジック

### 統合テスト（React Testing Library）
- `TypingArea.tsx`: 入力・表示
- `GameStats.tsx`: 統計計算

### E2E テスト（Playwright）
- フル練習フロー
- オフライン動作確認

---

## 依存パッケージ

```json
{
  "dependencies": {
    "next": "14.2.x",
    "react": "18.x",
    "react-dom": "18.x",
    "@google/generative-ai": "^0.21.0",
    "dexie": "^4.0.0",
    "dexie-react-hooks": "^1.1.0",
    "next-pwa": "^5.6.0",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "tailwindcss": "^3.4.0",
    "eslint": "^8",
    "eslint-config-next": "14.2.x",
    "@playwright/test": "^1.40.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^14.0.0"
  }
}
```

---

## 実装優先順位

1. **Phase 0**: プロジェクトセットアップ、テスト環境構築
2. **Phase 1**: 基本タイピング機能（文章表示・入力・判定）
3. **Phase 2**: 統計・スコア計算
4. **Phase 3**: AI 文章生成
5. **Phase 4**: AI 分析・アドバイス
6. **Phase 5**: キーボードヒートマップ
7. **Phase 6**: PWA 対応
8. **Phase 7**: 履歴・グラフ機能

---

## 完了条件
- ✅ 全機能が要件定義書を満たす
- ✅ TDD で全テストパス
- ✅ PWA として完全動作（オフライン含む）
- ✅ Lighthouse スコア 90点以上
- ✅ AI 機能が正常動作
