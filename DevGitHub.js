/*------------------------------------------------------------------------------------------------------
Script: DevGitHub.js
Author: Development Tools Library
Date: 2026-01-30
Version: 1.0
Description: GitHub integration for iOS developers - manage repos, issues, PRs from iPhone
------------------------------------------------------------------------------------------------------*/

// Import the iOS Dev Tools library
const DevTools = importModule('iOSDevTools');

// ============================================== CONFIGURATION ============================================== //

const GITHUB_API_BASE = "https://api.github.com";
let GITHUB_TOKEN = DevTools.getFromKeychain("github_token") || "";

// ============================================== GITHUB API FUNCTIONS ============================================== //

/**
 * Set GitHub personal access token
 * @param {string} token - GitHub personal access token
 */
function setGitHubToken(token) {
    // Validate token format
    if (!token || typeof token !== 'string') {
        throw new Error("Invalid token: must be a non-empty string");
    }
    
    // GitHub token prefixes: ghp_ (personal), gho_ (OAuth), ghu_ (user), ghs_ (server), ghr_ (refresh)
    const validPrefixes = ['ghp_', 'gho_', 'ghu_', 'ghs_', 'ghr_'];
    const hasValidPrefix = validPrefixes.some(prefix => token.startsWith(prefix));
    
    if (!hasValidPrefix && token.length < 40) {
        console.warn("Warning: Token doesn't match expected GitHub token format. Expected format: ghp_xxxx... or at least 40 characters");
    }
    
    GITHUB_TOKEN = token;
    DevTools.saveToKeychain("github_token", token);
}

/**
 * Make authenticated GitHub API request
 * @param {string} endpoint - API endpoint (e.g., "/user")
 * @param {string} method - HTTP method
 * @param {Object} body - Request body
 * @returns {Promise<Object>} API response
 */
async function githubRequest(endpoint, method = "GET", body = null) {
    const url = `${GITHUB_API_BASE}${endpoint}`;
    const headers = {
        "Authorization": `token ${GITHUB_TOKEN}`,
        "Accept": "application/vnd.github.v3+json"
    };
    
    return await DevTools.httpRequestWithRetry(url, {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : null
    });
}

/**
 * Get authenticated user info
 * @returns {Promise<Object>} User information
 */
async function getUser() {
    return await githubRequest("/user");
}

/**
 * List user repositories
 * @param {string} username - GitHub username (optional, defaults to authenticated user)
 * @param {number} perPage - Number of repos per page
 * @returns {Promise<Object>} Repository list
 */
async function listRepositories(username = null, perPage = 30) {
    const endpoint = username ? `/users/${username}/repos` : "/user/repos";
    return await githubRequest(`${endpoint}?per_page=${perPage}&sort=updated`);
}

/**
 * Get repository details
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object>} Repository details
 */
async function getRepository(owner, repo) {
    return await githubRequest(`/repos/${owner}/${repo}`);
}

/**
 * List repository issues
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} state - Issue state (open, closed, all)
 * @returns {Promise<Object>} Issues list
 */
async function listIssues(owner, repo, state = "open") {
    return await githubRequest(`/repos/${owner}/${repo}/issues?state=${state}`);
}

/**
 * Create new issue
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} title - Issue title
 * @param {string} body - Issue body
 * @param {Array<string>} labels - Issue labels
 * @returns {Promise<Object>} Created issue
 */
async function createIssue(owner, repo, title, body, labels = []) {
    return await githubRequest(`/repos/${owner}/${repo}/issues`, "POST", {
        title: title,
        body: body,
        labels: labels
    });
}

/**
 * List pull requests
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} state - PR state (open, closed, all)
 * @returns {Promise<Object>} Pull requests list
 */
async function listPullRequests(owner, repo, state = "open") {
    return await githubRequest(`/repos/${owner}/${repo}/pulls?state=${state}`);
}

/**
 * Get repository commits
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {number} perPage - Number of commits
 * @returns {Promise<Object>} Commits list
 */
async function getCommits(owner, repo, perPage = 10) {
    return await githubRequest(`/repos/${owner}/${repo}/commits?per_page=${perPage}`);
}

/**
 * Get user's notifications
 * @param {boolean} unreadOnly - Only unread notifications
 * @returns {Promise<Object>} Notifications
 */
async function getNotifications(unreadOnly = true) {
    const endpoint = unreadOnly ? "/notifications" : "/notifications?all=true";
    return await githubRequest(endpoint);
}

/**
 * Search repositories
 * @param {string} query - Search query
 * @param {number} perPage - Results per page
 * @returns {Promise<Object>} Search results
 */
async function searchRepositories(query, perPage = 10) {
    return await githubRequest(`/search/repositories?q=${encodeURIComponent(query)}&per_page=${perPage}`);
}

/**
 * Get repository languages
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {Promise<Object>} Languages data
 */
async function getLanguages(owner, repo) {
    return await githubRequest(`/repos/${owner}/${repo}/languages`);
}

// ============================================== UI FUNCTIONS ============================================== //

/**
 * Show repository selector
 * @returns {Promise<Object>} Selected repository
 */
async function selectRepository() {
    const result = await listRepositories();
    
    if (!result.success) {
        await DevTools.showAlert("Error", "Failed to fetch repositories");
        return null;
    }
    
    const repos = result.data;
    const repoNames = repos.map(r => `${r.name} (${r.stargazers_count}★)`);
    
    const table = new UITable();
    table.showSeparators = true;
    
    for (let i = 0; i < repos.length; i++) {
        const row = new UITableRow();
        row.dismissOnSelect = true;
        
        const nameCell = row.addText(repos[i].name);
        nameCell.titleFont = Font.boldSystemFont(16);
        
        const descCell = row.addText(repos[i].description || "No description");
        descCell.titleFont = Font.systemFont(12);
        descCell.titleColor = Color.gray();
        
        row.onSelect = (idx) => {
            return repos[idx];
        };
        
        table.addRow(row);
    }
    
    const selectedIndex = await table.present();
    return selectedIndex >= 0 ? repos[selectedIndex] : null;
}

/**
 * Display repository dashboard
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 */
async function showRepositoryDashboard(owner, repo) {
    const [repoResult, issuesResult, prsResult, commitsResult] = await Promise.all([
        getRepository(owner, repo),
        listIssues(owner, repo),
        listPullRequests(owner, repo),
        getCommits(owner, repo, 5)
    ]);
    
    if (!repoResult.success) {
        await DevTools.showAlert("Error", "Failed to fetch repository data");
        return;
    }
    
    const repoData = repoResult.data;
    const issues = issuesResult.success ? issuesResult.data : [];
    const prs = prsResult.success ? prsResult.data : [];
    const commits = commitsResult.success ? commitsResult.data : [];
    
    const table = new UITable();
    
    // Repository info
    const headerRow = new UITableRow();
    headerRow.isHeader = true;
    headerRow.addText(`${owner}/${repo}`).titleFont = Font.boldSystemFont(18);
    table.addRow(headerRow);
    
    // Stats
    const statsRow = new UITableRow();
    statsRow.addText(`⭐ ${repoData.stargazers_count} | 🍴 ${repoData.forks_count} | 👀 ${repoData.watchers_count}`);
    table.addRow(statsRow);
    
    // Issues
    const issuesHeader = new UITableRow();
    issuesHeader.isHeader = true;
    issuesHeader.addText(`Open Issues (${issues.length})`);
    table.addRow(issuesHeader);
    
    for (const issue of issues.slice(0, 5)) {
        const row = new UITableRow();
        row.addText(`#${issue.number}: ${issue.title}`);
        table.addRow(row);
    }
    
    // Pull Requests
    const prsHeader = new UITableRow();
    prsHeader.isHeader = true;
    prsHeader.addText(`Open PRs (${prs.length})`);
    table.addRow(prsHeader);
    
    for (const pr of prs.slice(0, 5)) {
        const row = new UITableRow();
        row.addText(`#${pr.number}: ${pr.title}`);
        table.addRow(row);
    }
    
    // Recent Commits
    const commitsHeader = new UITableRow();
    commitsHeader.isHeader = true;
    commitsHeader.addText("Recent Commits");
    table.addRow(commitsHeader);
    
    for (const commit of commits) {
        const row = new UITableRow();
        const message = commit.commit.message.split('\n')[0];
        row.addText(message.substring(0, 50));
        table.addRow(row);
    }
    
    await table.present();
}

/**
 * Quick action menu for GitHub
 */
async function showQuickActions() {
    const actions = [
        "View My Repositories",
        "View Notifications",
        "Search Repositories",
        "Create Issue"
    ];
    
    const choice = await DevTools.showAlert("GitHub Quick Actions", "Choose an action:", actions);
    
    switch (choice) {
        case 0: // My Repositories
            const repo = await selectRepository();
            if (repo) {
                await showRepositoryDashboard(repo.owner.login, repo.name);
            }
            break;
            
        case 1: // Notifications
            const notifs = await getNotifications();
            if (notifs.success) {
                const count = notifs.data.length;
                await DevTools.showAlert("Notifications", `You have ${count} unread notification${count !== 1 ? 's' : ''}`);
            }
            break;
            
        case 2: // Search
            const query = await DevTools.showInputDialog("Search", "Enter search query:", "e.g., react native");
            if (query) {
                const results = await searchRepositories(query);
                if (results.success) {
                    await DevTools.showAlert("Results", `Found ${results.data.total_count} repositories`);
                }
            }
            break;
            
        case 3: // Create Issue
            const selectedRepo = await selectRepository();
            if (selectedRepo) {
                const title = await DevTools.showInputDialog("Issue Title", "Enter issue title:");
                if (title) {
                    const body = await DevTools.showInputDialog("Issue Body", "Enter issue description:");
                    const issue = await createIssue(selectedRepo.owner.login, selectedRepo.name, title, body || "");
                    if (issue.success) {
                        await DevTools.showAlert("Success", `Issue #${issue.data.number} created!`);
                    }
                }
            }
            break;
    }
}

// ============================================== WIDGET ============================================== //

/**
 * Create GitHub widget
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @returns {ListWidget} Configured widget
 */
async function createWidget(owner, repo) {
    const widget = new ListWidget();
    widget.backgroundColor = new Color("#24292e");
    
    try {
        const [repoResult, issuesResult, prsResult] = await Promise.all([
            getRepository(owner, repo),
            listIssues(owner, repo),
            listPullRequests(owner, repo)
        ]);
        
        if (repoResult.success) {
            const repoData = repoResult.data;
            
            // Title
            const title = widget.addText(`${owner}/${repo}`);
            title.font = Font.boldSystemFont(14);
            title.textColor = Color.white();
            
            widget.addSpacer(8);
            
            // Stats
            const stats = widget.addText(`⭐ ${repoData.stargazers_count}  🍴 ${repoData.forks_count}`);
            stats.font = Font.systemFont(12);
            stats.textColor = new Color("#8b949e");
            
            widget.addSpacer(12);
            
            // Issues and PRs
            const issues = issuesResult.success ? issuesResult.data.length : 0;
            const prs = prsResult.success ? prsResult.data.length : 0;
            
            const issuesText = widget.addText(`🔴 ${issues} issues  🟢 ${prs} PRs`);
            issuesText.font = Font.systemFont(12);
            issuesText.textColor = Color.white();
        }
    } catch (error) {
        const errorText = widget.addText("Error loading data");
        errorText.font = Font.systemFont(12);
        errorText.textColor = Color.red();
    }
    
    return widget;
}

// ============================================== MAIN ============================================== //

async function main() {
    // Check if token is set
    if (!GITHUB_TOKEN) {
        const token = await DevTools.showInputDialog(
            "GitHub Token Required",
            "Enter your GitHub personal access token:",
            "ghp_..."
        );
        
        if (token) {
            setGitHubToken(token);
        } else {
            await DevTools.showAlert("Error", "GitHub token is required");
            return;
        }
    }
    
    // Widget mode
    if (config.runsInWidget) {
        const params = args.widgetParameter ? args.widgetParameter.split("/") : ["github", "github"];
        const widget = await createWidget(params[0], params[1]);
        Script.setWidget(widget);
        Script.complete();
        return;
    }
    
    // App mode
    await showQuickActions();
}

// Run main
await main();
