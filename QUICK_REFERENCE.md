# Quick Reference Guide

## iOS Development Tools for Scriptable

This guide provides quick access to all the new development tools and their key features.

## 🛠️ Core Library (iOSDevTools.js)

Must be installed for all other tools to work.

### Key Functions
```javascript
const DevTools = importModule('iOSDevTools');

// Device Info
DevTools.getDeviceInfo()
DevTools.isLowBattery()
DevTools.checkNetworkConnectivity()

// HTTP/API
await DevTools.httpRequestWithRetry(url, options)
await DevTools.cachedRequest(url, cacheKey, hours)

// File System
DevTools.saveToFile(filename, data)
DevTools.readFromFile(filename)
DevTools.createDirectory(path)
DevTools.listFiles(path)
DevTools.deleteFile(path)

// UI/Notifications
await DevTools.showAlert(title, message, actions)
await DevTools.showInputDialog(title, message, placeholder)
await DevTools.sendNotification(title, body, date, options)
DevTools.copyToClipboard(text)
DevTools.getFromClipboard()

// Security/Keychain
DevTools.saveToKeychain(key, value)
DevTools.getFromKeychain(key)
DevTools.keychainContains(key)
DevTools.removeFromKeychain(key)

// Utilities
DevTools.formatDate(date, format)
DevTools.getRelativeTime(date)
DevTools.generateUUID()
DevTools.sleep(ms)

// Logging
const logger = new DevTools.Logger("MyApp", logToFile)
logger.info(message)
logger.warn(message)
logger.error(message)
logger.debug(message)
```

## 📦 GitHub Integration (DevGitHub.js)

Manage GitHub from your iPhone.

### Setup
1. Get GitHub token: Settings → Developer Settings → Personal Access Tokens
2. Run DevGitHub.js
3. Enter token when prompted

### Features
- List repositories
- View issues and PRs
- Check notifications
- Search repositories
- Create issues

### Widget
Parameter: `owner/repo` (e.g., `github/github`)

## 🔌 API Tester (DevAPITester.js)

Test and debug APIs on the go.

### Features
- Build custom requests (GET, POST, PUT, DELETE)
- Save request templates
- View request history
- Benchmark endpoints
- Response viewer with copy

### Usage
1. Run DevAPITester.js
2. Choose "New Request"
3. Enter URL, method, headers, body
4. Execute or save

## 📝 Code Snippets (DevCodeSnippets.js)

Manage reusable code snippets.

### Pre-loaded Snippets
- Async/await patterns
- Retry logic
- Debounce functions
- API request templates
- Widget templates
- Cache management
- Object utilities

### Features
- Browse by category
- Search snippets
- Tag-based organization
- One-tap copy

### Usage
1. Run DevCodeSnippets.js
2. Browse or search
3. Select snippet
4. Copy to clipboard

## 🤖 AI Prompt Manager (AIPromptManager.js)

Ready-to-use AI prompts for development.

### Templates
- Code Review
- Bug Fix Assistant
- API Documentation Generator
- Test Case Generator
- Code Refactoring
- Code Explanation
- Performance Optimization
- Feature Specification
- Data Structure Design
- Debugging Assistant

### Usage
1. Run AIPromptManager.js
2. Select "Use Prompt"
3. Choose template
4. Fill variables
5. Copy to clipboard → paste in AI assistant

## ⚙️ Task Automation (AITaskAutomation.js)

Automate development workflows.

### Pre-built Automations
- Daily Standup Report (9:00 AM)
- Code Quality Monitor (6:00 PM)
- API Health Monitor (Hourly)

### Features
- Scheduled triggers (daily, hourly, manual)
- Multiple actions per automation
- Execution history
- Success/failure tracking

### Action Types
- github_activity
- analyze_commits
- check_pr_status
- test_endpoints
- format_report
- generate_summary
- notify
- alert_on_failure

## 🎯 Agent Orchestrator (AgentOrchestrator.js)

Coordinate all tools and workflows.

### Available Agents
- GitHub Agent
- API Testing Agent
- AI Assistant Agent
- Weather Agent
- Contacts Agent

### Features
- Intelligent task routing
- Workflow automation
- Task management
- Priority levels
- Status tracking

### Workflows
1. Morning Dev Routine
   - Check weather
   - GitHub notifications
   - List repositories

2. API Health Check
   - Test endpoints
   - Monitor response times

3. Code Review Workflow
   - List PRs
   - AI-powered review

### Usage
1. Run AgentOrchestrator.js
2. Choose "New Task"
3. Describe task (e.g., "Check GitHub PRs")
4. Agent routes to appropriate tool

## 📋 Example Integration (ExampleIntegration.js)

Comprehensive examples of all features.

Run this script to see:
- Device info retrieval
- API requests with retry
- Caching
- File operations
- Keychain storage
- Logging
- Notifications
- Utilities

## 🚀 Quick Start Workflow

### Scenario 1: Check GitHub & Test APIs
```
1. Run AgentOrchestrator.js
2. Select "Morning Dev Routine" workflow
3. Reviews GitHub + tests APIs automatically
```

### Scenario 2: Save Code Snippet
```
1. Run DevCodeSnippets.js
2. Select "New Snippet"
3. Enter code and metadata
4. Browse anytime from any device
```

### Scenario 3: Debug API Issue
```
1. Run DevAPITester.js
2. Enter problematic endpoint
3. View response/errors
4. Save request for later
```

### Scenario 4: Get AI Help
```
1. Run AIPromptManager.js
2. Select "Bug Fix Assistant"
3. Fill in details
4. Copy prompt
5. Paste in ChatGPT/Claude
```

## 📱 Widget Setup

All tools support widgets!

### iOSDevTools
No widget (library only)

### DevGitHub
Parameter: `owner/repo`
Shows: stars, forks, issues, PRs

### DevAPITester
No parameter needed
Shows: request statistics

### DevCodeSnippets
No parameter needed
Shows: snippet count, categories

### AIPromptManager
No parameter needed
Shows: prompt count, categories

### AITaskAutomation
No parameter needed
Shows: active automations, success rate

### AgentOrchestrator
No parameter needed
Shows: agents, pending/completed tasks

## 🔧 Installation

### Minimal Setup (Core Only)
```
iCloud Drive/Scriptable/
└── iOSDevTools.js
```

### Full Developer Setup
```
iCloud Drive/Scriptable/
├── iOSDevTools.js        (Required - Core library)
├── DevGitHub.js          (GitHub integration)
├── DevAPITester.js       (API testing)
├── DevCodeSnippets.js    (Code snippets)
├── AIPromptManager.js    (AI prompts)
├── AITaskAutomation.js   (Task automation)
├── AgentOrchestrator.js  (Orchestrator)
└── ExampleIntegration.js (Examples)
```

## ⚠️ Requirements

- iOS 14.4+
- Scriptable app (free)
- iCloud Drive enabled
- GitHub token (for DevGitHub only)

## 💡 Tips

1. **Start with ExampleIntegration.js** to see all features
2. **Use AgentOrchestrator.js** to coordinate multiple tools
3. **Save API tokens to keychain** for security
4. **Create custom automations** for your daily workflow
5. **Add widgets** for quick access

## 🔗 Tool Dependencies

```
iOSDevTools.js (Core - Required by all)
    ├── DevGitHub.js
    ├── DevAPITester.js
    ├── DevCodeSnippets.js
    ├── AIPromptManager.js
    ├── AITaskAutomation.js
    └── AgentOrchestrator.js
         └── (Uses all above tools)
```

## 📚 Learn More

See README.md for detailed documentation of each tool.

---

**Happy Coding! 🎉**
