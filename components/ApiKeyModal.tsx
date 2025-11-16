/**
 * APIキー設定モーダル
 * ユーザーがAPIキーを入力・保存・削除できるUI
 */
'use client';

import { useState, useEffect } from 'react';
import { saveApiKey, getApiKey, deleteApiKey } from '@/lib/api-key';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // モーダルが開かれた時に既存のAPIキーを読み込む
  useEffect(() => {
    if (isOpen) {
      const existingKey = getApiKey();
      if (existingKey) {
        setApiKey(existingKey);
        setIsSaved(true);
      } else {
        setApiKey('');
        setIsSaved(false);
      }
      setShowKey(false);
    }
  }, [isOpen]);

  // 保存処理
  const handleSave = () => {
    if (apiKey.trim()) {
      saveApiKey(apiKey.trim());
      setIsSaved(true);
      alert('APIキーを保存しました！');
    }
  };

  // 削除処理
  const handleDelete = () => {
    if (confirm('APIキーを削除してもよろしいですか？')) {
      deleteApiKey();
      setApiKey('');
      setIsSaved(false);
      alert('APIキーを削除しました。');
    }
  };

  // 閉じる処理
  const handleClose = () => {
    setShowKey(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            🔑 Google AI Studio APIキー設定
          </h2>
          <p className="text-sm text-gray-600">
            AI機能を使用するには、Google AI StudioのAPIキーが必要です。
          </p>
        </div>

        {/* APIキー入力 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            APIキー
          </label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          {isSaved && (
            <p className="mt-2 text-sm text-green-600">✓ APIキーは保存されています</p>
          )}
        </div>

        {/* 説明 */}
        <div className="mb-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-2">
            <strong>APIキーの取得方法：</strong>
          </p>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li>
              <a
                href="https://ai.google.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google AI Studio
              </a>
              にアクセス
            </li>
            <li>「Get API Key」ボタンをクリック</li>
            <li>APIキーをコピーして上記に貼り付け</li>
          </ol>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!apiKey.trim()}
            className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
          >
            保存
          </button>
          {isSaved && (
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
            >
              削除
            </button>
          )}
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors"
          >
            閉じる
          </button>
        </div>

        {/* 注意事項 */}
        <div className="mt-6 text-xs text-gray-500">
          ⚠️ APIキーはブラウザのlocalStorageに保存されます。他の人と共有しないでください。
        </div>
      </div>
    </div>
  );
}
