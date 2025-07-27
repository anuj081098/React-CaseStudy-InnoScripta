import { useStore } from '../utils/store';
import { useIssuePolling } from '../hooks/useIssuesPolling';

export const SettingsPage = () => {
    const { setIssues, setLoading, setError, lastSync, setLastSync } = useStore();
    useIssuePolling( setIssues, setLoading, setError, setLastSync);
    return <div style={{ padding: '1rem' }}>
        { (
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                Last sync:  {lastSync && lastSync.toLocaleTimeString()}
              </div>
            )}
    </div>;
};