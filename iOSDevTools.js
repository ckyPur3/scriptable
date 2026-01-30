/*------------------------------------------------------------------------------------------------------
Script: iOSDevTools.js
Author: iOS Development Tools Library
Date: 2026-01-30
Version: 1.0
Description: Comprehensive tool library for iOS iPhone developers with essential utilities
------------------------------------------------------------------------------------------------------*/

// ============================================== iOS DEVICE UTILITIES ============================================== //

/**
 * Get comprehensive device information
 * @returns {Object} Device information including model, OS version, screen size, etc.
 */
function getDeviceInfo() {
    const device = Device;
    return {
        name: device.name(),
        systemName: device.systemName(),
        systemVersion: device.systemVersion(),
        model: device.model(),
        isPhone: device.isPhone(),
        isPad: device.isPad(),
        screenResolution: device.screenResolution(),
        screenScale: device.screenScale(),
        screenBrightness: device.screenBrightness(),
        volume: device.volume(),
        batteryLevel: device.batteryLevel(),
        batteryState: device.batteryState(),
        isCharging: device.isCharging(),
        isFullyCharged: device.isFullyCharged(),
        diskSpace: {
            total: device.diskSpace(),
            free: device.freeDiskSpace()
        },
        preferredLanguages: device.preferredLanguages(),
        locale: device.locale(),
        isUsingDarkAppearance: device.isUsingDarkAppearance()
    };
}

/**
 * Check if device is in low battery mode
 * @returns {boolean} True if battery level is below 20%
 */
function isLowBattery() {
    return Device.batteryLevel() < 0.20;
}

/**
 * Get device identifier for analytics
 * @returns {string} Unique device identifier
 */
function getDeviceIdentifier() {
    return `${Device.model()}-${Device.systemVersion()}`;
}

/**
 * Check network connectivity
 * @returns {Promise<Object>} Network status information
 */
async function checkNetworkConnectivity() {
    try {
        const req = new Request("https://www.apple.com");
        req.timeoutInterval = 5;
        await req.load();
        return {
            isConnected: true,
            type: "unknown", // Scriptable doesn't provide network type
            timestamp: new Date()
        };
    } catch (error) {
        return {
            isConnected: false,
            type: null,
            timestamp: new Date(),
            error: error.message
        };
    }
}

// ============================================== NETWORK & API UTILITIES ============================================== //

/**
 * Make HTTP request with retry logic
 * @param {string} url - The URL to request
 * @param {Object} options - Request options (method, headers, body, retries, timeout)
 * @returns {Promise<Object>} Response data
 */
async function httpRequestWithRetry(url, options = {}) {
    const maxRetries = options.retries || 3;
    const timeout = options.timeout || 30;
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const req = new Request(url);
            req.method = options.method || "GET";
            req.timeoutInterval = timeout;
            
            if (options.headers) {
                req.headers = options.headers;
            }
            
            if (options.body) {
                req.body = options.body;
            }
            
            const response = await req.loadJSON();
            return {
                success: true,
                data: response,
                attempt: i + 1
            };
        } catch (error) {
            lastError = error;
            if (i < maxRetries - 1) {
                await sleep(Math.pow(2, i) * 1000); // Exponential backoff
            }
        }
    }
    
    return {
        success: false,
        error: lastError.message,
        attempts: maxRetries
    };
}

/**
 * Download and cache remote resource
 * @param {string} url - URL to download from
 * @param {string} cacheKey - Cache identifier
 * @param {number} cacheHours - Hours to cache (default 24)
 * @returns {Promise<Object>} Cached or fresh data
 */
async function cachedRequest(url, cacheKey, cacheHours = 24) {
    const fm = FileManager.iCloud();
    const cachePath = fm.joinPath(fm.documentsDirectory(), "Cache");
    
    if (!fm.fileExists(cachePath)) {
        fm.createDirectory(cachePath);
    }
    
    const cacheFile = fm.joinPath(cachePath, `${cacheKey}.json`);
    const now = new Date().getTime();
    
    // Check if cache exists and is valid
    if (fm.fileExists(cacheFile)) {
        const cached = JSON.parse(fm.readString(cacheFile));
        const age = (now - cached.timestamp) / (1000 * 60 * 60);
        
        if (age < cacheHours) {
            return {
                data: cached.data,
                fromCache: true,
                age: age
            };
        }
    }
    
    // Fetch fresh data
    const result = await httpRequestWithRetry(url);
    
    if (result.success) {
        const cacheData = {
            data: result.data,
            timestamp: now
        };
        fm.writeString(cacheFile, JSON.stringify(cacheData));
        
        return {
            data: result.data,
            fromCache: false,
            age: 0
        };
    }
    
    throw new Error(`Failed to fetch data: ${result.error}`);
}

// ============================================== FILE & STORAGE UTILITIES ============================================== //

/**
 * Save data to file with automatic JSON serialization
 * @param {string} filename - Name of the file
 * @param {*} data - Data to save (will be JSON stringified if object)
 * @param {boolean} useLocal - Use local storage instead of iCloud
 * @returns {boolean} Success status
 */
function saveToFile(filename, data, useLocal = false) {
    try {
        const fm = useLocal ? FileManager.local() : FileManager.iCloud();
        const path = fm.joinPath(fm.documentsDirectory(), filename);
        const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        fm.writeString(path, content);
        return true;
    } catch (error) {
        console.error(`Error saving to file: ${error.message}`);
        return false;
    }
}

/**
 * Read data from file with automatic JSON parsing
 * @param {string} filename - Name of the file
 * @param {boolean} useLocal - Use local storage instead of iCloud
 * @returns {*} Parsed data or null if error
 */
function readFromFile(filename, useLocal = false) {
    try {
        const fm = useLocal ? FileManager.local() : FileManager.iCloud();
        const path = fm.joinPath(fm.documentsDirectory(), filename);
        
        if (!fm.fileExists(path)) {
            return null;
        }
        
        const content = fm.readString(path);
        
        try {
            return JSON.parse(content);
        } catch {
            return content;
        }
    } catch (error) {
        console.error(`Error reading from file: ${error.message}`);
        return null;
    }
}

/**
 * Create directory structure
 * @param {string} dirPath - Directory path relative to documents
 * @param {boolean} useLocal - Use local storage instead of iCloud
 * @returns {boolean} Success status
 */
function createDirectory(dirPath, useLocal = false) {
    try {
        const fm = useLocal ? FileManager.local() : FileManager.iCloud();
        const fullPath = fm.joinPath(fm.documentsDirectory(), dirPath);
        
        if (!fm.fileExists(fullPath)) {
            fm.createDirectory(fullPath, true);
        }
        return true;
    } catch (error) {
        console.error(`Error creating directory: ${error.message}`);
        return false;
    }
}

/**
 * List files in directory
 * @param {string} dirPath - Directory path
 * @param {boolean} useLocal - Use local storage instead of iCloud
 * @returns {Array<string>} List of files
 */
function listFiles(dirPath = "", useLocal = false) {
    try {
        const fm = useLocal ? FileManager.local() : FileManager.iCloud();
        const fullPath = dirPath ? fm.joinPath(fm.documentsDirectory(), dirPath) : fm.documentsDirectory();
        return fm.listContents(fullPath);
    } catch (error) {
        console.error(`Error listing files: ${error.message}`);
        return [];
    }
}

/**
 * Delete file or directory
 * @param {string} path - Path to delete
 * @param {boolean} useLocal - Use local storage instead of iCloud
 * @returns {boolean} Success status
 */
function deleteFile(path, useLocal = false) {
    try {
        const fm = useLocal ? FileManager.local() : FileManager.iCloud();
        const fullPath = fm.joinPath(fm.documentsDirectory(), path);
        
        if (fm.fileExists(fullPath)) {
            fm.remove(fullPath);
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error deleting file: ${error.message}`);
        return false;
    }
}

// ============================================== UI & NOTIFICATION UTILITIES ============================================== //

/**
 * Show alert with multiple options
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {Array<string>} actions - Array of action button labels
 * @returns {Promise<number>} Index of selected action
 */
async function showAlert(title, message, actions = ["OK"]) {
    const alert = new Alert();
    alert.title = title;
    alert.message = message;
    
    actions.forEach(action => alert.addAction(action));
    
    return await alert.presentAlert();
}

/**
 * Show input dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} placeholder - Input placeholder
 * @param {string} defaultValue - Default input value
 * @returns {Promise<string>} User input
 */
async function showInputDialog(title, message, placeholder = "", defaultValue = "") {
    const alert = new Alert();
    alert.title = title;
    alert.message = message;
    alert.addTextField(placeholder, defaultValue);
    alert.addAction("OK");
    alert.addCancelAction("Cancel");
    
    const response = await alert.presentAlert();
    
    if (response === -1) {
        return null;
    }
    
    return alert.textFieldValue(0);
}

/**
 * Send local notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Date} deliveryDate - When to deliver (null for immediate)
 * @param {Object} options - Additional options (sound, badge, etc.)
 * @returns {Promise<void>}
 */
async function sendNotification(title, body, deliveryDate = null, options = {}) {
    const notification = new Notification();
    notification.title = title;
    notification.body = body;
    
    if (options.sound) {
        notification.sound = options.sound;
    }
    
    if (options.badge !== undefined) {
        notification.badge = options.badge;
    }
    
    if (options.threadIdentifier) {
        notification.threadIdentifier = options.threadIdentifier;
    }
    
    if (deliveryDate) {
        notification.setTriggerDate(deliveryDate);
        await notification.schedule();
    } else {
        await notification.schedule();
    }
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
function copyToClipboard(text) {
    Pasteboard.copy(text);
}

/**
 * Get text from clipboard
 * @returns {string} Clipboard content
 */
function getFromClipboard() {
    return Pasteboard.paste();
}

// ============================================== SECURITY & KEYCHAIN UTILITIES ============================================== //

/**
 * Save sensitive data to keychain
 * @param {string} key - Keychain key
 * @param {string} value - Value to store
 * @returns {boolean} Success status
 */
function saveToKeychain(key, value) {
    try {
        Keychain.set(key, value);
        return true;
    } catch (error) {
        console.error(`Error saving to keychain: ${error.message}`);
        return false;
    }
}

/**
 * Get sensitive data from keychain
 * @param {string} key - Keychain key
 * @returns {string|null} Stored value or null
 */
function getFromKeychain(key) {
    try {
        return Keychain.get(key);
    } catch (error) {
        console.error(`Error reading from keychain: ${error.message}`);
        return null;
    }
}

/**
 * Check if keychain contains key
 * @param {string} key - Keychain key
 * @returns {boolean} True if key exists
 */
function keychainContains(key) {
    return Keychain.contains(key);
}

/**
 * Remove from keychain
 * @param {string} key - Keychain key
 * @returns {boolean} Success status
 */
function removeFromKeychain(key) {
    try {
        Keychain.remove(key);
        return true;
    } catch (error) {
        console.error(`Error removing from keychain: ${error.message}`);
        return false;
    }
}

// ============================================== DATE & TIME UTILITIES ============================================== //

/**
 * Format date with custom pattern
 * @param {Date} date - Date to format
 * @param {string} format - Format pattern (default: "yyyy-MM-dd HH:mm:ss")
 * @returns {string} Formatted date string
 */
function formatDate(date, format = "yyyy-MM-dd HH:mm:ss") {
    const df = new DateFormatter();
    df.dateFormat = format;
    return df.string(date);
}

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {Date} date - Date to compare
 * @returns {string} Relative time string
 */
function getRelativeTime(date) {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}

// ============================================== LOGGING UTILITIES ============================================== //

/**
 * Enhanced logging with levels and file output
 */
class Logger {
    constructor(name, logToFile = false) {
        this.name = name;
        this.logToFile = logToFile;
        this.logFilePath = `Logs/${name}.log`;
        
        if (logToFile) {
            createDirectory("Logs");
        }
    }
    
    log(level, message) {
        const timestamp = formatDate(new Date());
        const logMessage = `[${timestamp}] [${level}] [${this.name}] ${message}`;
        
        console.log(logMessage);
        
        if (this.logToFile) {
            const existingLog = readFromFile(this.logFilePath) || "";
            saveToFile(this.logFilePath, existingLog + logMessage + "\n");
        }
    }
    
    info(message) { this.log("INFO", message); }
    warn(message) { this.log("WARN", message); }
    error(message) { this.log("ERROR", message); }
    debug(message) { this.log("DEBUG", message); }
}

// ============================================== UTILITY FUNCTIONS ============================================== //

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate UUID
 * @returns {string} UUID string
 */
function generateUUID() {
    return UUID.string();
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================== EXPORTS ============================================== //

module.exports = {
    // Device
    getDeviceInfo,
    isLowBattery,
    getDeviceIdentifier,
    checkNetworkConnectivity,
    
    // Network
    httpRequestWithRetry,
    cachedRequest,
    
    // File System
    saveToFile,
    readFromFile,
    createDirectory,
    listFiles,
    deleteFile,
    
    // UI
    showAlert,
    showInputDialog,
    sendNotification,
    copyToClipboard,
    getFromClipboard,
    
    // Security
    saveToKeychain,
    getFromKeychain,
    keychainContains,
    removeFromKeychain,
    
    // Date/Time
    formatDate,
    getRelativeTime,
    
    // Logging
    Logger,
    
    // Utilities
    sleep,
    generateUUID,
    debounce
};
