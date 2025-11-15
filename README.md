# タイピングゲーム

制限時間内に文字を正しく入力するタイピング練習ゲーム。AI機能による文章生成と苦手キー分析を搭載。

## 主要機能

- **多様な練習コンテンツ**: ランダム文字、日本語文章、プログラミング用語
- **3段階の難易度**: 初級、中級、上級
- **2つのゲームモード**: 文字数チャレンジ、文章完成モード
- **AI文章自動生成**: Google Gemini API / OpenAI APIによる練習文章自動生成
- **AIタイピングアドバイス**: リアルタイムで上達のコツを提案
- **苦手キー分析**: タイプミスの多いキーを検出・分析
- **PWA対応**: オフラインでも利用可能

## 技術スタック

- Next.js 14.x / React 18.x
- TypeScript
- Tailwind CSS v3
- Google Gemini API (Primary) / OpenAI API (Fallback)
- IndexedDB (Dexie.js)
- PWA (next-pwa)

## ドキュメント

詳細な仕様は以下を参照してください：
- [要件定義書](doc/requirements.md)
- [技術設計書](doc/technical-design.md)
- [実装計画書](doc/implementation-plan.md)

## ターゲットユーザー

- タイピング初心者から上級者まで
- プログラマー（プログラミング用語の練習）
- タイピング速度向上を目指す全ての人
