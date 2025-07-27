import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { IssueStatus } from '../types';

interface DroppableColumnProps {
  col: { key: IssueStatus; label: string };
  children: React.ReactNode;
}

export const DroppableColumn: React.FC<DroppableColumnProps> = ({ col, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id: col.key });
  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        background: isOver ? '#e0f7fa' : '#f4f4f4',
        padding: '1rem',
        borderRadius: 8,
        minHeight: 200,
        transition: 'background 0.2s',
        
      }}
    >
      <h3 style={{color:"black"}}>{col.label}</h3>
      {children}
    </div>
  );
};
