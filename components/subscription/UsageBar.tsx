import React from 'react';

interface UsageBarProps {
  used: number;
  limit: number | null;
  label: string;
}

export const UsageBar: React.FC<UsageBarProps> = ({ used, limit, label }) => {
  const isUnlimited = limit === null;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isAtLimit = !isUnlimited && used >= limit;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-xs text-gray-400">
          {isUnlimited ? '무제한' : `${used}/${limit}`}
        </span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        {!isUnlimited && (
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isAtLimit ? 'bg-amber-500' : 'bg-violet-500'
            }`}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={used}
            aria-valuemin={0}
            aria-valuemax={limit}
            aria-label={`${label}: ${used}/${limit}`}
          />
        )}
      </div>
    </div>
  );
};

export default UsageBar;
