import React from 'react';
import { Issue, IssueStatus } from '../types';
import { useDraggable } from '@dnd-kit/core';
import { useStore } from '../utils/store';

interface IssueCardProps {
  issue: Issue;
  currentStatus: IssueStatus;
  onMove: (targetStatus: IssueStatus) => void;
  isAdmin: boolean;
  disabled?: boolean;
  draggable?: boolean;
  onClick?: () => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  currentStatus,
  onMove,
  isAdmin,
  disabled = false,
  draggable = false,
  onClick
}) => {
  const statusOptions: IssueStatus[] = ['Backlog', 'In Progress', 'Done'];
  const availableMoves = statusOptions.filter(s => s !== currentStatus);
  const {darkTheme} = useStore();
  const { setNodeRef, listeners, attributes, transform, isDragging } = useDraggable({
    id: issue.id,
    disabled: !draggable,
  });

  const style: React.CSSProperties = {
    background: darkTheme? "black": '#fff',
    margin: '0.5rem 0',
    padding: '0.5rem',
    borderRadius: 4,
    boxShadow: '0 1px 2px #ccc',
    opacity: disabled ? 0.6 : 1,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    zIndex: isDragging ? 100 : undefined,
    transition: 'box-shadow 0.2s',
    position: 'relative',
    userSelect: 'none',
    cursor: isAdmin && draggable ? 'grab' : 'default',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <div {...listeners} {...attributes} style={{ padding: '0.25rem 0', cursor: 'grab' }}>
        <strong>{issue.title}</strong>
        <div>Assignee: {issue.assignee}</div>
      <div>Priority: {issue.priority} | Severity: {issue.severity}</div>
      <div>Tags: {issue.tags.join(', ')}</div>

      {isAdmin && (
        <div style={{ marginTop: 8 }} onClick={e => e.stopPropagation()}>
          <label htmlFor={`move-${issue.id}`}>Move to: </label>
          <select
            id={`move-${issue.id}`}
            defaultValue=""
            onChange={e => {
              const value = e.target.value as IssueStatus;
              if (value) onMove(value);
            }}
            disabled={disabled}
          >
            <option value="" disabled>Choose column</option>
            {availableMoves.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          {disabled && <span style={{ marginLeft: 8, color: '#888' }}>Updating...</span>}
        </div>
      )}
      </div>
      <button
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          padding: '0.25rem 0.5rem',
          cursor: 'pointer',
        }}
        data-dnd-kit-no-drag
        onClick={
          onClick
        }
      >
        Details
      </button>

      
    </div>
  );
};
