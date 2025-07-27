import React, { useState, useMemo } from 'react';
import { useStore } from '../utils/store';
import { Issue, IssueStatus } from '../types';
import { IssueCard } from '../components/IssueCard';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { DroppableColumn } from '../components/DroppableColumn';
import { SearchFilterBar } from '../components/SearchFilterBar';
import { RecentlyAccessedSidebar } from '../components/RecentlyAccessedSidebar';
import { useNavigate } from 'react-router-dom';
import { useIssuePolling } from '../hooks/useIssuesPolling';
import {  filterSearchIssues, sortIssuesByPriority } from '../utils/issueUtils';
import { useUndoList } from '../hooks/useUndoList';
import { useRecentIssues } from '../hooks/useRecentIssues';


const columns = [
  { key: 'Backlog' as IssueStatus, label: 'Backlog' },
  { key: 'In Progress' as IssueStatus, label: 'In Progress' },
  { key: 'Done' as IssueStatus, label: 'Done' },
];


export const BoardPage = () => {
  const { issues, loading, error, setIssues, setLoading, setError, updateIssue, user, lastSync, setLastSync  } = useStore();
  const [pending, setPending] = useState<Set<string>>(new Set());
  const { undoList, handleMove, handleUndo } = useUndoList(updateIssue, setError, setPending);
  const isAdmin = user.role === 'admin';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  useIssuePolling(setIssues, setLoading, setError, setLastSync);

  // Filter state
  const [search, setSearch] = useState('');
  const [assignee, setAssignee] = useState('');
  const [severity, setSeverity] = useState('');

  // Unique assignees and severities for filter dropdowns
  const assigneeOptions = useMemo(() => Array.from(new Set(issues.map(i => i.assignee))), [issues]);
  const severityOptions = useMemo(() => Array.from(new Set(issues.map(i => i.severity))).sort((a, b) => a - b), [issues]);

  // Filtered and sorted issues
  const filteredSortedIssues = useMemo(() => {
    const filtered = filterSearchIssues(issues, search, assignee, severity);
    return sortIssuesByPriority(filtered);
  }, [issues, search, assignee, severity]);

  // Use custom hook for recent issues
  const { addToRecent } = useRecentIssues();


  // Drag and Drop Handlers
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    const issue = issues.find(i => i.id === active.id);
    if (!issue) return;
    const targetStatus = over.id as IssueStatus;
    if (issue.status !== targetStatus) {
      handleMove(issue, targetStatus);
    }
  };

  return (
    <div style={{ padding: '1rem', position: 'relative' }}>
      <h2>Issue Board</h2>
      <div style={{ fontSize: 12, marginBottom: 8 }}>
        Last sync:  {lastSync && lastSync.toLocaleTimeString()}
      </div>
      <div style={{ fontSize: 13, color: 'blue', marginBottom: 8, fontWeight: 500 }}>
        User: {user.name} ({user.role})
      </div>
      <button
        style={{ position: 'fixed', top: 80, right: 24, padding: '0.5rem 1rem', borderRadius: 20, background: '#1976d2', color: '#fff', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}
        onClick={() => setSidebarOpen(true)}
      >
        Recent Issues
      </button>
      {sidebarOpen && <RecentlyAccessedSidebar
        onClose={() => setSidebarOpen(false)}
      />}
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        assignee={assignee}
        onAssigneeChange={setAssignee}
        severity={severity}
        onSeverityChange={setSeverity}
        assigneeOptions={assigneeOptions}
        severityOptions={severityOptions}
      />
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {undoList.length > 0 && (
        <div style={{ background: '#0f42cfff', padding: '0.5rem', marginBottom: 8, borderRadius: 4 }}>
          {undoList.map(undo => (
            <div key={undo.issueId} style={{ marginBottom: 4 }}>
              Issue move pending for <strong>#{undo.issueId}</strong>. <button onClick={() => handleUndo(undo.issueId)}>Undo</button>
            </div>
          ))}
        </div>
      )}
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={isAdmin ? handleDragEnd : undefined}
      >
        <div style={{ display: 'flex', gap: '2rem' }}>
          {columns.map(col => (
            <DroppableColumn key={col.key} col={col}>
              {filteredSortedIssues.filter((issue: Issue) => issue.status === col.key).length === 0 && <div>No issues</div>}
              {filteredSortedIssues.filter((issue: Issue) => issue.status === col.key).map((issue: Issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  currentStatus={col.key}
                  isAdmin={isAdmin}
                  onMove={(targetStatus) => handleMove(issue, targetStatus)}
                  disabled={pending.has(issue.id)}
                  draggable={isAdmin}
                  onClick={() => {
                    addToRecent(issue.id);
                    navigate(`/issue/${issue.id}`)
                  }}
                />
              ))}
            </DroppableColumn>
          ))}
        </div>
      </DndContext>
    </div>
  );
};
