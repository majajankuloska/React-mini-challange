import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm animate-pulse">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 mb-4" />
        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
        <div className="h-3 w-36 bg-slate-100 dark:bg-slate-600 rounded mb-2" />
        <div className="h-4 w-20 bg-slate-100 dark:bg-slate-600 rounded" />
      </div>
    </div>
  );
}
