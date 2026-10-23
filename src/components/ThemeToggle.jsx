import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ isDark, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="relative p-2 rounded-xl border border-vibe-darkBorder/60 dark:border-vibe-darkBorder/60 bg-vibe-darkCard/80 dark:bg-vibe-darkCard/80 hover:bg-vibe-darkHover dark:hover:bg-vibe-darkHover text-vibe-textSecondary dark:text-vibe-textSecondary hover:text-vibe-textMain dark:hover:text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-vibe-purple/50"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400 animate-fadeIn" />
        ) : (
          <Moon className="w-5 h-5 text-vibe-purple animate-fadeIn" />
        )}
      </div>
    </button>
  );
}
