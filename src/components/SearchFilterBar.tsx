import React from 'react';

interface SearchFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  assignee: string;
  onAssigneeChange: (value: string) => void;
  severity: string;
  onSeverityChange: (value: string) => void;
  assigneeOptions: string[];
  severityOptions: number[];
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  search,
  onSearchChange,
  assignee,
  onAssigneeChange,
  severity,
  onSeverityChange,
  assigneeOptions,
  severityOptions,
}) => {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
      <input
        type="text"
        placeholder="Search by title or tags..."
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc', minWidth: 200 }}
      />
      <select
        value={assignee}
        onChange={e => onAssigneeChange(e.target.value)}
        style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}
      >
        <option value="">All Assignees</option>
        {assigneeOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <select
        value={severity}
        onChange={e => onSeverityChange(e.target.value)}
        style={{ padding: '0.5rem', borderRadius: 4, border: '1px solid #ccc' }}
      >
        <option value="">All Severities</option>
        {severityOptions.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};