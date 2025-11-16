'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { validateInput } from '@/lib/typing/validator';

interface TypingAreaProps {
  targetText: string;
  onTypingComplete?: () => void;
  onTypingChange?: (typedText: string, isCorrect: boolean) => void;
  onKeyPress?: (key: string, timestamp: number) => void;
}

/**
 * 個別の文字コンポーネント（表示ロジックの分離）
 */
interface TypingCharacterProps {
  char: string;
  isCorrect?: boolean;
  isTyped: boolean;
}

function TypingCharacter({ char, isCorrect, isTyped }: TypingCharacterProps) {
  const colorClass = useMemo(() => {
    if (!isTyped) return 'text-gray-400'; // 未入力
    return isCorrect ? 'text-green-500' : 'text-red-500';
  }, [isCorrect, isTyped]);

  return <span className={colorClass}>{char}</span>;
}

export default function TypingArea({
  targetText,
  onTypingComplete,
  onTypingChange,
  onKeyPress,
}: TypingAreaProps) {
  const [typedText, setTypedText] = useState('');

  // targetTextが変更されたら入力をリセット
  useEffect(() => {
    setTypedText('');
  }, [targetText]);

  // KeyboardEvent.codeを正規化した文字に変換
  const normalizeKeyCode = (code: string): string | null => {
    // 英字キー（KeyA～KeyZ → a～z）
    if (code.startsWith('Key')) {
      return code.substring(3).toLowerCase();
    }
    // 数字キー（Digit0～Digit9 → 0～9）
    if (code.startsWith('Digit')) {
      return code.substring(5);
    }
    // 記号キー
    const symbolMap: Record<string, string> = {
      'Space': ' ',
      'Comma': ',',
      'Period': '.',
      'Slash': '/',
      'Semicolon': ';',
      'Quote': "'",
      'BracketLeft': '[',
      'BracketRight': ']',
      'Backslash': '\\',
      'Minus': '-',
      'Equal': '=',
    };
    if (symbolMap[code]) {
      return symbolMap[code];
    }
    // Backspace（削除キー）
    if (code === 'Backspace') {
      return 'Backspace';
    }
    return null;
  };

  // キー押下ハンドラー（物理的なキー入力を記録）
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // 制御キーは無視
      if (
        e.code === 'ShiftLeft' ||
        e.code === 'ShiftRight' ||
        e.code === 'ControlLeft' ||
        e.code === 'ControlRight' ||
        e.code === 'AltLeft' ||
        e.code === 'AltRight' ||
        e.code === 'MetaLeft' ||
        e.code === 'MetaRight' ||
        e.code === 'CapsLock' ||
        e.code === 'Tab' ||
        e.code === 'Escape'
      ) {
        return;
      }

      // KeyboardEvent.codeを正規化
      const normalizedKey = normalizeKeyCode(e.code);
      if (!normalizedKey) {
        return;
      }

      if (onKeyPress) {
        onKeyPress(normalizedKey, Date.now());
      }
    },
    [onKeyPress]
  );

  // 入力ハンドラー（メモ化）
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;

      // 目標テキストの長さを超える入力は許可しない
      if (newValue.length > targetText.length) {
        return;
      }

      setTypedText(newValue);

      // 入力の検証
      const results = validateInput(targetText, newValue);
      const allCorrect = results.length > 0 && results.every(r => r.isCorrect);

      // onTypingChangeコールバック
      if (onTypingChange) {
        onTypingChange(newValue, allCorrect);
      }

      // 完了チェック
      if (newValue.length === targetText.length && allCorrect) {
        if (onTypingComplete) {
          onTypingComplete();
        }
      }
    },
    [targetText, onTypingChange, onTypingComplete]
  );

  // 検証結果（メモ化）
  const validationResults = useMemo(
    () => validateInput(targetText, typedText),
    [targetText, typedText]
  );

  // 目標テキストを文字ごとに分割して表示（メモ化）
  const renderedCharacters = useMemo(() => {
    const chars = targetText.split('');

    return chars.map((char, index) => {
      const isTyped = index < validationResults.length;
      const isCorrect = isTyped ? validationResults[index].isCorrect : undefined;

      return (
        <TypingCharacter
          key={index}
          char={char}
          isCorrect={isCorrect}
          isTyped={isTyped}
        />
      );
    });
  }, [targetText, validationResults]);

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      {/* 目標テキスト表示 */}
      <div className="text-4xl font-mono tracking-wider mb-8">
        {renderedCharacters}
      </div>

      {/* 入力フィールド */}
      <input
        type="text"
        value={typedText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 text-2xl font-mono border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white/10 text-white"
        placeholder="ここに入力..."
        autoFocus
      />
    </div>
  );
}
