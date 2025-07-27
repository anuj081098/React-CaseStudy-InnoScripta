import { Issue } from '../../types';
import { getPriorityScore, sortIssuesByPriority } from '../issueUtils';

const nowDate = new Date().toISOString();

const baseIssue: Issue = {
  id: 'test',
  title: 'Test issue',
  status: 'Backlog',
  priority: 'high',
  severity: 2,
  createdAt: nowDate,
  assignee: 'alice',
  tags: [],
  userDefinedRank: 0,
};

describe('getPriorityScore', () => {
  it('calculates score with severity, days, and rank', () => {
    const createdYesterday = new Date(Date.now() - 24*60*60*1000).toISOString();
    expect(getPriorityScore({ ...baseIssue, severity: 3, userDefinedRank: 10, createdAt: createdYesterday }))
      .toBe(3 * 10 + (-1) + 10);
  });

  it('defaults userDefinedRank to 0', () => {
    expect(getPriorityScore({ ...baseIssue, userDefinedRank: undefined }))
      .toBe(2 * 10 + 0 + 0);
  });
});

describe('sortIssuesByPriority', () => {
  it('sorts issues by descending priority score', () => {
    const issues = [
      { ...baseIssue, id: 'a', severity: 1, userDefinedRank: 2 },
      { ...baseIssue, id: 'b', severity: 3, userDefinedRank: 2 },
      { ...baseIssue, id: 'c', severity: 2, userDefinedRank: 4 },
    ];
    const sorted = sortIssuesByPriority(issues);
    expect(sorted.map(i => i.id)).toEqual(['b', 'c', 'a']);
  });

  it('uses creation date as tiebreaker', () => {
    const oneDayAgo = new Date(Date.now() - 24*60*60*1000).toISOString();
    const twoDaysAgo = new Date(Date.now() - 48*60*60*1000).toISOString();
    const issues = [
      { ...baseIssue, id: 'a', severity: 2, createdAt: twoDaysAgo },
      { ...baseIssue, id: 'b', severity: 2, createdAt: oneDayAgo },
    ];
    const sorted = sortIssuesByPriority(issues);
    expect(sorted[0].id).toBe('b');
    expect(sorted[1].id).toBe('a');
  });
});
