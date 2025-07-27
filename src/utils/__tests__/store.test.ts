import { useStore } from '../store';
import { act } from 'react-dom/test-utils';

describe('updateIssue', () => {
  beforeEach(() => {
    useStore.setState({
      issues: [
        { id: '1', title: 'One', status: 'Backlog', priority: 'high', severity: 1, createdAt: '', assignee: '', tags: [] },
        { id: '2', title: 'Two', status: 'In Progress', priority: 'low', severity: 2, createdAt: '', assignee: '', tags: [] },
      ]
    });
  });

  it('updates the correct issue by id', () => {
    act(() => {
      useStore.getState().updateIssue('1', { status: 'Done', title: 'Updated' });
    });
    const issues = useStore.getState().issues;
    expect(issues.find(i => i.id === '1')).toMatchObject({ status: 'Done', title: 'Updated' });
    expect(issues.find(i => i.id === '2')?.title).toBe('Two');
  });

  it('does nothing if id not found', () => {
    const issuesBefore = useStore.getState().issues;
    act(() => {
      useStore.getState().updateIssue('notfound', { status: 'Done' });
    });
    expect(useStore.getState().issues).toEqual(issuesBefore);
  });
});
