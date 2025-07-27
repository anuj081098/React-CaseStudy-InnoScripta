import { create } from 'zustand';
import { Issue } from '../types';
import { currentUser } from '../constants/currentUser';

interface StoreState {
  issues: Issue[];
  darkTheme: boolean;
  setDarkTheme: (darkTheme: boolean) => void;
  loading: boolean;
  error: string | null;
  user: typeof currentUser;
  lastSync: Date | null;
  setIssues: (issues: Issue[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastSync: (date: Date) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
}

export const useStore = create<StoreState>((set: any, get: any) => ({
  issues: [],
  darkTheme: false,
  setDarkTheme: (darkTheme: boolean): void => set({ darkTheme }),
  loading: false,
  error: null,
  user: currentUser,
  lastSync: null,
  setIssues: (issues: Issue[]): void => set({ issues }),
  setLoading: (loading: boolean): void => set({ loading }),
  setError: (error: string | null): void => set({ error }),
  setLastSync: (date: Date): void => set({ lastSync: date }),
  updateIssue: (id: string, updates: Partial<Issue>): void => { 
    set({
      issues: get().issues.map((issue: Issue) =>
        issue.id === id ? { ...issue, ...updates } : issue
      )
    });
  },
})); 