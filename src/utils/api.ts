export const mockFetchIssues = () => {
    return new Promise(resolve => {
        setTimeout(() => {
            import('../data/issues.json').then(data =>{ Array.isArray(data.default)? resolve(data.default): resolve([]); }).catch(() => resolve([]));
        }, 500);
    });
};

export const mockUpdateIssue = (issueId: string, updates: any) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
                resolve({id: issueId, ...updates});
        }, 500);
    });
};
