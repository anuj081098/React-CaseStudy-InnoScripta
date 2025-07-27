import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../utils/store';
import { Issue, IssueStatus } from '../types';
import dayjs from 'dayjs';
import { useUndoList } from '../hooks/useUndoList';

export const IssueDetailPage = () => {
  const { id } = useParams();
  const { issues, updateIssue, user } = useStore();
  const issue = issues.find(i => i.id === id);
  const isAdmin = user.role === 'admin';

  const [pending, setPending] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const { handleMove, handleUndo, undoList } = useUndoList(updateIssue, setError, setPending);

  const handleMarkResolved = () => {
    if (!issue || issue.status === 'Done') return;
    handleMove(issue, 'Done');
  };

  if (!issue) return <div style={{ padding: '1rem' }}>Issue not found</div>;

  return (
    <div style={{ padding: '1rem' }}>
      {undoList.length > 0 && (
        <div style={{ background: '#ffeeba', padding: '0.5rem', marginBottom: 8, borderRadius: 4 }}>
          {undoList.map(undo => (
            <div key={undo.issueId} style={{ marginBottom: 4 }}>
              Issue move pending for <strong>#{undo.issueId}</strong>.{' '}
              <button onClick={() => handleUndo(undo.issueId)}>Undo</button>
            </div>
          ))}
        </div>
      )}

      <h2>{issue.title}</h2>
      <div><strong>Status:</strong> {issue.status}</div>
      <div><strong>Priority:</strong> {issue.priority}</div>
      <div><strong>Severity:</strong> {issue.severity}</div>
      <div><strong>Created At:</strong> {dayjs(issue.createdAt).format('YYYY-MM-DD HH:mm')}</div>
      <div><strong>Assignee:</strong> {issue.assignee}</div>
      <div><strong>Tags:</strong> {issue.tags.join(', ')}</div>
      {typeof issue.userDefinedRank === 'number' && (
        <div><strong>User Rank:</strong> {issue.userDefinedRank}</div>
      )}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}

      {isAdmin && issue.status !== 'Done' && (
        <div style={{ marginTop: 16 }}>
          <button
            onClick={handleMarkResolved}
            disabled={pending.has(issue.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 4,
              background: '#388e3c',
              color: '#fff',
              border: 'none',
              cursor: pending.has(issue.id) ? 'not-allowed' : 'pointer'
            }}
          >
            Mark as Resolved
          </button>
          {pending.has(issue.id) && (
            <span style={{ marginLeft: 12, color: '#888' }}>Updating...</span>
          )}
        </div>
      )}
    </div>
  );
};
