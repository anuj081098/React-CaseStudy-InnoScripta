import { useEffect } from 'react';
import { mockFetchIssues } from '../utils/api';
import { Issue } from '../types';

export const useIssuePolling = (
  setIssues: (issues: Issue[]) => void,
  setLoading: (loading: boolean) => void,
  setError: (error: string | null) => void,
  setLastSync: (date: Date) => void,
  interval = 10000
) => {

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await mockFetchIssues();
        if (isMounted) {
          setIssues(Array.isArray(response) ? response : []);
          setLastSync(new Date());
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError((err as Error).message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    const timer = setInterval(fetchData, interval);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);
};