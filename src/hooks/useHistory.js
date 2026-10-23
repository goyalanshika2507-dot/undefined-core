import { useState, useCallback } from 'react';

/**
 * Hook to manage in-memory session history for message transformations.
 * Per privacy guidelines, history is session-only and never written to localStorage or database.
 */
export function useHistory() {
  const [history, setHistory] = useState([]);

  /**
   * Adds a successful transformation to session history.
   * One entry represents the original draft and all associated versions.
   */
  const addTransformation = useCallback((transformation) => {
    const titleSnippet = transformation.originalDraft
      ? transformation.originalDraft.trim().slice(0, 48) + (transformation.originalDraft.length > 48 ? '...' : '')
      : 'Untitled Draft';

    const newEntry = {
      id: `trans-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date(),
      title: titleSnippet,
      originalDraft: transformation.originalDraft,
      settings: { ...transformation.settings },
      versions: [...transformation.versions],
      selectedVersionId: transformation.selectedVersionId || transformation.versions[0]?.id,
      insights: transformation.insights || null,
    };

    setHistory((prev) => [newEntry, ...prev]);
    return newEntry.id;
  }, []);

  /**
   * Deletes a specific transformation from session history.
   */
  const removeTransformation = useCallback((id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  /**
   * Clears the entire session history.
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addTransformation,
    removeTransformation,
    clearHistory,
    hasHistory: history.length > 0,
  };
}
