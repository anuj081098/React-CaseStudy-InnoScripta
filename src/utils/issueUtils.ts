import dayjs from 'dayjs';
import { Issue } from '../types';

/**
 * Calculates priority score for an issue based on severity, time, and user-defined rank
 */
export const getPriorityScore = (issue: Issue): number => {
  const daysSinceCreated = dayjs().diff(dayjs(issue.createdAt), 'day');
  return issue.severity * 10 + (daysSinceCreated * -1) + (issue.userDefinedRank ?? 0);
};

/**
 * Sorts issues by priority and creation date
 */
export const sortIssuesByPriority = (issues: Issue[]): Issue[] => {
  return [...issues].sort((a, b) => {
    const scoreA = getPriorityScore(a);
    const scoreB = getPriorityScore(b);
    if (scoreA !== scoreB) return scoreB - scoreA;
    return dayjs(b.createdAt).diff(dayjs(a.createdAt));
  });
};

/**
 * Filters issues based on search criteria
 */
export const filterSearchIssues = (
  issues: Issue[],
  search: string = '',
  assignee: string = '',
  severity: string = ''
): Issue[] => {
  const lowerCaseSearch = search.toLowerCase();
  return issues.filter(issue => {
    const matchesSearch = !lowerCaseSearch ||
      issue.title.toLowerCase().includes(lowerCaseSearch) ||
      issue.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearch));

    const matchesAssignee = !assignee || issue.assignee === assignee;
    const matchesSeverity = !severity || String(issue.severity) === severity;

    return matchesSearch && matchesAssignee && matchesSeverity;
  });
};