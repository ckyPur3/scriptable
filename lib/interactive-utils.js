/*------------------------------------------------------------------------------------------------------
Script: interactive-utils.js
Author: Interactive Tools Library
Description: Shared utilities for interactive menus, alerts, and user input in Scriptable
------------------------------------------------------------------------------------------------------*/

/**
 * Display a menu with multiple options and return the selected index
 * @param {string} title - Menu title
 * @param {string} message - Menu message/description
 * @param {Array<string>} options - Array of option strings
 * @param {boolean} cancelable - Whether to show cancel button (default: true)
 * @returns {Promise<number>} Selected option index, or -1 if cancelled
 */
async function showMenu(title, message, options, cancelable = true) {
    const alert = new Alert();
    alert.title = title;
    if (message) alert.message = message;
    
    options.forEach(option => {
        alert.addAction(option);
    });
    
    if (cancelable) {
        alert.addCancelAction("Cancel");
    }
    
    const response = await alert.presentAlert();
    return response;
}

/**
 * Display an information alert
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @returns {Promise<void>}
 */
async function showAlert(title, message) {
    const alert = new Alert();
    alert.title = title;
    alert.message = message;
    alert.addAction("OK");
    await alert.presentAlert();
}

/**
 * Display a confirmation dialog
 * @param {string} title - Confirmation title
 * @param {string} message - Confirmation message
 * @returns {Promise<boolean>} True if confirmed, false if cancelled
 */
async function showConfirmation(title, message) {
    const alert = new Alert();
    alert.title = title;
    alert.message = message;
    alert.addAction("Confirm");
    alert.addCancelAction("Cancel");
    
    const response = await alert.presentAlert();
    return response === 0;
}

/**
 * Prompt user for text input
 * @param {string} title - Prompt title
 * @param {string} message - Prompt message
 * @param {string} placeholder - Input placeholder text
 * @param {string} defaultValue - Default input value
 * @returns {Promise<string|null>} Entered text or null if cancelled
 */
async function promptForText(title, message, placeholder = "", defaultValue = "") {
    const alert = new Alert();
    alert.title = title;
    if (message) alert.message = message;
    alert.addTextField(placeholder, defaultValue);
    alert.addAction("OK");
    alert.addCancelAction("Cancel");
    
    const response = await alert.presentAlert();
    if (response === -1) return null;
    
    return alert.textFieldValue(0);
}

/**
 * Prompt user for secure text input (password)
 * @param {string} title - Prompt title
 * @param {string} message - Prompt message
 * @param {string} placeholder - Input placeholder text
 * @returns {Promise<string|null>} Entered text or null if cancelled
 */
async function promptForSecureText(title, message, placeholder = "") {
    const alert = new Alert();
    alert.title = title;
    if (message) alert.message = message;
    alert.addSecureTextField(placeholder);
    alert.addAction("OK");
    alert.addCancelAction("Cancel");
    
    const response = await alert.presentAlert();
    if (response === -1) return null;
    
    return alert.textFieldValue(0);
}

/**
 * Show a list selection using UITable
 * @param {string} title - Table title
 * @param {Array<{title: string, subtitle?: string, value: any}>} items - Array of items
 * @returns {Promise<any|null>} Selected item value or null if cancelled
 */
async function showListSelection(title, items) {
    const table = new UITable();
    table.showSeparators = true;
    
    items.forEach((item, index) => {
        const row = new UITableRow();
        row.addText(item.title, item.subtitle || "");
        row.onSelect = () => {
            selectedValue = item.value;
        };
        table.addRow(row);
    });
    
    let selectedValue = null;
    await table.present();
    return selectedValue;
}

/**
 * Create a quick action menu for contact actions
 * @param {Array<string>} availableActions - Array of available action types
 * @param {number} maxSelections - Maximum number of actions to select
 * @returns {Promise<Array<string>|null>} Selected actions or null if cancelled
 */
async function selectQuickActions(availableActions, maxSelections = 3) {
    const actionDescriptions = {
        message: "📱 Messages",
        facetimeVideo: "📹 FaceTime Video",
        facetimeAudio: "📞 FaceTime Audio",
        whatsapp: "💬 WhatsApp",
        telegram: "✈️ Telegram",
        email: "📧 Email",
        outlook: "📧 Outlook",
        gmail: "📧 Gmail",
        spark: "📧 Spark Mail",
        twitter: "🐦 Twitter",
        twitterrific: "🐦 Twitterrific",
        tweetbot: "🐦 Tweetbot"
    };
    
    const alert = new Alert();
    alert.title = "Select Quick Actions";
    alert.message = `Choose up to ${maxSelections} quick actions`;
    
    availableActions.forEach(action => {
        const description = actionDescriptions[action] || action;
        alert.addAction(description);
    });
    alert.addCancelAction("Cancel");
    
    const selectedActions = [];
    
    for (let i = 0; i < maxSelections; i++) {
        const response = await alert.presentAlert();
        if (response === -1) {
            if (i === 0) return null; // Cancel on first selection
            break; // Done selecting
        }
        
        const selectedAction = availableActions[response];
        if (!selectedActions.includes(selectedAction)) {
            selectedActions.push(selectedAction);
        }
        
        if (i < maxSelections - 1) {
            const continueAlert = new Alert();
            continueAlert.title = "Quick Actions";
            continueAlert.message = `Selected: ${selectedActions.join(", ")}\n\nAdd another action?`;
            continueAlert.addAction("Add Another");
            continueAlert.addAction("Done");
            
            const cont = await continueAlert.presentAlert();
            if (cont === 1) break;
        }
    }
    
    return selectedActions;
}

/**
 * Show a theme/color picker
 * @param {Object} themes - Object with theme names as keys
 * @param {string} currentTheme - Currently selected theme
 * @returns {Promise<string|null>} Selected theme name or null if cancelled
 */
async function selectTheme(themes, currentTheme = null) {
    const themeNames = Object.keys(themes);
    
    // Group themes for better organization
    const alert = new Alert();
    alert.title = "Select Theme";
    if (currentTheme) {
        alert.message = `Current: ${currentTheme}`;
    }
    
    themeNames.forEach(themeName => {
        alert.addAction(themeName);
    });
    alert.addCancelAction("Cancel");
    
    const response = await alert.presentAlert();
    if (response === -1) return null;
    
    return themeNames[response];
}

/**
 * Show a multi-step configuration wizard
 * @param {Array<{title: string, message: string, type: string, options: any}>} steps - Configuration steps
 * @returns {Promise<Object|null>} Configuration object or null if cancelled
 */
async function configurationWizard(steps) {
    const config = {};
    
    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        let result;
        switch (step.type) {
            case "menu":
                result = await showMenu(step.title, step.message, step.options);
                if (result === -1) return null;
                config[step.key] = step.options[result];
                break;
                
            case "text":
                result = await promptForText(step.title, step.message, step.placeholder, step.default);
                if (result === null) return null;
                config[step.key] = result;
                break;
                
            case "confirm":
                result = await showConfirmation(step.title, step.message);
                config[step.key] = result;
                break;
                
            case "theme":
                result = await selectTheme(step.options, step.current);
                if (result === null) return null;
                config[step.key] = result;
                break;
        }
    }
    
    return config;
}

/**
 * Save configuration to file
 * @param {string} fileName - Configuration file name
 * @param {Object} config - Configuration object
 * @returns {boolean} Success status
 */
function saveConfiguration(fileName, config) {
    const fm = FileManager.iCloud();
    const dir = fm.documentsDirectory();
    const filePath = fm.joinPath(dir, fileName);
    
    try {
        fm.writeString(filePath, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error("Failed to save configuration: " + error);
        return false;
    }
}

/**
 * Load configuration from file
 * @param {string} fileName - Configuration file name
 * @returns {Object|null} Configuration object or null if not found
 */
function loadConfiguration(fileName) {
    const fm = FileManager.iCloud();
    const dir = fm.documentsDirectory();
    const filePath = fm.joinPath(dir, fileName);
    
    try {
        if (fm.fileExists(filePath)) {
            const content = fm.readString(filePath);
            return JSON.parse(content);
        }
    } catch (error) {
        console.error("Failed to load configuration: " + error);
    }
    
    return null;
}

// Export functions for use in other scripts
module.exports = {
    showMenu,
    showAlert,
    showConfirmation,
    promptForText,
    promptForSecureText,
    showListSelection,
    selectQuickActions,
    selectTheme,
    configurationWizard,
    saveConfiguration,
    loadConfiguration
};
