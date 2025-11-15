/**
 * AnalysisReportコンポーネント
 * タイピング結果の分析レポートを表示
 */
import React from 'react';

interface AnalysisReportProps {
  wpm: number;
  accuracy: number;
  characterCount: number;
  aiAdvice: string;
}

interface StatCardProps {
  value: number | string;
  label: string;
  colorClass: string;
}

/**
 * 統計情報を表示する再利用可能なカード
 */
const StatCard: React.FC<StatCardProps> = ({ value, label, colorClass }) => (
  <div className="text-center">
    <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

/**
 * 正確性に基づく色分けを決定
 */
const getAccuracyColor = (accuracy: number): string => {
  if (accuracy >= 90) return 'text-green-500';
  if (accuracy >= 70) return 'text-yellow-500';
  return 'text-red-500';
};

export default function AnalysisReport({
  wpm,
  accuracy,
  characterCount,
  aiAdvice,
}: AnalysisReportProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* 統計情報 */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard value={wpm} label="WPM" colorClass="text-blue-600" />
        <StatCard
          value={`${accuracy}%`}
          label="正確性"
          colorClass={getAccuracyColor(accuracy)}
        />
        <StatCard value={characterCount} label="文字" colorClass="text-purple-600" />
      </div>

      {/* AIアドバイス */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-3">AIアドバイス</h3>
        {aiAdvice ? (
          <div className="bg-blue-50 rounded-lg p-4 text-gray-700 whitespace-pre-line">
            {aiAdvice}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 text-gray-500 text-center">
            分析中...
          </div>
        )}
      </div>
    </div>
  );
}
