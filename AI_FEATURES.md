# AI Features Documentation

## Overview

This repository includes advanced AI-powered features and capabilities for autonomous operation on iPhone using the Scriptable app. These features leverage modern AI services (OpenAI, Claude) to provide intelligent automation, natural language processing, image analysis, and smart notifications.

## Table of Contents

- [AI Utilities Library](#ai-utilities-library)
- [API Integration Helpers](#api-integration-helpers)
- [AI-Powered Scripts](#ai-powered-scripts)
- [Setup & Configuration](#setup--configuration)
- [Usage Examples](#usage-examples)
- [External Integrations](#external-integrations)

---

## AI Utilities Library

### Location
`lib/ai-utils.js`

### Features

The AI utilities library provides a comprehensive set of tools for integrating AI capabilities into your Scriptable scripts.

#### AIService Class
Unified interface for different AI providers (OpenAI, Claude).

**Methods:**
- `chat(prompt, options)` - Send chat completion requests
- `analyzeImage(image, prompt, options)` - Analyze images with AI vision

**Example:**
```javascript
const { AIService } = importModule("lib/ai-utils");

const ai = new AIService("openai", "your-api-key");
const response = await ai.chat("What's the weather like today?");
console.log(response);
```

#### AITextUtils Class
AI-powered text processing utilities.

**Methods:**
- `summarize(text, maxLength)` - Summarize long text
- `generateSuggestions(context, count)` - Generate smart suggestions
- `improveText(text, style)` - Improve or rewrite text
- `extractInfo(text, fields)` - Extract structured information
- `analyzeSentiment(text)` - Analyze sentiment
- `generateContent(topic, type)` - Generate creative content

**Example:**
```javascript
const { AIService, AITextUtils } = importModule("lib/ai-utils");

const ai = new AIService("openai", "your-api-key");
const textUtils = new AITextUtils(ai);

const summary = await textUtils.summarize(longArticle, 100);
const sentiment = await textUtils.analyzeSentiment(userReview);
```

#### AIAutomation Class
Smart automation helpers for intelligent workflows.

**Methods:**
- `generateSmartNotification(context)` - Create context-aware notifications
- `parseTask(naturalLanguage)` - Convert natural language to structured tasks
- `suggestResponses(message, context)` - Generate message response suggestions

**Example:**
```javascript
const { AIService, AIAutomation } = importModule("lib/ai-utils");

const ai = new AIService("openai", "your-api-key");
const automation = new AIAutomation(ai);

const task = await automation.parseTask("Remind me to call mom tomorrow at 3pm");
console.log(task); // { title: "Call mom", dueDate: "...", priority: "medium" }
```

### Configuration

Edit `lib/ai-utils.js` to set default API keys:

```javascript
const AI_CONFIG = {
    openai: {
        apiKey: "your-openai-api-key",
        defaultModel: "gpt-4o-mini"
    },
    claude: {
        apiKey: "your-anthropic-api-key",
        defaultModel: "claude-3-5-sonnet-20241022"
    }
};
```

---

## API Integration Helpers

### Location
`lib/api-helpers.js`

### Features

Comprehensive utilities for integrating external APIs and services.

#### APIClient Class
Generic REST API client for any HTTP-based API.

**Methods:**
- `get(endpoint, params, headers)` - GET request
- `post(endpoint, body, headers)` - POST request
- `put(endpoint, body, headers)` - PUT request
- `delete(endpoint, headers)` - DELETE request

**Example:**
```javascript
const { APIClient } = importModule("lib/api-helpers");

const api = new APIClient("https://api.example.com", {
    "Authorization": "Bearer your-token"
});

const data = await api.get("/users", { limit: 10 });
```

#### WebhookManager Class
Send data to webhooks (IFTTT, Zapier, Make, etc.).

**Methods:**
- `send(webhookURL, payload, options)` - Generic webhook
- `sendToIFTTT(eventName, key, values)` - IFTTT integration
- `sendToZapier(webhookURL, data)` - Zapier integration
- `sendToMake(webhookURL, data)` - Make integration

**Example:**
```javascript
const { WebhookManager } = importModule("lib/api-helpers");

const webhooks = new WebhookManager();
await webhooks.sendToIFTTT("event_name", "your-key", {
    value1: "Hello",
    value2: "World"
});
```

#### AuthHelper Class
Manage API authentication.

**Methods:**
- `basicAuth(username, password)` - Basic authentication
- `bearerAuth(token)` - Bearer token authentication
- `apiKeyAuth(apiKey, headerName)` - API key authentication

#### CommonAPIs Class
Pre-configured clients for popular services.

**Methods:**
- `notion(apiKey)` - Notion API client
- `airtable(apiKey, baseId)` - Airtable client
- `github(token)` - GitHub API client
- `slack(token)` - Slack API client
- `telegram(botToken)` - Telegram Bot API client
- `discordWebhook(webhookURL, content, options)` - Discord webhooks

**Example:**
```javascript
const { CommonAPIs } = importModule("lib/api-helpers");

const github = CommonAPIs.github("your-github-token");
const repos = await github.get("/user/repos");
```

#### DataStorage Class
Store and retrieve data from iCloud or local storage.

**Methods:**
- `save(data)` - Save data
- `load()` - Load data
- `exists()` - Check if file exists
- `delete()` - Delete file

**Example:**
```javascript
const { DataStorage } = importModule("lib/api-helpers");

const storage = new DataStorage("mydata.json", true);
await storage.save({ preferences: { theme: "dark" } });
const data = await storage.load();
```

---

## AI-Powered Scripts

### 1. AIAssistant.js

AI-powered assistant for quick tasks and queries.

**Features:**
- Ask questions using AI
- Summarize clipboard text
- Analyze images
- Generate creative content
- Improve text
- Get smart suggestions
- Extract information

**Usage:**

*In Scriptable app:*
1. Open Scriptable
2. Tap "AIAssistant"
3. Choose an action from the menu
4. Follow prompts

*From Shortcuts:*
```
Run Script "AIAssistant"
  - action: "ask"
  - question: "What's the capital of France?"
  - apiKey: "your-api-key"
```

**Configuration:**
```javascript
const AI_PROVIDER = "openai"; // or "claude"
const API_KEY = "your-api-key";
```

### 2. SmartNotifications.js

Context-aware intelligent notifications.

**Features:**
- Morning briefings
- Weather-based alerts
- Calendar summaries
- Evening reflections
- Motivational messages
- Custom context notifications

**Usage:**

*In Scriptable app:*
Run directly for interactive menu.

*From iOS Automations:*
```
Run Script "SmartNotifications"
  - type: "morning_briefing"
  - apiKey: "your-api-key"
```

**Automation Examples:**
- Daily at 7am: Morning Briefing
- Daily at 8pm: Evening Summary
- Hourly: Weather Alerts

### 3. AIPhotoAnalyzer.js

Analyze photos with AI vision capabilities.

**Features:**
- Describe photo content
- Extract text (OCR)
- Identify objects and scenes
- Suggest tags for organization
- Generate accessibility descriptions
- Get photo improvement recommendations

**Usage:**

*In Scriptable app:*
1. Run script
2. Select analysis type
3. Choose photo from library

*From Share Sheet:*
1. Open photo in Photos app
2. Tap Share
3. Select "Run Script"
4. Choose "AIPhotoAnalyzer"

**Configuration:**
Requires OpenAI API key for vision features.

### 4. SmartReminders.js

Natural language reminder creation with AI.

**Features:**
- Natural language parsing
- Smart time interpretation
- Priority detection
- Recurring reminder support
- Context-aware scheduling

**Usage:**

*In Scriptable app:*
Run script and enter reminder in natural language.

*Examples of natural language input:*
- "Remind me tomorrow at 3pm to call mom"
- "Buy groceries this Saturday"
- "Daily reminder to take vitamins at 8am"
- "Pay rent on the first of every month"

**From Siri Shortcuts:**
```
Get text from "Remind me to..."
Run Script "SmartReminders"
  - text: [Input]
  - apiKey: "your-api-key"
```

---

## Setup & Configuration

### 1. Install Scripts

Download all scripts to your iCloud Drive:

```
iCloud Drive/
├─ Scriptable/
│  ├─ lib/
│  │  ├─ ai-utils.js
│  │  ├─ api-helpers.js
│  │  └─ interactive-utils.js
│  ├─ AIAssistant.js
│  ├─ SmartNotifications.js
│  ├─ AIPhotoAnalyzer.js
│  └─ SmartReminders.js
```

### 2. Get API Keys

**OpenAI:**
1. Visit https://platform.openai.com/api-keys
2. Create an account or sign in
3. Generate a new API key
4. Copy and save securely

**Anthropic (Claude):**
1. Visit https://console.anthropic.com/
2. Create an account or sign in
3. Navigate to API Keys
4. Generate a new key
5. Copy and save securely

### 3. Configure Scripts

Option A: Set API key in each script:
```javascript
const API_KEY = "your-api-key";
```

Option B: Set in library (affects all scripts):
```javascript
// In lib/ai-utils.js
const AI_CONFIG = {
    openai: {
        apiKey: "your-openai-api-key",
        ...
    }
};
```

Option C: Provide at runtime (most secure):
Scripts will prompt for API key when needed.

### 4. Test Installation

Run `AIAssistant.js` in Scriptable:
1. Open Scriptable app
2. Tap "AIAssistant"
3. Choose "Ask a Question"
4. Enter API key if prompted
5. Ask a simple question

If you get a response, installation is successful!

---

## Usage Examples

### Example 1: Daily Morning Automation

Create an iOS Automation:
1. Open Shortcuts app
2. Go to Automation tab
3. Create "Time of Day" automation (7:00 AM)
4. Add "Run Script" action
5. Select "SmartNotifications"
6. Add parameters: `type: "morning_briefing"`

### Example 2: Quick Photo OCR

1. Take photo of document/text
2. Open Shortcuts app
3. Create shortcut:
   - "Take Photo"
   - "Run Script: AIPhotoAnalyzer"
   - Parameters: `action: "ocr"`
   - "Copy to Clipboard"

### Example 3: Text Summarization Widget

Create a shortcut:
1. "Get Clipboard"
2. "Run Script: AIAssistant"
   - `action: "summarize"`
   - `text: [Clipboard]`
3. "Show Result"

### Example 4: Smart Task Creation

Using Siri:
1. "Hey Siri, remind me to..."
2. Shortcut captures text
3. Runs SmartReminders with text
4. AI parses and creates reminder

---

## External Integrations

### Notion Integration

```javascript
const { CommonAPIs } = importModule("lib/api-helpers");

const notion = CommonAPIs.notion("your-notion-key");

// Query database
const results = await notion.post("/databases/DATABASE_ID/query", {
    filter: { property: "Status", select: { equals: "In Progress" } }
});
```

### Slack Integration

```javascript
const { CommonAPIs } = importModule("lib/api-helpers");

const slack = CommonAPIs.slack("your-slack-token");

// Post message
await slack.post("/chat.postMessage", {
    channel: "#general",
    text: "Hello from Scriptable!"
});
```

### IFTTT Integration

```javascript
const { WebhookManager } = importModule("lib/api-helpers");

const webhooks = new WebhookManager();

await webhooks.sendToIFTTT("scriptable_event", "your-ifttt-key", {
    value1: "Temperature: 72°F",
    value2: "Sunny",
    value3: new Date().toLocaleString()
});
```

### Discord Notifications

```javascript
const { CommonAPIs } = importModule("lib/api-helpers");

await CommonAPIs.discordWebhook(
    "your-discord-webhook-url",
    "🤖 Automated message from iPhone!",
    {
        username: "Scriptable Bot",
        embeds: [{
            title: "Daily Report",
            description: "All systems operational",
            color: 0x00ff00
        }]
    }
);
```

### GitHub Integration

```javascript
const { CommonAPIs } = importModule("lib/api-helpers");

const github = CommonAPIs.github("your-github-token");

// Create an issue
await github.post("/repos/owner/repo/issues", {
    title: "Bug report from mobile",
    body: "Description of the issue",
    labels: ["bug", "mobile"]
});
```

---

## Best Practices

### 1. API Key Security
- Never commit API keys to public repositories
- Use script prompts for sensitive keys
- Consider using iOS Keychain for storage

### 2. Rate Limiting
- Be mindful of API rate limits
- Use the `RateLimiter` class for high-volume operations
- Cache responses when appropriate

### 3. Error Handling
- Always wrap API calls in try-catch blocks
- Provide user-friendly error messages
- Log errors for debugging

### 4. Performance
- Keep prompts concise for faster responses
- Use appropriate token limits
- Consider response time for user experience

### 5. Privacy
- Be cautious with sensitive data in prompts
- Review AI provider privacy policies
- Consider on-device processing when possible

---

## Troubleshooting

### "API key not configured"
- Check API key is set in script or library
- Ensure no extra spaces in API key
- Verify key is valid and active

### "Network request failed"
- Check internet connection
- Verify API endpoint URLs
- Check for service outages

### "Import module failed"
- Ensure `lib/` folder exists in Scriptable directory
- Verify file names match import statements
- Check files are properly synced to iCloud

### "Rate limit exceeded"
- Wait before making more requests
- Use RateLimiter class
- Consider upgrading API plan

---

## Advanced Features

### Custom AI Providers

You can extend the `AIService` class to support additional providers:

```javascript
class CustomAIService extends AIService {
    async _chatCustomProvider(prompt, model, maxTokens) {
        // Implement custom provider logic
    }
}
```

### Chaining AI Operations

Combine multiple AI operations:

```javascript
const ai = new AIService("openai", apiKey);
const textUtils = new AITextUtils(ai);

// 1. Extract info from image
const imageText = await ai.analyzeImage(photo, "Extract all text");

// 2. Summarize extracted text
const summary = await textUtils.summarize(imageText);

// 3. Generate action items
const actions = await textUtils.generateSuggestions(summary);
```

### Building Custom Workflows

Create complex automation workflows:

```javascript
// Morning routine automation
const context = await gatherContextData();
const ai = new AIService("openai", apiKey);
const automation = new AIAutomation(ai);

// Generate personalized briefing
const briefing = await automation.generateSmartNotification(context);

// Send to multiple channels
await sendToSlack(briefing);
await sendToNotion(briefing);
await createReminder(briefing);
```

---

## Contributing

Contributions are welcome! Ideas for improvements:

- Additional AI providers (Google AI, Mistral, etc.)
- More ready-to-use scripts
- Widget implementations
- Enhanced error handling
- Performance optimizations

---

## Credits

Built with:
- **Scriptable** by Simon Støvring
- **OpenAI API** for GPT models
- **Anthropic API** for Claude models

---

## License

This project follows the same license as the main repository.

---

## Support

For issues or questions:
1. Check this documentation
2. Review script comments
3. Test with simple examples
4. Check AI provider documentation
5. Open an issue on GitHub

---

**Happy Automating! 🚀**
