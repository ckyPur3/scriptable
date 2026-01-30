/*------------------------------------------------------------------------------------------------------
Script: SmartReminders.js
Author: AI Features
Description: AI-powered smart reminders that understand context and create helpful notifications
Version: 1.0.0

Features:
- Natural language reminder parsing
- Smart reminder scheduling
- Context-aware notifications
- Location-based reminders (with AI suggestions)
- Recurring reminder intelligence
- Priority detection

Usage:
1. Run directly to create reminders with natural language
2. Use with Siri Shortcuts: "Remind me to..."
3. Parse complex reminder requests

Configuration:
- Set AI provider and API key
-----------------------------------------------------------------------------------------------------*/

// Import libraries
const { AIService, AIAutomation } = importModule("lib/ai-utils");

// ===== CONFIGURATION =====
const AI_PROVIDER = "openai"; // "openai" or "claude"
const API_KEY = ""; // Set your API key here

// ===== MAIN SCRIPT =====

/**
 * Main function
 */
async function main() {
    // Check if running with text input
    if (args.plainTexts && args.plainTexts.length > 0) {
        await createReminderFromText(args.plainTexts[0]);
        return;
    }
    
    if (args.queryParameters && args.queryParameters.text) {
        await createReminderFromText(args.queryParameters.text);
        return;
    }
    
    // Show interactive menu
    await showMainMenu();
}

/**
 * Show main menu
 */
async function showMainMenu() {
    const menu = new Alert();
    menu.title = "Smart Reminders";
    menu.message = "Create intelligent reminders:";
    
    menu.addAction("Create from Natural Language");
    menu.addAction("Quick Reminder");
    menu.addAction("Recurring Reminder");
    menu.addAction("Location-Based");
    menu.addCancelAction("Cancel");
    
    const choice = await menu.presentAlert();
    
    switch (choice) {
        case 0:
            await createNaturalLanguageReminder();
            break;
        case 1:
            await createQuickReminder();
            break;
        case 2:
            await createRecurringReminder();
            break;
        case 3:
            await createLocationReminder();
            break;
    }
}

/**
 * Create reminder from natural language
 */
async function createNaturalLanguageReminder() {
    const alert = new Alert();
    alert.title = "Natural Language Reminder";
    alert.message = "Describe your reminder in natural language:";
    alert.addTextField("E.g., Remind me tomorrow at 3pm to call mom");
    alert.addAction("Create");
    alert.addCancelAction("Cancel");
    
    const response = await alert.presentAlert();
    if (response === -1) return;
    
    const text = alert.textFieldValue(0);
    await createReminderFromText(text);
}

/**
 * Create reminder from text using AI
 */
async function createReminderFromText(text) {
    try {
        // Get API key
        let apiKey = API_KEY;
        if (!apiKey) {
            const alert = new Alert();
            alert.title = "API Key Required";
            alert.message = `Enter your ${AI_PROVIDER.toUpperCase()} API key:`;
            alert.addTextField("API Key");
            alert.addAction("OK");
            alert.addCancelAction("Cancel");
            
            const response = await alert.presentAlert();
            if (response === -1) return;
            
            apiKey = alert.textFieldValue(0);
        }
        
        const ai = new AIService(AI_PROVIDER, apiKey);
        
        // Parse reminder using AI
        const reminderData = await parseReminderText(ai, text);
        
        // Confirm with user
        const confirmed = await confirmReminder(reminderData);
        if (!confirmed) return;
        
        // Create the reminder
        await createReminder(reminderData);
        
        // Show success
        await showSuccess(reminderData);
        
    } catch (error) {
        console.error("Error creating reminder:", error);
        await showError(error);
    }
}

/**
 * Parse reminder text using AI
 */
async function parseReminderText(ai, text) {
    const now = new Date();
    const currentDate = now.toISOString();
    
    const prompt = `Parse this reminder request: "${text}"

Current date/time: ${currentDate}

Return a JSON object with:
- title: Brief title for the reminder
- notes: Optional notes or details
- dueDate: ISO 8601 date/time string (or null for no specific time)
- isAllDay: boolean
- priority: number 0-9 (0=none, 1=high, 5=medium, 9=low)
- repeat: null or object with {interval: "daily"|"weekly"|"monthly", frequency: number}

Be smart about interpreting relative times like "tomorrow", "next week", "in 2 hours", etc.`;
    
    const response = await ai.chat(prompt, {
        systemPrompt: "You parse natural language into structured reminder data. Return only valid JSON.",
        maxTokens: 300
    });
    
    try {
        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return JSON.parse(response);
    } catch (e) {
        console.error("Failed to parse AI response:", response);
        throw new Error("Could not parse reminder. Please try rephrasing.");
    }
}

/**
 * Confirm reminder with user
 */
async function confirmReminder(reminderData) {
    const dateStr = reminderData.dueDate 
        ? new Date(reminderData.dueDate).toLocaleString()
        : "No specific time";
    
    const priorityLabels = {
        0: "None",
        1: "High",
        5: "Medium",
        9: "Low"
    };
    const priorityStr = priorityLabels[reminderData.priority] || "Medium";
    
    const repeatStr = reminderData.repeat 
        ? `Repeats ${reminderData.repeat.interval}`
        : "Does not repeat";
    
    const message = `Title: ${reminderData.title}
    
${reminderData.notes ? `Notes: ${reminderData.notes}\n` : ''}
Due: ${dateStr}
Priority: ${priorityStr}
${repeatStr}`;
    
    const alert = new Alert();
    alert.title = "Confirm Reminder";
    alert.message = message;
    alert.addAction("Create");
    alert.addCancelAction("Cancel");
    
    const response = await alert.presentAlert();
    return response === 0;
}

/**
 * Create the actual reminder
 */
async function createReminder(reminderData) {
    const reminder = new Reminder();
    reminder.title = reminderData.title;
    
    if (reminderData.notes) {
        reminder.notes = reminderData.notes;
    }
    
    if (reminderData.dueDate) {
        reminder.dueDate = new Date(reminderData.dueDate);
        reminder.dueDateIncludesTime = !reminderData.isAllDay;
    }
    
    reminder.priority = reminderData.priority || 0;
    
    // Set recurrence if specified
    if (reminderData.repeat) {
        const recurrence = new RecurrenceRule();
        
        switch (reminderData.repeat.interval) {
            case "daily":
                recurrence.interval = 1;
                recurrence.frequency = RecurrenceRule.Frequency.daily;
                break;
            case "weekly":
                recurrence.interval = 1;
                recurrence.frequency = RecurrenceRule.Frequency.weekly;
                break;
            case "monthly":
                recurrence.interval = 1;
                recurrence.frequency = RecurrenceRule.Frequency.monthly;
                break;
        }
        
        reminder.recurrenceRule = recurrence;
    }
    
    await reminder.save();
}

/**
 * Create quick reminder (simple)
 */
async function createQuickReminder() {
    const titleAlert = new Alert();
    titleAlert.title = "Quick Reminder";
    titleAlert.message = "What do you want to remember?";
    titleAlert.addTextField("Reminder title");
    titleAlert.addAction("Next");
    titleAlert.addCancelAction("Cancel");
    
    const titleResponse = await titleAlert.presentAlert();
    if (titleResponse === -1) return;
    
    const title = titleAlert.textFieldValue(0);
    if (!title) return;
    
    const timeAlert = new Alert();
    timeAlert.title = "When?";
    timeAlert.message = "Set a time for this reminder:";
    timeAlert.addAction("In 1 hour");
    timeAlert.addAction("In 3 hours");
    timeAlert.addAction("Tomorrow morning");
    timeAlert.addAction("Tomorrow evening");
    timeAlert.addAction("Next week");
    timeAlert.addCancelAction("No time");
    
    const timeResponse = await timeAlert.presentAlert();
    
    let dueDate = null;
    const now = new Date();
    
    switch (timeResponse) {
        case 0: // 1 hour
            dueDate = new Date(now.getTime() + 60 * 60 * 1000);
            break;
        case 1: // 3 hours
            dueDate = new Date(now.getTime() + 3 * 60 * 60 * 1000);
            break;
        case 2: // Tomorrow morning
            dueDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0);
            break;
        case 3: // Tomorrow evening
            dueDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0);
            break;
        case 4: // Next week
            dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
    }
    
    const reminder = new Reminder();
    reminder.title = title;
    if (dueDate) {
        reminder.dueDate = dueDate;
        reminder.dueDateIncludesTime = true;
    }
    
    await reminder.save();
    
    await showSuccess({ title, dueDate });
}

/**
 * Create recurring reminder
 */
async function createRecurringReminder() {
    const alert = new Alert();
    alert.title = "Recurring Reminder";
    alert.message = "What should repeat?";
    alert.addTextField("Reminder title");
    alert.addAction("Next");
    alert.addCancelAction("Cancel");
    
    const response = await alert.presentAlert();
    if (response === -1) return;
    
    const title = alert.textFieldValue(0);
    if (!title) return;
    
    const repeatAlert = new Alert();
    repeatAlert.title = "How often?";
    repeatAlert.addAction("Daily");
    repeatAlert.addAction("Weekly");
    repeatAlert.addAction("Monthly");
    repeatAlert.addCancelAction("Cancel");
    
    const repeatResponse = await repeatAlert.presentAlert();
    if (repeatResponse === -1) return;
    
    const reminder = new Reminder();
    reminder.title = title;
    
    const recurrence = new RecurrenceRule();
    recurrence.interval = 1;
    
    switch (repeatResponse) {
        case 0:
            recurrence.frequency = RecurrenceRule.Frequency.daily;
            break;
        case 1:
            recurrence.frequency = RecurrenceRule.Frequency.weekly;
            break;
        case 2:
            recurrence.frequency = RecurrenceRule.Frequency.monthly;
            break;
    }
    
    reminder.recurrenceRule = recurrence;
    await reminder.save();
    
    await showSuccess({ title, repeat: true });
}

/**
 * Create location-based reminder
 */
async function createLocationReminder() {
    const alert = new Alert();
    alert.title = "Location Reminder";
    alert.message = "This feature requires manual location setup in the Reminders app after creation.";
    alert.addTextField("Reminder title");
    alert.addAction("Create");
    alert.addCancelAction("Cancel");
    
    const response = await alert.presentAlert();
    if (response === -1) return;
    
    const title = alert.textFieldValue(0);
    if (!title) return;
    
    const reminder = new Reminder();
    reminder.title = title;
    reminder.notes = "Set location trigger in Reminders app";
    
    await reminder.save();
    
    const confirmAlert = new Alert();
    confirmAlert.title = "Reminder Created";
    confirmAlert.message = "Please open Reminders app to set location trigger.";
    confirmAlert.addAction("OK");
    await confirmAlert.presentAlert();
}

/**
 * Show success message
 */
async function showSuccess(reminderData) {
    const dateStr = reminderData.dueDate 
        ? `\n\nDue: ${reminderData.dueDate.toLocaleString()}`
        : "";
    
    const repeatStr = reminderData.repeat ? "\n\nRepeats regularly" : "";
    
    const alert = new Alert();
    alert.title = "✓ Reminder Created";
    alert.message = `${reminderData.title}${dateStr}${repeatStr}`;
    alert.addAction("OK");
    await alert.presentAlert();
    
    // Also send notification
    const notification = new Notification();
    notification.title = "Reminder Created";
    notification.body = reminderData.title;
    await notification.schedule();
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
