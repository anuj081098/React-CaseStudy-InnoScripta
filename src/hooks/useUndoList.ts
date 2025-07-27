import { useState, useCallback } from 'react';
import { Issue, IssueStatus } from '../types';
import { mockUpdateIssue } from '../utils/api';

interface UndoState {
  issueId: string;
  prevStatus: IssueStatus;
  timer: NodeJS.Timeout;
}

export function useUndoList(updateIssue?: any, setError?: any, setPending?: any) {
  const [undoList, setUndoList] = useState<UndoState[]>([]);

  const handleMove = useCallback((issue: Issue, targetStatus: IssueStatus) => {
    setPending((prev: Set<string>) => {
      if (prev.has(issue.id)) return prev;
      const newPending = new Set(prev);
      newPending.add(issue.id);
      return newPending;
    });
    const prevStatus = issue.status;
    updateIssue(issue.id, { status: targetStatus });
    const timer = setTimeout(() => {
      mockUpdateIssue(issue.id, { status: targetStatus })
        .catch(() => {
          updateIssue(issue.id, { status: prevStatus });
          setError('Failed to update issue');
        })
        .finally(() => {
          setPending((prev: Set<string>) => {
            const updated = new Set(prev);
            updated.delete(issue.id);
            return updated;
          });
        });
      setUndoList(prev => prev.filter(u => u.issueId !== issue.id));
    }, 5000);
    setUndoList(prev => [...prev, { issueId: issue.id, prevStatus, timer }]);
  }, [updateIssue, setError, setPending]);

  const handleUndo = useCallback((issueId: string) => {
    setUndoList(prev => {
      const undo = prev.find(u => u.issueId === issueId);
      if (undo) {
        clearTimeout(undo.timer);
        updateIssue(undo.issueId, { status: undo.prevStatus });
        setPending((prev: Set<string>) => {
          const updated = new Set(prev);
          updated.delete(issueId);
          return updated;
        });
      }
      return prev.filter(u => u.issueId !== issueId);
    });
  }, [updateIssue, setPending]);

  return { undoList, handleMove, handleUndo };
}
