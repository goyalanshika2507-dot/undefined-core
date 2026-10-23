import React from 'react';
import { PenSquare, History, Info, Sparkles, Globe, Compass, X } from 'lucide-react';

export default function Sidebar({
  activePage,
  setActivePage,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const navItems = [
    {
      id: 'write',
      label: 'Write',
      icon: PenSquare,
      description: 'Draft & transform messages',
    },
    {
      id: 'history',
      label: 'History',
      icon: History,
      description: 'Past session rewrites',
    },
    {
      id: 'about',
      label: 'About',
      icon: Info,
      description: 'Features & API specs',
    },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 flex-col justify-between border-r transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 flex' : '-translate-x-full lg:flex hidden'
        } bg-vibe-darkSidebar dark:bg-vibe-darkSidebar text-vibe-textMain dark:text-vibe-textMain border-vibe-darkBorder/60 dark:border-vibe-darkBorder/60 select-none`}
      >
        {/* Top Header / Branding */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-vibe-purple to-vibe-indigo flex items-center justify-center text-white shadow-glow-purple">
                <Sparkles className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                    VibeShift
                  </h1>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-vibe-purple/20 text-vibe-purple border border-vibe-purple/30 font-medium">
                    AI
                  </span>
                </div>
                <p className="text-xs text-vibe-textSecondary font-medium">
                  Your message. Better.
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-vibe-textSecondary hover:text-white hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Section */}
          <nav className="mt-8 space-y-2">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-vibe-textSecondary/70 mb-2">
              Workspace
            </p>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-vibe-purple to-vibe-indigo text-white shadow-glow-purple'
                      : 'text-vibe-textSecondary hover:text-white hover:bg-vibe-darkCard/80 dark:hover:bg-vibe-darkCard/80'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-white' : 'text-vibe-textSecondary group-hover:text-vibe-purple'
                    }`}
                  />
                  <div className="text-left flex-1">
                    <div className="font-semibold">{item.label}</div>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Card (Inspired by reference image) */}
        <div className="p-5">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-vibe-darkCardSecondary/80 to-vibe-darkCard/90 border border-vibe-darkBorder/70 relative overflow-hidden group">
            {/* Ambient background glow */}
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-vibe-purple/20 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-vibe-purple/20 border border-vibe-purple/30 flex items-center justify-center text-vibe-purple shrink-0 mt-0.5">
                <Globe className="w-4 h-4 animate-pulseSubtle" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-snug">
                  Communication Wisdom
                </p>
                <p className="text-[11px] text-vibe-textSecondary mt-1 leading-normal italic">
                  "It's not just what you say, it's how you say it."
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-vibe-darkBorder/60 flex items-center justify-between text-[11px] text-vibe-textSecondary">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Frontend v1.0
              </span>
              <span className="font-mono text-[10px] text-vibe-textSecondary/70">
                Member 1: Agrim
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
