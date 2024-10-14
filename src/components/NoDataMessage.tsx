import React from 'react';

const NoDataMessage: React.FC = () => (
  <div className="text-center py-8">
    <p className="text-lg font-semibold text-gray-500">表示するデータがありません。</p>
    <p className="text-sm text-gray-400">フィルター設定を変更してください。</p>
  </div>
);

export default NoDataMessage;