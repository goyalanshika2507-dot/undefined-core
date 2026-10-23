import React from 'react';
import { Menu, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header({
  activePage,
  isDark,
  toggleTheme,
  onOpenMobileSidebar,
}) {
  const getPageTitle = () => {
    switch (activePage) {
      case 'write':
        return 'Message Workspace';
      case 'history':
        return 'Session History';
      case 'about':
        return 'About VibeShift';
      default:
        return 'VibeShift';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-vibe-darkBg/90 dark:bg-vibe-darkBg/90 backdrop-blur-md border-b border-vibe-darkBorder/60 transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl border border-vibe-darkBorder/60 text-vibe-textSecondary hover:text-white hover:bg-vibe-darkCard transition-colors"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-vibe-textMain tracking-tight">
            {getPageTitle()}
          </h2>
          <p className="hidden sm:block text-xs text-vibe-textSecondary">
            Transform blunt drafts into audience-perfect communication
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Decorative AI-powered badge */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-vibe-purple/15 to-vibe-indigo/15 border border-vibe-purple/30 text-vibe-textMain shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-vibe-purple animate-pulseSubtle" />
          <span>AI-Powered</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>

        {/* Theme Toggle Button */}
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />

        {/* Team / Role Avatar Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-vibe-darkBorder/60">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-vibe-indigo to-vibe-purple flex items-center justify-center text-xs font-bold text-white shadow-md">
            V
          </div>
          <div className="hidden sm:block text-left text-xs">
            <div className="font-semibold text-vibe-textMain leading-tight">Vibe Team</div>
            <div className="text-[10px] text-vibe-textSecondary leading-tight">Frontend Only</div>
          </div>
        </div>
      </div>
    </header>
  );
}
