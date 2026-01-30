# System Architecture

## Overview

This document describes the architecture of the iOS Development Tools suite for Scriptable.

## Component Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     iOS Scriptable App                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌────────────────┐                         ┌───────────────────┐
│  Widget Mode   │                         │    App Mode       │
│  (Home Screen) │                         │  (Interactive UI) │
└────────────────┘                         └───────────────────┘
        │                                           │
        └─────────────────────┬─────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────────┐
        │      AgentOrchestrator.js (Coordinator)     │
        │  ┌───────────────────────────────────────┐  │
        │  │ • Task Routing                        │  │
        │  │ • Agent Selection                     │  │
        │  │ • Workflow Management                 │  │
        │  │ • Status Tracking                     │  │
        │  └───────────────────────────────────────┘  │
        └─────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  Development  │   │   AI & Agents    │   │  Original Tools  │
│     Tools     │   │      Tools       │   │                  │
└───────────────┘   └──────────────────┘   └──────────────────┘
        │                     │                     │
   ┌────┴────┐           ┌────┴────┐         ┌─────┴─────┐
   │         │           │         │         │           │
   ▼         ▼           ▼         ▼         ▼           ▼
DevGitHub DevAPI    AIPrompt  AITask    LSWeather  FavContacts
   .js    Tester     Manager   Automation    .js         .js
          .js        .js       .js

DevCode
Snippets
.js

                              │
                              ▼
        ┌─────────────────────────────────────────────┐
        │       iOSDevTools.js (Core Library)         │
        │  ┌───────────────────────────────────────┐  │
        │  │ • Device Utilities                    │  │
        │  │ • Network & API                       │  │
        │  │ • File System                         │  │
        │  │ • UI & Notifications                  │  │
        │  │ • Security & Keychain                 │  │
        │  │ • Logging & Utilities                 │  │
        │  └───────────────────────────────────────┘  │
        └─────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  iOS System   │   │   iCloud Drive   │   │   iOS Keychain   │
│   Services    │   │                  │   │                  │
└───────────────┘   └──────────────────┘   └──────────────────┘
```

## Data Flow

### 1. User Interaction Flow

```
User Input (Widget/App)
        │
        ▼
AgentOrchestrator
        │
        ├─► Route to Agent
        │   (based on task type)
        │
        ├─► GitHub Agent ──► DevGitHub.js ──► GitHub API
        │
        ├─► API Testing Agent ──► DevAPITester.js ──► Test API
        │
        ├─► AI Assistant Agent ──► AIPromptManager.js ──► Generate Prompt
        │
        └─► Automation Agent ──► AITaskAutomation.js ──► Execute Actions
                │
                ▼
        Result/Notification
                │
                ▼
        User (Widget/Alert/Clipboard)
```

### 2. Storage Architecture

```
iCloud Drive/Scriptable/
│
├── Scripts/
│   ├── iOSDevTools.js           (Core library)
│   ├── AgentOrchestrator.js     (Orchestrator)
│   ├── DevGitHub.js             (Development)
│   ├── DevAPITester.js          (Development)
│   ├── DevCodeSnippets.js       (Development)
│   ├── AIPromptManager.js       (AI)
│   └── AITaskAutomation.js      (AI)
│
├── Data/
│   ├── Cache/                   (API response cache)
│   │   └── {cacheKey}.json
│   │
│   ├── APITester/               (API testing data)
│   │   ├── saved_requests.json
│   │   └── request_history.json
│   │
│   ├── CodeSnippets/            (Code snippets)
│   │   ├── snippets.json
│   │   └── tags.json
│   │
│   ├── AIPrompts/               (AI prompts)
│   │   ├── prompts.json
│   │   └── categories.json
│   │
│   ├── AIAutomation/            (Automations)
│   │   ├── automations.json
│   │   └── execution_log.json
│   │
│   └── AgentOrchestrator/       (Orchestrator data)
│       ├── tasks.json
│       ├── workflows.json
│       └── agents.json
│
└── Logs/                        (Optional logging)
    ├── APITester.log
    ├── Orchestrator.log
    └── AIAutomation.log
```

### 3. Security Model

```
┌─────────────────────────────────────┐
│         User Credentials            │
│  (API tokens, passwords, secrets)   │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│      iOSDevTools.saveToKeychain()   │
│             (Encrypted)             │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│          iOS Keychain               │
│     (System-level encryption)       │
└─────────────────────────────────────┘
                │
                ▼
        (Retrieved securely)
                │
                ▼
┌─────────────────────────────────────┐
│      Use in API Requests            │
│    (Never stored in plain text)     │
└─────────────────────────────────────┘
```

## Integration Patterns

### Pattern 1: Direct Tool Usage

```javascript
// Use tool directly without orchestrator
const DevTools = importModule('iOSDevTools');

// Make API call
const result = await DevTools.httpRequestWithRetry(url);
```

### Pattern 2: Orchestrated Workflow

```javascript
// Let orchestrator manage the workflow
// 1. User creates task in AgentOrchestrator
// 2. Orchestrator routes to appropriate agent
// 3. Agent executes using specific tool
// 4. Results returned to orchestrator
// 5. Orchestrator notifies user
```

### Pattern 3: Automated Task

```javascript
// AITaskAutomation runs on schedule
// 1. Trigger fires (daily at 9:00 AM)
// 2. Execute action sequence:
//    - Check GitHub activity
//    - Format report
//    - Send notification
// 3. Log execution
```

## Module Dependencies

```
AgentOrchestrator.js
    └── requires: iOSDevTools
    └── calls: DevGitHub, DevAPITester, AIPromptManager

DevGitHub.js
    └── requires: iOSDevTools
    └── calls: GitHub API

DevAPITester.js
    └── requires: iOSDevTools
    └── calls: User-defined APIs

DevCodeSnippets.js
    └── requires: iOSDevTools

AIPromptManager.js
    └── requires: iOSDevTools

AITaskAutomation.js
    └── requires: iOSDevTools
    └── calls: Other agents/tools

iOSDevTools.js
    └── requires: None (core library)
    └── calls: iOS System APIs
```

## Execution Modes

### Mode 1: Widget Mode
```
- Launched from iOS Home Screen
- Limited interaction (tap only)
- Shows summary/status
- Fast execution
- Auto-refresh on schedule
```

### Mode 2: App Mode
```
- Launched from Scriptable app
- Full UI interaction
- Multiple actions available
- Can show detailed tables/lists
- User-driven execution
```

### Mode 3: Automation Mode
```
- Triggered by iOS Shortcuts
- Background execution
- Scheduled tasks
- No UI (notifications only)
- Logged execution
```

## Key Design Principles

1. **Modularity**: Each tool is independent and can work standalone
2. **Reusability**: Core library (iOSDevTools) shared by all tools
3. **Security**: Sensitive data stored in iOS Keychain
4. **Flexibility**: Works in widget, app, and automation modes
5. **Simplicity**: Clear APIs and comprehensive documentation
6. **Extensibility**: Easy to add new agents and tools

## Performance Considerations

1. **Caching**: API responses cached to reduce network calls
2. **Lazy Loading**: Tools loaded only when needed
3. **Async Operations**: Non-blocking I/O for better responsiveness
4. **Retry Logic**: Automatic retries with exponential backoff
5. **Resource Limits**: File history and logs capped to prevent bloat

## Error Handling Strategy

```
User Action
    │
    ▼
Try Execute
    │
    ├─► Success ──► Return Result ──► Log Success
    │
    └─► Error
        │
        ├─► Retry? (if network error)
        │   └─► Exponential Backoff
        │
        ├─► Log Error
        │
        └─► User Notification
            └─► Show Error Message
```

## Future Extensibility

The architecture supports adding:
- New agents (e.g., Slack Agent, Jira Agent)
- New automation actions
- Custom AI prompt templates
- Additional storage providers
- Third-party API integrations

---

**Architecture Version:** 1.0
**Last Updated:** 2026-01-30
