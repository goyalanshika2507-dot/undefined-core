import React, { useState } from 'react';
import AppLayout from './components/AppLayout';
import WritePage from './pages/WritePage';
import HistoryPage from './components/HistoryPage';
import AboutPage from './components/AboutPage';
import { useTheme } from './hooks/useTheme';
import { useHistory } from './hooks/useHistory';

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const { history, addTransformation, removeTransformation, clearHistory } = useHistory();

  const [activePage, setActivePage] = useState('write');
  const [restoredItem, setRestoredItem] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (toastObj) => {
    setToast(toastObj);
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleRestoreTransformation = (item) => {
    setRestoredItem(item);
    setActivePage('write');
    showToast({
      message: 'Draft & settings restored to workspace',
      type: 'info',
    });
  };

  return (
    <AppLayout
      activePage={activePage}
      setActivePage={setActivePage}
      isDark={isDark}
      toggleTheme={toggleTheme}
      toast={toast}
      onCloseToast={closeToast}
    >
      {activePage === 'write' && (
        <WritePage
          onAddHistory={addTransformation}
          onShowToast={showToast}
          restoredItem={restoredItem}
          onClearRestoredItem={() => setRestoredItem(null)}
        />
      )}

      {activePage === 'history' && (
        <HistoryPage
          history={history}
          onRestoreTransformation={handleRestoreTransformation}
          onDeleteTransformation={removeTransformation}
          onClearHistory={clearHistory}
          onNavigateToWrite={() => setActivePage('write')}
        />
      )}

      {activePage === 'about' && <AboutPage />}
    </AppLayout>
  );
}
