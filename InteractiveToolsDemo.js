/*------------------------------------------------------------------------------------------------------
Script: InteractiveToolsDemo.js
Author: Interactive Tools Demo
Description: Demonstrates interactive tools and quick action menus for Scriptable
------------------------------------------------------------------------------------------------------*/

// Import interactive utilities
const fm = FileManager.iCloud();
const utilsPath = fm.joinPath(fm.documentsDirectory(), "../lib/interactive-utils.js");
const utils = importModule(utilsPath.replace(fm.documentsDirectory() + "/../", ""));

// Main menu
async function main() {
    const mainOptions = [
        "🎨 Theme Selector Demo",
        "📋 Menu Selection Demo",
        "⚙️ Configuration Wizard Demo",
        "📝 Text Input Demo",
        "✅ Confirmation Demo",
        "🚀 Quick Actions Selector",
        "💾 Save/Load Config Demo",
        "ℹ️ About Interactive Tools"
    ];
    
    while (true) {
        const choice = await utils.showMenu(
            "Interactive Tools Demo",
            "Select a demo to run:",
            mainOptions
        );
        
        if (choice === -1) break; // User cancelled
        
        switch (choice) {
            case 0:
                await themeSelectorDemo();
                break;
            case 1:
                await menuSelectionDemo();
                break;
            case 2:
                await configurationWizardDemo();
                break;
            case 3:
                await textInputDemo();
                break;
            case 4:
                await confirmationDemo();
                break;
            case 5:
                await quickActionsDemo();
                break;
            case 6:
                await saveLoadConfigDemo();
                break;
            case 7:
                await showAbout();
                break;
        }
    }
    
    await utils.showAlert("Demo Complete", "Thank you for trying the Interactive Tools!");
}

// Demo: Theme Selector
async function themeSelectorDemo() {
    const sampleThemes = {
        kraftBrown: "Kraft Brown",
        orangeyellow: "Orange Yellow",
        cadmiumOrange: "Cadmium Orange",
        red: "Red",
        scarletRed: "Scarlet Red",
        antwerpBlue: "Antwerp Blue",
        skyBlue: "Sky Blue",
        articBlue: "Artic Blue"
    };
    
    const selected = await utils.selectTheme(sampleThemes, "antwerpBlue");
    
    if (selected) {
        await utils.showAlert("Theme Selected", `You selected: ${selected}`);
    }
}

// Demo: Menu Selection
async function menuSelectionDemo() {
    const options = ["Option 1", "Option 2", "Option 3", "Option 4"];
    const choice = await utils.showMenu(
        "Sample Menu",
        "Choose an option:",
        options
    );
    
    if (choice !== -1) {
        await utils.showAlert("Selection", `You chose: ${options[choice]}`);
    }
}

// Demo: Configuration Wizard
async function configurationWizardDemo() {
    const steps = [
        {
            key: "layout",
            title: "Select Layout",
            message: "Choose your preferred layout",
            type: "menu",
            options: ["welcome", "minimalWeather", "feelMotivated", "minimalCalendar"]
        },
        {
            key: "apiKey",
            title: "API Key",
            message: "Enter your OpenWeather API key (optional)",
            type: "text",
            placeholder: "Enter API key",
            default: ""
        },
        {
            key: "showWeather",
            title: "Show Weather",
            message: "Do you want to display weather information?",
            type: "confirm"
        }
    ];
    
    const config = await utils.configurationWizard(steps);
    
    if (config) {
        const summary = Object.entries(config)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
        await utils.showAlert("Configuration Complete", summary);
    }
}

// Demo: Text Input
async function textInputDemo() {
    const name = await utils.promptForText(
        "Enter Name",
        "What's your name?",
        "Your name",
        "John Doe"
    );
    
    if (name) {
        await utils.showAlert("Hello!", `Nice to meet you, ${name}!`);
    }
}

// Demo: Confirmation
async function confirmationDemo() {
    const confirmed = await utils.showConfirmation(
        "Confirm Action",
        "Are you sure you want to proceed?"
    );
    
    if (confirmed) {
        await utils.showAlert("Confirmed", "Action confirmed!");
    } else {
        await utils.showAlert("Cancelled", "Action was cancelled.");
    }
}

// Demo: Quick Actions Selector
async function quickActionsDemo() {
    const availableActions = [
        "message",
        "facetimeVideo",
        "facetimeAudio",
        "whatsapp",
        "telegram",
        "email",
        "gmail",
        "twitter"
    ];
    
    const selected = await utils.selectQuickActions(availableActions, 3);
    
    if (selected) {
        await utils.showAlert(
            "Quick Actions Selected",
            `Selected actions:\n${selected.join(", ")}`
        );
    }
}

// Demo: Save/Load Configuration
async function saveLoadConfigDemo() {
    const action = await utils.showMenu(
        "Configuration Demo",
        "What would you like to do?",
        ["Save Sample Config", "Load Config", "Clear Config"]
    );
    
    if (action === -1) return;
    
    const configFile = "interactive-demo-config.json";
    
    if (action === 0) {
        // Save
        const sampleConfig = {
            theme: "antwerpBlue",
            layout: "welcome",
            showWeather: true,
            apiKey: "sample-key-12345"
        };
        
        const saved = utils.saveConfiguration(configFile, sampleConfig);
        if (saved) {
            await utils.showAlert("Success", "Configuration saved successfully!");
        } else {
            await utils.showAlert("Error", "Failed to save configuration.");
        }
    } else if (action === 1) {
        // Load
        const config = utils.loadConfiguration(configFile);
        if (config) {
            const summary = Object.entries(config)
                .map(([key, value]) => `${key}: ${value}`)
                .join("\n");
            await utils.showAlert("Loaded Configuration", summary);
        } else {
            await utils.showAlert("Not Found", "No saved configuration found.");
        }
    } else if (action === 2) {
        // Clear
        const fm = FileManager.iCloud();
        const filePath = fm.joinPath(fm.documentsDirectory(), configFile);
        if (fm.fileExists(filePath)) {
            fm.remove(filePath);
            await utils.showAlert("Cleared", "Configuration cleared.");
        } else {
            await utils.showAlert("Not Found", "No configuration to clear.");
        }
    }
}

// About
async function showAbout() {
    const aboutText = `Interactive Tools for Scriptable

This library provides:
• Menu selections
• Alert dialogs
• Text input prompts
• Confirmation dialogs
• Theme pickers
• Quick action selectors
• Configuration wizards
• Config save/load

These tools enhance user experience when running scripts in the Scriptable app.`;
    
    await utils.showAlert("About Interactive Tools", aboutText);
}

// Run main menu
if (config.runsInApp) {
    await main();
} else {
    console.log("This script must be run in the Scriptable app.");
}
