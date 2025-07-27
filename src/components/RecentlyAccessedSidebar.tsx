import { useRecentIssues } from '../hooks/useRecentIssues';
import { Issue } from '../types';
import { useStore } from '../utils/store';
import { useNavigate } from 'react-router-dom';

export const RecentlyAccessedSidebar = ({ onClose }:any) => {
  const { issues, darkTheme } = useStore();
  const navigate = useNavigate();
  const { recentIds } = useRecentIssues();


  const recentIssues = issues
    .filter(issue => recentIds.find(id => issue.id === id))
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 320,
        background: darkTheme?"#333":'#fff',
        boxShadow: '-2px 0 8px gray',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
      }}
    >
      <button onClick={onClose} style={{ alignSelf: 'flex-end', marginBottom: 16 }}>Close</button>
      <h3>Recently Accessed</h3>
      {recentIssues.length === 0 && <div>No recent issues</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {recentIssues.map(issue => (
          <li key={issue.id} style={{ marginBottom: 12 }}>
            <button
              style={{
                background: '#f4f4f4',
                border: 'none',
                borderRadius: 4,
                padding: '0.5rem',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/issue/${issue.id}`)}
            >
              <strong>{issue.title}</strong>
              <div style={{ fontSize: 12, color: '#666' }}>{issue.status}</div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};