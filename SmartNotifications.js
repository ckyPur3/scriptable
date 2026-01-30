/*------------------------------------------------------------------------------------------------------
Script: SmartNotifications.js
Author: AI Features
Description: AI-powered smart notifications based on context and user behavior
Version: 1.0.0

Features:
- Context-aware notifications
- Smart reminders based on time and location
- Weather-based suggestions
- Calendar-aware notifications
- Personalized daily briefings

Usage:
1. Run directly for immediate notification
2. Use with iOS Automations for scheduled notifications
3. Customize notification types and frequency

Configuration:
- Set AI provider and API key
- Configure notification preferences
-----------------------------------------------------------------------------------------------------*/

// Import libraries
const { AIService, AIAutomation } = importModule("lib/ai-utils");

// ===== CONFIGURATION =====
const AI_PROVIDER = "openai"; // "openai" or "claude"
const API_KEY = ""; // Set your API key here

// Notification settings
const NOTIFICATION_TYPES = {
    MORNING_BRIEFING: true,
    WEATHER_ALERTS: true,
    CALENDAR_REMINDERS: true,
    EVENING_SUMMARY: true,
    MOTIVATIONAL: true
};

// ===== MAIN SCRIPT =====

/**
 * Main function
 */
async function main() {
    // Check if running with parameters
    if (args.queryParameters && args.queryParameters.type) {
        await generateNotification(args.queryParameters.type);
        return;
    }
    
    // Show menu for interactive use
    await showNotificationMenu();
}

/**
 * Show notification type menu
 */
async function showNotificationMenu() {
    const menu = new Alert();
    menu.title = "Smart Notifications";
    menu.message = "Choose notification type:";
    
    menu.addAction("Morning Briefing");
    menu.addAction("Weather Alert");
    menu.addAction("Calendar Summary");
    menu.addAction("Evening Summary");
    menu.addAction("Motivational Message");
    menu.addAction("Custom Context");
    menu.addCancelAction("Cancel");
    
    const choice = await menu.presentAlert();
    
    const types = [
        "morning_briefing",
        "weather_alert",
        "calendar_summary",
        "evening_summary",
        "motivational",
        "custom"
    ];
    
    if (choice >= 0 && choice < types.length) {
        await generateNotification(types[choice]);
    }
}

/**
 * Generate and send notification
 */
async function generateNotification(type) {
    try {
        // Gather context
        const context = await gatherContext();
        
        // Get API key
        let apiKey = API_KEY;
        if (!apiKey && args.queryParameters) {
            apiKey = args.queryParameters.apiKey;
        }
        
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
        
        // Generate notification content
        const ai = new AIService(AI_PROVIDER, apiKey);
        const content = await generateNotificationContent(ai, type, context);
        
        // Send notification
        const notification = new Notification();
        notification.title = content.title;
        notification.body = content.body;
        notification.sound = "default";
        
        if (content.actions) {
            content.actions.forEach(action => {
                notification.addAction(action.title, action.url);
            });
        }
        
        await notification.schedule();
        
        // Show confirmation in app
        if (config.runsInApp) {
            await showConfirmation(content.title, content.body);
        }
        
    } catch (error) {
        console.error("Notification error:", error);
        
        if (config.runsInApp) {
            const alert = new Alert();
            alert.title = "Error";
            alert.message = error.message;
            alert.addAction("OK");
            await alert.presentAlert();
        }
    }
}

/**
 * Gather context information
 */
async function gatherContext() {
    const now = new Date();
    const context = {
        time: now.toLocaleTimeString(),
        date: now.toLocaleDateString(),
        dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
        hour: now.getHours(),
        month: now.toLocaleDateString('en-US', { month: 'long' })
    };
    
    // Add calendar events if available
    try {
        const events = await fetchTodayEvents();
        if (events.length > 0) {
            context.events = events.map(e => ({
                title: e.title,
                startTime: e.startDate.toLocaleTimeString(),
                endTime: e.endDate.toLocaleTimeString()
            }));
        }
    } catch (e) {
        console.log("Could not fetch calendar events");
    }
    
    // Add weather if available
    try {
        // This would require weather API - placeholder for now
        context.weather = {
            condition: "clear",
            temperature: 72
        };
    } catch (e) {
        console.log("Could not fetch weather");
    }
    
    return context;
}

/**
 * Fetch today's calendar events
 */
async function fetchTodayEvents() {
    const calendar = await Calendar.forEvents();
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    
    const events = await CalendarEvent.between(startOfDay, endOfDay, calendar);
    return events.filter(e => !e.isAllDay).slice(0, 5);
}

/**
 * Generate notification content based on type and context
 */
async function generateNotificationContent(ai, type, context) {
    const automation = new AIAutomation(ai);
    
    switch (type) {
        case "morning_briefing":
            return await generateMorningBriefing(ai, context);
            
        case "weather_alert":
            return await generateWeatherAlert(ai, context);
            
        case "calendar_summary":
            return await generateCalendarSummary(ai, context);
            
        case "evening_summary":
            return await generateEveningSummary(ai, context);
            
        case "motivational":
            return await generateMotivational(ai, context);
            
        case "custom":
            return await automation.generateSmartNotification(context);
            
        default:
            return {
                title: "Smart Notification",
                body: "Your personalized notification"
            };
    }
}

/**
 * Generate morning briefing
 */
async function generateMorningBriefing(ai, context) {
    const prompt = `Create a brief, energizing morning message for ${context.dayOfWeek}. Include:
- A warm greeting
- Today's date: ${context.date}
- ${context.events ? `Mention ${context.events.length} scheduled events` : 'Encourage productivity'}
- Keep it under 100 words, upbeat and motivating`;
    
    const body = await ai.chat(prompt, {
        systemPrompt: "You create brief, energizing morning messages.",
        maxTokens: 150
    });
    
    return {
        title: `Good Morning! ☀️`,
        body: body
    };
}

/**
 * Generate weather alert
 */
async function generateWeatherAlert(ai, context) {
    const weatherInfo = context.weather || { condition: "pleasant", temperature: 70 };
    
    const prompt = `Create a helpful weather notification for today. Weather: ${weatherInfo.condition}, ${weatherInfo.temperature}°F. Include a practical tip or suggestion based on the weather. Keep it brief and friendly.`;
    
    const body = await ai.chat(prompt, {
        systemPrompt: "You create helpful, brief weather notifications with practical tips.",
        maxTokens: 100
    });
    
    return {
        title: "Weather Update 🌤️",
        body: body
    };
}

/**
 * Generate calendar summary
 */
async function generateCalendarSummary(ai, context) {
    if (!context.events || context.events.length === 0) {
        return {
            title: "Calendar 📅",
            body: "You have a clear schedule today. Great time to tackle important tasks!"
        };
    }
    
    const eventsText = context.events.map(e => `${e.title} at ${e.startTime}`).join(', ');
    
    const prompt = `Summarize these calendar events in a helpful way: ${eventsText}. Give a brief, encouraging summary. Keep it under 80 words.`;
    
    const body = await ai.chat(prompt, {
        systemPrompt: "You create brief, helpful calendar summaries.",
        maxTokens: 120
    });
    
    return {
        title: `Today's Schedule 📅`,
        body: body
    };
}

/**
 * Generate evening summary
 */
async function generateEveningSummary(ai, context) {
    const prompt = `Create a calming evening message for ${context.dayOfWeek} evening. Include:
- A warm closing to the day
- Encouragement to rest
- Brief reflection prompt
- Keep it under 80 words, calm and positive`;
    
    const body = await ai.chat(prompt, {
        systemPrompt: "You create calming, reflective evening messages.",
        maxTokens: 120
    });
    
    return {
        title: "Evening Reflection 🌙",
        body: body
    };
}

/**
 * Generate motivational message
 */
async function generateMotivational(ai, context) {
    const prompt = `Create an inspiring, motivational message for someone during their ${context.hour < 12 ? 'morning' : context.hour < 17 ? 'afternoon' : 'evening'}. Make it uplifting, actionable, and under 100 words.`;
    
    const body = await ai.chat(prompt, {
        systemPrompt: "You create inspiring, actionable motivational messages.",
        maxTokens: 150
    });
    
    return {
        title: "Daily Inspiration ✨",
        body: body
    };
}

/**
 * Show confirmation
 */
async function showConfirmation(title, body) {
    const alert = new Alert();
    alert.title = "Notification Sent";
    alert.message = `${title}\n\n${body}`;
    alert.addAction("OK");
    await alert.presentAlert();
}

// Run main function
await main();
