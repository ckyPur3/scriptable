/*------------------------------------------------------------------------------------------------------
Script: AIAssistant.js
Author: AI Features
Description: AI-powered assistant for quick tasks and queries on iPhone
Version: 1.0.0

Features:
- Answer questions using AI
- Summarize text from clipboard
- Generate creative content
- Smart suggestions and ideas
- Image analysis
- Text improvements

Usage:
1. Run directly in Scriptable app for interactive menu
2. Use Siri Shortcuts with parameters
3. Run from widget for quick actions

Configuration:
- Set your AI provider API key below
- Choose between OpenAI or Claude
-----------------------------------------------------------------------------------------------------*/

// Import AI utilities
const { AIService, AITextUtils, AIAutomation } = importModule("lib/ai-utils");

// ===== CONFIGURATION =====
const AI_PROVIDER = "openai"; // "openai" or "claude"
const API_KEY = ""; // Set your API key here or it will prompt you
                    // SECURITY: Do not commit API keys to version control!

// ===== MAIN SCRIPT =====

/**
 * Main function
 */
async function main() {
    // Check if running with parameters (from Shortcuts)
    if (args.queryParameters && args.queryParameters.action) {
        await handleShortcutAction(args.queryParameters);
        return;
    }
    
    // Show interactive menu
    await showMainMenu();
}

/**
 * Show interactive menu
 */
async function showMainMenu() {
    const menu = new Alert();
    menu.title = "AI Assistant";
    menu.message = "What would you like to do?";
    
    menu.addAction("Ask a Question");
    menu.addAction("Summarize Clipboard");
    menu.addAction("Analyze Image");
    menu.addAction("Generate Content");
    menu.addAction("Improve Text");
    menu.addAction("Get Suggestions");
    menu.addAction("Extract Information");
    menu.addAction("Smart Notification");
    menu.addCancelAction("Cancel");
    
    const choice = await menu.presentAlert();
    
    switch (choice) {
        case 0:
            await askQuestion();
            break;
        case 1:
            await summarizeClipboard();
            break;
        case 2:
            await analyzeImage();
            break;
        case 3:
            await generateContent();
            break;
        case 4:
            await improveText();
            break;
        case 5:
            await getSuggestions();
            break;
        case 6:
            await extractInformation();
            break;
        case 7:
            await createSmartNotification();
            break;
    }
}

/**
 * Get or prompt for API key
 */
async function getAPIKey() {
    if (API_KEY) {
        return API_KEY;
    }
    
    const alert = new Alert();
    alert.title = "API Key Required";
    alert.message = `Enter your ${AI_PROVIDER.toUpperCase()} API key:`;
    alert.addTextField("API Key");
    alert.addAction("OK");
    alert.addCancelAction("Cancel");
    
    const response = await alert.presentAlert();
    if (response === -1) {
        throw new Error("API key required");
    }
    
    return alert.textFieldValue(0);
}

/**
 * Ask a question
 */
async function askQuestion() {
    const alert = new Alert();
    alert.title = "Ask a Question";
    alert.message = "What would you like to know?";
    alert.addTextField("Your question");
    alert.addAction("Ask");
    alert.addCancelAction("Cancel");
    
    const response = await alert.presentAlert();
    if (response === -1) return;
    
    const question = alert.textFieldValue(0);
    if (!question) return;
    
    try {
        const apiKey = await getAPIKey();
        const ai = new AIService(AI_PROVIDER, apiKey);
        
        const notification = new Notification();
        notification.title = "AI Assistant";
        notification.body = "Thinking...";
        await notification.schedule(); // Immediate notification (no date parameter)
        
        const answer = await ai.chat(question);
        
        await showResult("Answer", answer);
    } catch (error) {
        await showError(error);
    }
}

/**
 * Summarize clipboard content
 */
async function summarizeClipboard() {
    try {
        const clipboardText = await Pasteboard.paste();
        
        if (!clipboardText || typeof clipboardText !== 'string') {
            await showError(new Error("No text found in clipboard"));
            return;
        }
        
        const apiKey = await getAPIKey();
        const ai = new AIService(AI_PROVIDER, apiKey);
        const textUtils = new AITextUtils(ai);
        
        const notification = new Notification();
        notification.title = "AI Assistant";
        notification.body = "Summarizing...";
        await notification.schedule(); // Immediate notification
        
        const summary = await textUtils.summarize(clipboardText, 100);
        
        await showResult("Summary", summary, true);
    } catch (error) {
        await showError(error);
    }
}

/**
 * Analyze an image
 */
async function analyzeImage() {
    try {
        const photos = await Photos.fromLibrary();
        if (!photos || photos.length === 0) {
            return;
        }
        
        const alert = new Alert();
        alert.title = "Image Analysis";
        alert.message = "What would you like to know about this image?";
        alert.addTextField("Your question", "What's in this image?");
        alert.addAction("Analyze");
        alert.addCancelAction("Cancel");
        
        const response = await alert.presentAlert();
        if (response === -1) return;
        
        const question = alert.textFieldValue(0);
        
        const apiKey = await getAPIKey();
        const ai = new AIService(AI_PROVIDER, apiKey);
        
        const notification = new Notification();
        notification.title = "AI Assistant";
        notification.body = "Analyzing image...";
        await notification.schedule(); // Immediate notification
        
        const analysis = await ai.analyzeImage(photos[0], question);
        
        await showResult("Image Analysis", analysis);
    } catch (error) {
        await showError(error);
    }
}

/**
 * Generate creative content
 */
async function generateContent() {
    const typeAlert = new Alert();
    typeAlert.title = "Generate Content";
    typeAlert.message = "What type of content?";
    typeAlert.addAction("Inspiring Quote");
    typeAlert.addAction("Joke");
    typeAlert.addAction("Interesting Fact");
    typeAlert.addAction("Short Story");
    typeAlert.addCancelAction("Cancel");
    
    const typeChoice = await typeAlert.presentAlert();
    if (typeChoice === -1) return;
    
    const types = ["quote", "joke", "fact", "story"];
    const selectedType = types[typeChoice];
    
    const topicAlert = new Alert();
    topicAlert.title = "Content Topic";
    topicAlert.message = "What topic?";
    topicAlert.addTextField("Topic", "technology");
    topicAlert.addAction("Generate");
    topicAlert.addCancelAction("Cancel");
    
    const topicResponse = await topicAlert.presentAlert();
    if (topicResponse === -1) return;
    
    const topic = topicAlert.textFieldValue(0);
    
    try {
        const apiKey = await getAPIKey();
        const ai = new AIService(AI_PROVIDER, apiKey);
        const textUtils = new AITextUtils(ai);
        
        const content = await textUtils.generateContent(topic, selectedType);
        
        await showResult("Generated Content", content, true);
    } catch (error) {
        await showError(error);
    }
}

/**
 * Improve text
 */
async function improveText() {
    const inputAlert = new Alert();
    inputAlert.title = "Improve Text";
    inputAlert.message = "Enter text to improve:";
    inputAlert.addTextField("Text");
    inputAlert.addAction("Next");
    inputAlert.addCancelAction("Cancel");
    
    const inputResponse = await inputAlert.presentAlert();
    if (inputResponse === -1) return;
    
    const text = inputAlert.textFieldValue(0);
    if (!text) return;
    
    const styleAlert = new Alert();
    styleAlert.title = "Select Style";
    styleAlert.message = "How should the text be improved?";
    styleAlert.addAction("More Concise");
    styleAlert.addAction("More Detailed");
    styleAlert.addAction("More Formal");
    styleAlert.addAction("More Casual");
    styleAlert.addCancelAction("Cancel");
    
    const styleChoice = await styleAlert.presentAlert();
    if (styleChoice === -1) return;
    
    const styles = ["concise", "detailed", "formal", "casual"];
    const selectedStyle = styles[styleChoice];
    
    try {
        const apiKey = await getAPIKey();
        const ai = new AIService(AI_PROVIDER, apiKey);
        const textUtils = new AITextUtils(ai);
        
        const improved = await textUtils.improveText(text, selectedStyle);
        
        await showResult("Improved Text", improved, true);
    } catch (error) {
        await showError(error);
    }
}

/**
 * Get suggestions
 */
async function getSuggestions() {
    const alert = new Alert();
    alert.title = "Get Suggestions";
    alert.message = "What do you need suggestions for?";
    alert.addTextField("Context or topic");
    alert.addAction("Generate");
    alert.addCancelAction("Cancel");
    
    const response = await alert.presentAlert();
    if (response === -1) return;
    
    const context = alert.textFieldValue(0);
    if (!context) return;
    
    try {
        const apiKey = await getAPIKey();
        const ai = new AIService(AI_PROVIDER, apiKey);
        const textUtils = new AITextUtils(ai);
        
        const suggestions = await textUtils.generateSuggestions(context, 5);
        
        const resultText = suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n\n');
        await showResult("Suggestions", resultText, true);
    } catch (error) {
        await showError(error);
    }
}

/**
 * Extract information
 */
async function extractInformation() {
    const textAlert = new Alert();
    textAlert.title = "Extract Information";
    textAlert.message = "Enter text to analyze:";
    textAlert.addTextField("Text");
    textAlert.addAction("Next");
    textAlert.addCancelAction("Cancel");
    
    const textResponse = await textAlert.presentAlert();
    if (textResponse === -1) return;
    
    const text = textAlert.textFieldValue(0);
    if (!text) return;
    
    const fieldsAlert = new Alert();
    fieldsAlert.title = "What to Extract";
    fieldsAlert.message = "Enter fields to extract (comma-separated):";
    fieldsAlert.addTextField("Fields", "date, location, person");
    fieldsAlert.addAction("Extract");
    fieldsAlert.addCancelAction("Cancel");
    
    const fieldsResponse = await fieldsAlert.presentAlert();
    if (fieldsResponse === -1) return;
    
    const fieldsInput = fieldsAlert.textFieldValue(0);
    const fields = fieldsInput.split(',').map(f => f.trim());
    
    try {
        const apiKey = await getAPIKey();
        const ai = new AIService(AI_PROVIDER, apiKey);
        const textUtils = new AITextUtils(ai);
        
        const extracted = await textUtils.extractInfo(text, fields);
        
        const resultText = JSON.stringify(extracted, null, 2);
        await showResult("Extracted Information", resultText);
    } catch (error) {
        await showError(error);
    }
}

/**
 * Create smart notification
 */
async function createSmartNotification() {
    try {
        const apiKey = await getAPIKey();
        const ai = new AIService(AI_PROVIDER, apiKey);
        const automation = new AIAutomation(ai);
        
        // Get current context
        const now = new Date();
        const context = {
            time: now.toLocaleTimeString(),
            date: now.toLocaleDateString(),
            dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' })
        };
        
        const notificationData = await automation.generateSmartNotification(context);
        
        const notification = new Notification();
        notification.title = notificationData.title;
        notification.body = notificationData.body;
        notification.sound = "default";
        await notification.schedule();
        
        await showResult("Notification Sent", `Title: ${notificationData.title}\n\nBody: ${notificationData.body}`);
    } catch (error) {
        await showError(error);
    }
}

/**
 * Handle Shortcuts actions
 */
async function handleShortcutAction(params) {
    const action = params.action;
    
    try {
        const apiKey = params.apiKey || API_KEY;
        if (!apiKey) {
            throw new Error("API key required");
        }
        
        const ai = new AIService(AI_PROVIDER, apiKey);
        
        switch (action) {
            case "ask":
                const answer = await ai.chat(params.question);
                Script.setShortcutOutput(answer);
                break;
                
            case "summarize":
                const textUtils = new AITextUtils(ai);
                const summary = await textUtils.summarize(params.text);
                Script.setShortcutOutput(summary);
                break;
                
            default:
                throw new Error(`Unknown action: ${action}`);
        }
    } catch (error) {
        Script.setShortcutOutput(`Error: ${error.message}`);
    }
}

/**
 * Show result
 */
async function showResult(title, text, copyToClipboard = false) {
    const alert = new Alert();
    alert.title = title;
    alert.message = text;
    
    if (copyToClipboard) {
        alert.addAction("Copy to Clipboard");
    }
    alert.addAction("OK");
    
    const response = await alert.presentAlert();
    
    if (response === 0 && copyToClipboard) {
        Pasteboard.copy(text);
        
        const notification = new Notification();
        notification.title = "Copied";
        notification.body = "Text copied to clipboard";
        await notification.schedule(); // Immediate notification
    }
}

/**
 * Show error
 */
async function showError(error) {
    const alert = new Alert();
    alert.title = "Error";
    alert.message = error.message || String(error);
    alert.addAction("OK");
    await alert.presentAlert();
}

// Run main function
await main();
