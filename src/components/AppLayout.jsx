import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Toast from './Toast';

export default function AppLayout({
  activePage,
  setActivePage,
  isDark,
  toggleTheme,
  toast,
  onCloseToast,
  children,
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-vibe-lightBg dark:bg-vibe-darkBg text-vibe-lightTextMain dark:text-vibe-textMain transition-colors duration-200">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        {/* Header */}
        <Header
          activePage={activePage}
          isDark={isDark}
          toggleTheme={toggleTheme}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Global Toast */}
      <Toast toast={toast} onClose={onCloseToast} />
    </div>
  );
}
