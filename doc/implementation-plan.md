# タイピングゲーム - 実装計画書（TDD準拠版）

## 実装方針
- **TDDサイクル**: 全Phaseで Red → Green → Refactor を厳守
- **テストファースト**: 実装前に必ずテストを書く
- **段階的実装**: Phase単位で完結させ、都度コミット
- **完了条件**: 全テストパス + コードカバレッジ80%以上

---

## Phase 0: プロジェクトセットアップ・テスト環境構築（予定工数: 2時間）

### 目的
開発環境とテスト基盤を整備し、TDD開発の土台を構築する。

### タスク

- [ ] **Next.js プロジェクト作成（Red）**
  - `npx create-next-app@14 . --typescript --tailwind --app --no-src-dir`
  - 初期設定確認テスト作成（ビルド成功確認）

- [ ] **テストライブラリセットアップ（Green）**
  - Jest + React Testing Library インストール
  - `jest.config.js` 設定
  - `setupTests.ts` 作成
  - 動作確認用ダミーテスト実装

- [ ] **E2Eテスト環境構築（Refactor）**
  - Playwright インストール・設定
  - `playwright.config.ts` 作成
  - サンプルE2Eテスト作成

- [ ] **PWA基盤セットアップ**
  - `next-pwa` インストール
  - `next.config.js` PWA設定
  - `manifest.json` 作成

- [ ] **環境変数設定**
  - `.env.local.example` 作成
  - API キー管理構造確認

### 完了条件
- ✅ `npm run dev` でサーバー起動
- ✅ `npm test` でテスト実行可能
- ✅ `npm run test:e2e` でE2Eテスト実行可能

---

## Phase 1: 基本タイピング機能（予定工数: 6時間）

### 目的
文章表示・キー入力・正誤判定の基本機能を実装する。

### タスク

- [ ] **タイピングロジックテスト作成（Red）**
  - `lib/typing/validator.ts` のテスト作成
  - 正誤判定ロジックのテストケース定義
  - エッジケース（空文字、特殊文字）テスト

- [ ] **タイピングロジック実装（Green）**
  - `lib/typing/validator.ts` 実装
  - `validateInput()` 関数実装
  - `compareCharacters()` 関数実装
  - テストが全てパスすることを確認

- [ ] **TypingAreaコンポーネントテスト作成（Red）**
  - `components/TypingArea.test.tsx` 作成
  - 文字入力イベントテスト
  - 正誤表示テスト

- [ ] **TypingAreaコンポーネント実装（Green）**
  - `components/TypingArea.tsx` 実装
  - キーボードイベントハンドリング
  - リアルタイム正誤表示
  - Tailwind CSS スタイリング

- [ ] **リファクタリング（Refactor）**
  - コンポーネント分割（表示部分・ロジック部分）
  - パフォーマンス最適化（メモ化）
  - コード整理・命名改善

### 完了条件
- ✅ 文字入力に対して即座に正誤判定
- ✅ 正解文字が緑、誤り文字が赤で表示
- ✅ 単体テスト・コンポーネントテスト全パス

---

## Phase 2: 統計・スコア計算機能（予定工数: 5時間）

### 目的
WPM、正確性、タイピング時間などの統計を計算・表示する。

### タスク

- [ ] **統計計算ロジックテスト作成（Red）**
  - `lib/typing/calculator.ts` のテスト作成
  - `calculateWPM()` テストケース
  - `calculateAccuracy()` テストケース
  - エッジケース（0文字、100%正確、0%正確）

- [ ] **統計計算ロジック実装（Green）**
  - `lib/typing/calculator.ts` 実装
  - WPM計算式実装
  - 正確性計算式実装
  - テスト全パス確認

- [ ] **GameStatsコンポーネントテスト作成（Red）**
  - `components/GameStats.test.tsx` 作成
  - リアルタイム統計表示テスト
  - 更新タイミングテスト

- [ ] **GameStatsコンポーネント実装（Green）**
  - `components/GameStats.tsx` 実装
  - WPM、正確性、文字数の表示
  - リアルタイム更新機能

- [ ] **Timerコンポーネント（Red → Green → Refactor）**
  - テスト作成 → 実装 → リファクタリング
  - カウントダウン機能
  - 終了イベント発火

### 完了条件
- ✅ WPM・正確性が正しく計算される
- ✅ リアルタイムで統計が更新される
- ✅ タイマーが正確に動作
- ✅ 全テストパス

---

## Phase 3: AI文章生成機能（予定工数: 4時間）

### 目的
Google Gemini API を使用した練習文章の自動生成機能を実装する。

### タスク

- [ ] **AI生成ロジックテスト作成（Red）**
  - `lib/ai/generateText.test.ts` 作成
  - モックAPIレスポンステスト
  - エラーハンドリングテスト

- [ ] **Server Action実装（Green）**
  - `app/actions/ai.ts` 作成
  - `generateTypingText()` 実装
  - 難易度別プロンプト定義
  - エラーハンドリング実装

- [ ] **DifficultySelector実装（Red → Green → Refactor）**
  - `components/DifficultySelector.tsx` テスト・実装
  - 難易度選択UI
  - 選択状態管理

- [ ] **文章生成フロー統合テスト（E2E）**
  - Playwright E2Eテスト作成
  - 難易度選択 → 文章生成 → 表示フロー確認

- [ ] **リファクタリング（Refactor）**
  - エラーハンドリング強化
  - ローディングUI改善
  - キャッシュ戦略検討

### 完了条件
- ✅ AI API から文章が生成される
- ✅ 難易度別に適切な文章が生成される
- ✅ エラー時のフォールバック動作
- ✅ E2Eテストパス

---

## Phase 4: AI分析・アドバイス機能（予定工数: 5時間）

### 目的
プレイ後のタイピングデータを AI で分析し、改善アドバイスを提供する。

### タスク

- [ ] **キー分析ロジックテスト作成（Red）**
  - `lib/typing/analyzer.ts` のテスト作成
  - キーごとの統計集計テスト
  - 苦手キー検出ロジックテスト

- [ ] **キー分析ロジック実装（Green）**
  - `lib/typing/analyzer.ts` 実装
  - `KeyStat` データ構造実装
  - 苦手キー検出アルゴリズム

- [ ] **AI分析Server Action実装（Red → Green）**
  - `analyzeTypingPerformance()` テスト・実装
  - プロンプト設計
  - レスポンスパース処理

- [ ] **AnalysisReportコンポーネント実装（Red → Green → Refactor）**
  - `components/AnalysisReport.tsx` テスト・実装
  - AIアドバイス表示
  - 統計サマリー表示

- [ ] **結果画面実装（E2E）**
  - `app/results/page.tsx` 実装
  - E2Eテスト作成（練習完了 → 結果表示フロー）

### 完了条件
- ✅ 各キーの統計が正確に集計される
- ✅ AI が適切なアドバイスを生成
- ✅ 結果画面が見やすく表示
- ✅ 全テストパス

---

## Phase 5: キーボードヒートマップ機能（予定工数: 4時間）

### 目的
キーボードを視覚化し、各キーの正誤率を色分け表示する。

### タスク

- [ ] **キーボードレイアウト定義テスト作成（Red）**
  - `lib/utils/keyboard.ts` のテスト作成
  - キー配置定義テスト
  - 指割り当てテスト

- [ ] **キーボードレイアウト実装（Green）**
  - `lib/utils/keyboard.ts` 実装
  - JISキーボード配列定義
  - 指・手の割り当て定義

- [ ] **KeyboardHeatmapコンポーネント実装（Red → Green → Refactor）**
  - `components/KeyboardHeatmap.tsx` テスト・実装
  - キーボードSVG描画
  - 色分け表示（正誤率に応じたグラデーション）
  - ホバー時の詳細表示

- [ ] **統合テスト（E2E）**
  - ヒートマップ表示確認
  - 色の正確性確認

### 完了条件
- ✅ キーボードが正確に表示される
- ✅ 各キーの色が正誤率を反映
- ✅ ホバーで詳細統計表示
- ✅ 全テストパス

---

## Phase 6: PWA対応（予定工数: 3時間）

### 目的
完全なオフライン動作とインストール機能を実装する。

### タスク

- [ ] **Service Worker動作テスト作成（Red）**
  - Service Worker登録テスト
  - キャッシュ戦略テスト
  - オフライン動作テスト

- [ ] **Service Worker設定（Green）**
  - `next-pwa` 詳細設定
  - キャッシュルール定義
  - オフライン検出ロジック

- [ ] **IndexedDB統合（Red → Green → Refactor）**
  - `lib/db/schema.ts` 実装
  - Dexie.js セットアップ
  - CRUD操作実装
  - テスト作成・実装

- [ ] **オフライン文章キャッシュ機能**
  - 生成文章の自動キャッシュ
  - オフライン時のフォールバック

- [ ] **インストールプロンプト実装**
  - PWAインストールボタン
  - インストール状態検出

- [ ] **E2Eテスト（Offline）**
  - Playwright オフラインモードテスト
  - キャッシュからの読み込み確認

### 完了条件
- ✅ オフラインで完全動作
- ✅ インストール可能
- ✅ Lighthouse PWA スコア 100点
- ✅ 全テストパス

---

## Phase 7: 履歴・グラフ機能（予定工数: 4時間）

### 目的
過去のプレイ履歴と上達グラフを表示する。

### タスク

- [ ] **履歴取得ロジックテスト作成（Red）**
  - IndexedDB クエリテスト
  - ソート・フィルタリングテスト

- [ ] **履歴取得ロジック実装（Green）**
  - `lib/db/operations.ts` 拡張
  - 履歴取得関数実装
  - ページネーション実装

- [ ] **ProgressChartコンポーネント実装（Red → Green → Refactor）**
  - `components/ProgressChart.tsx` テスト・実装
  - Recharts でグラフ描画
  - WPM推移グラフ
  - 正確性推移グラフ

- [ ] **履歴画面実装**
  - `app/history/page.tsx` 実装
  - 履歴一覧表示
  - グラフ表示
  - E2Eテスト

### 完了条件
- ✅ 履歴が正確に保存・取得される
- ✅ グラフが見やすく表示
- ✅ 上達傾向が可視化される
- ✅ 全テストパス

---

## Phase 8: 最終調整・パフォーマンス最適化（予定工数: 3時間）

### タスク

- [ ] **パフォーマンス計測**
  - Lighthouse テスト実行
  - Core Web Vitals 確認

- [ ] **最適化実施**
  - 画像最適化
  - コード分割
  - バンドルサイズ削減

- [ ] **アクセシビリティ改善**
  - ARIA属性追加
  - キーボードナビゲーション改善
  - スクリーンリーダー対応

- [ ] **最終E2Eテスト**
  - 全機能フローテスト
  - クロスブラウザテスト

- [ ] **ドキュメント整備**
  - README.md 作成
  - 環境構築手順
  - 使用方法

### 完了条件
- ✅ Lighthouse スコア全項目90点以上
- ✅ 全E2Eテストパス
- ✅ コードカバレッジ80%以上

---

## 全体スケジュール

| Phase | 内容 | 工数 | 累計 |
|-------|------|------|------|
| Phase 0 | セットアップ・テスト環境 | 2h | 2h |
| Phase 1 | 基本タイピング機能 | 6h | 8h |
| Phase 2 | 統計・スコア計算 | 5h | 13h |
| Phase 3 | AI文章生成 | 4h | 17h |
| Phase 4 | AI分析・アドバイス | 5h | 22h |
| Phase 5 | キーボードヒートマップ | 4h | 26h |
| Phase 6 | PWA対応 | 3h | 29h |
| Phase 7 | 履歴・グラフ | 4h | 33h |
| Phase 8 | 最終調整 | 3h | **36h** |

**総工数**: 約36時間（4.5日）

---

## Git コミット規律

### コミットタイミング
- 各Phase完了時
- Red → Green → Refactor の各サイクル完了時
- 全テストパス確認後

### コミットメッセージ例
```
feat(phase1): implement basic typing logic (Green)

- Add validateInput() function
- Add compareCharacters() function
- All tests passing (coverage: 85%)
```

---

## 最終完了条件チェックリスト

- [ ] 全機能が要件定義書を満たす
- [ ] 全単体テストパス（コードカバレッジ80%以上）
- [ ] 全E2Eテストパス
- [ ] PWA として完全動作（オフライン含む）
- [ ] Lighthouse スコア 90点以上（全項目）
- [ ] AI 文章生成が正常動作
- [ ] AI 分析・アドバイスが正常動作
- [ ] README.md 完備
- [ ] `.env.local.example` 提供

---

## 備考
- 各Phaseは独立して完結させる
- 問題発生時は即座に対応、次Phaseに持ち越さない
- TDDサイクルを厳守し、テストなしコードは書かない
