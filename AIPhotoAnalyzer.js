/*------------------------------------------------------------------------------------------------------
Script: AIPhotoAnalyzer.js
Author: AI Features
Description: Analyze photos with AI to extract information, describe content, and more
Version: 1.0.0

Features:
- Describe photo content
- Extract text from images (OCR)
- Identify objects and scenes
- Get photo suggestions
- Accessibility descriptions
- Photo organization suggestions

Usage:
1. Run in Scriptable app to analyze photos from library
2. Use with Shortcuts to analyze specific images
3. Share sheet integration

Configuration:
- Set OpenAI API key (required for vision features)
-----------------------------------------------------------------------------------------------------*/

// Import AI utilities
const { AIService } = importModule("lib/ai-utils");

// ===== CONFIGURATION =====
const API_KEY = ""; // Set your OpenAI API key here

// ===== MAIN SCRIPT =====

/**
 * Main function
 */
async function main() {
    // Check if image provided via Shortcuts
    if (args.images && args.images.length > 0) {
        const image = args.images[0];
        const action = args.queryParameters?.action || "describe";
        await analyzeImageWithAction(image, action);
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
    menu.title = "AI Photo Analyzer";
    menu.message = "Select an analysis type:";
    
    menu.addAction("Describe Photo");
    menu.addAction("Extract Text (OCR)");
    menu.addAction("Identify Objects");
    menu.addAction("Suggest Tags");
    menu.addAction("Accessibility Description");
    menu.addAction("Get Recommendations");
    menu.addCancelAction("Cancel");
    
    const choice = await menu.presentAlert();
    
    if (choice === -1) return;
    
    // Pick image from library
    const photos = await Photos.fromLibrary();
    if (!photos || photos.length === 0) return;
    
    const actions = [
        "describe",
        "ocr",
        "identify",
        "tags",
        "accessibility",
        "recommendations"
    ];
    
    await analyzeImageWithAction(photos[0], actions[choice]);
}

/**
 * Analyze image with specific action
 */
async function analyzeImageWithAction(image, action) {
    try {
        // Get API key
        let apiKey = API_KEY;
        if (!apiKey && args.queryParameters) {
            apiKey = args.queryParameters.apiKey;
        }
        
        if (!apiKey) {
            const alert = new Alert();
            alert.title = "API Key Required";
            alert.message = "Enter your OpenAI API key:";
            alert.addTextField("API Key");
            alert.addAction("OK");
            alert.addCancelAction("Cancel");
            
            const response = await alert.presentAlert();
            if (response === -1) return;
            
            apiKey = alert.textFieldValue(0);
        }
        
        const ai = new AIService("openai", apiKey);
        
        // Show processing notification
        if (config.runsInApp) {
            const notification = new Notification();
            notification.title = "AI Photo Analyzer";
            notification.body = "Analyzing image...";
            await notification.schedule();
        }
        
        let result;
        
        switch (action) {
            case "describe":
                result = await describePhoto(ai, image);
                break;
            case "ocr":
                result = await extractText(ai, image);
                break;
            case "identify":
                result = await identifyObjects(ai, image);
                break;
            case "tags":
                result = await suggestTags(ai, image);
                break;
            case "accessibility":
                result = await generateAccessibilityDescription(ai, image);
                break;
            case "recommendations":
                result = await getRecommendations(ai, image);
                break;
            default:
                result = await describePhoto(ai, image);
        }
        
        // Display result
        await showResult(result.title, result.content, result.copyable);
        
        // Set output for Shortcuts
        if (!config.runsInApp) {
            Script.setShortcutOutput(result.content);
        }
        
    } catch (error) {
        console.error("Analysis error:", error);
        await showError(error);
    }
}

/**
 * Describe photo content
 */
async function describePhoto(ai, image) {
    const prompt = "Describe this image in detail. Include what you see, the setting, colors, mood, and any notable features.";
    const description = await ai.analyzeImage(image, prompt, { maxTokens: 300 });
    
    return {
        title: "Photo Description",
        content: description,
        copyable: true
    };
}

/**
 * Extract text from image (OCR)
 */
async function extractText(ai, image) {
    const prompt = "Extract all visible text from this image. List each piece of text you can see, maintaining the order and structure as much as possible.";
    const text = await ai.analyzeImage(image, prompt, { maxTokens: 500 });
    
    return {
        title: "Extracted Text",
        content: text,
        copyable: true
    };
}

/**
 * Identify objects in photo
 */
async function identifyObjects(ai, image) {
    const prompt = "List all objects, people, and elements you can identify in this image. Organize them by category (people, objects, nature, architecture, etc.).";
    const objects = await ai.analyzeImage(image, prompt, { maxTokens: 300 });
    
    return {
        title: "Identified Objects",
        content: objects,
        copyable: true
    };
}

/**
 * Suggest tags for photo
 */
async function suggestTags(ai, image) {
    const prompt = "Suggest relevant tags for organizing this photo. Include tags for: content, style, mood, colors, location type, and any other relevant categories. Return as a comma-separated list.";
    const tags = await ai.analyzeImage(image, prompt, { maxTokens: 200 });
    
    return {
        title: "Suggested Tags",
        content: tags,
        copyable: true
    };
}

/**
 * Generate accessibility description
 */
async function generateAccessibilityDescription(ai, image) {
    const prompt = "Create a concise accessibility description for this image that would help someone who cannot see it understand what it shows. Focus on the most important visual elements and context. Keep it under 125 characters.";
    const description = await ai.analyzeImage(image, prompt, { maxTokens: 150 });
    
    return {
        title: "Accessibility Description",
        content: description,
        copyable: true
    };
}

/**
 * Get photo recommendations
 */
async function getRecommendations(ai, image) {
    const prompt = "As a photography expert, provide 3 specific suggestions to improve this photo. Consider composition, lighting, framing, and technical aspects. Be constructive and specific.";
    const recommendations = await ai.analyzeImage(image, prompt, { maxTokens: 400 });
    
    return {
        title: "Photo Recommendations",
        content: recommendations,
        copyable: false
    };
}

/**
 * Show result
 */
async function showResult(title, content, copyable = false) {
    const alert = new Alert();
    alert.title = title;
    alert.message = content;
    
    if (copyable) {
        alert.addAction("Copy to Clipboard");
    }
    alert.addAction("OK");
    
    const response = await alert.presentAlert();
    
    if (response === 0 && copyable) {
        Pasteboard.copy(content);
        
        const notification = new Notification();
        notification.title = "Copied";
        notification.body = "Result copied to clipboard";
        await notification.schedule();
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
