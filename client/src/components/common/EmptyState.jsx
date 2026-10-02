import React from 'react';

const EmptyState = ({
  icon = '🔍',
  title = 'No items found',
  description = 'There are no items matching your current criteria.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-3xl border border-slate-200/80 p-10 sm:p-12 text-center shadow-sm flex flex-col items-center justify-center ${className}`}
    >
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner">
        {icon}
      </div>
      <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-600/20 active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
