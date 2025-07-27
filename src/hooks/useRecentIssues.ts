import { useState, useCallback } from 'react';
import { IssueDetailPage } from '../pages/IssueDetailPage';

export function useRecentIssues() {
  const [recentIds, setRecentIds] = useState(() => {
    const stored = localStorage.getItem('recentIssues');
    return stored ? (JSON.parse(stored) as string[]) : [];
  });

  const addToRecent = useCallback((issueId: string) => {
    setRecentIds(prev => {
      const updated = [issueId, ...prev.filter(id => id !== issueId)].slice(0, 5);
      localStorage.setItem('recentIssues', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { recentIds, addToRecent };
}
