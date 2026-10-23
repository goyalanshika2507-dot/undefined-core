import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Skeleton Header */}
      <div className="flex items-center justify-between pb-2 border-b border-vibe-darkBorder/60">
        <div className="h-6 w-44 bg-vibe-darkCardSecondary/70 dark:bg-vibe-darkCardSecondary/70 rounded-lg animate-pulse" />
        <div className="h-5 w-24 bg-vibe-darkCardSecondary/60 dark:bg-vibe-darkCardSecondary/60 rounded-full animate-pulse" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-9 flex-1 bg-vibe-darkCardSecondary/60 dark:bg-vibe-darkCardSecondary/60 rounded-xl animate-pulse"
          />
        ))}
      </div>

      {/* 4 Cards Skeleton */}
      <div className="space-y-3.5 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-vibe-darkBorder/70 bg-vibe-darkCard/60 dark:bg-vibe-darkCard/60 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-28 bg-vibe-purple/20 rounded-full animate-pulse" />
                <div className="h-6 w-20 bg-vibe-darkCardSecondary rounded-full animate-pulse" />
              </div>
              <div className="h-5 w-5 rounded-full bg-vibe-darkCardSecondary animate-pulse" />
            </div>

            <div className="space-y-2 py-1">
              <div className="h-4 w-5/6 bg-vibe-darkCardSecondary/80 rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-vibe-darkCardSecondary/70 rounded animate-pulse" />
              <div className="h-4 w-3/6 bg-vibe-darkCardSecondary/50 rounded animate-pulse" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="h-4 w-24 bg-vibe-darkCardSecondary/60 rounded animate-pulse" />
              <div className="h-7 w-16 bg-vibe-darkCardSecondary/80 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
