/*------------------------------------------------------------------------------------------------------
Script: api-helpers.js
Author: API Integration Library
Description: Utilities for integrating external APIs and services
Version: 1.0.0
-----------------------------------------------------------------------------------------------------*/

/**
 * REST API Client
 * Generic HTTP client for API integrations
 */
class APIClient {
    constructor(baseURL, defaultHeaders = {}) {
        this.baseURL = baseURL;
        this.defaultHeaders = defaultHeaders;
    }
    
    /**
     * Make a GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} params - Query parameters
     * @param {Object} headers - Additional headers
     * @returns {Promise<Object>} Response data
     */
    async get(endpoint, params = {}, headers = {}) {
        const url = this._buildURL(endpoint, params);
        const request = new Request(url);
        request.headers = { ...this.defaultHeaders, ...headers };
        
        return await this._handleResponse(request);
    }
    
    /**
     * Make a POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {Object} headers - Additional headers
     * @returns {Promise<Object>} Response data
     */
    async post(endpoint, body = {}, headers = {}) {
        const url = this._buildURL(endpoint);
        const request = new Request(url);
        request.method = "POST";
        request.headers = {
            "Content-Type": "application/json",
            ...this.defaultHeaders,
            ...headers
        };
        request.body = JSON.stringify(body);
        
        return await this._handleResponse(request);
    }
    
    /**
     * Make a PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} body - Request body
     * @param {Object} headers - Additional headers
     * @returns {Promise<Object>} Response data
     */
    async put(endpoint, body = {}, headers = {}) {
        const url = this._buildURL(endpoint);
        const request = new Request(url);
        request.method = "PUT";
        request.headers = {
            "Content-Type": "application/json",
            ...this.defaultHeaders,
            ...headers
        };
        request.body = JSON.stringify(body);
        
        return await this._handleResponse(request);
    }
    
    /**
     * Make a DELETE request
     * @param {string} endpoint - API endpoint
     * @param {Object} headers - Additional headers
     * @returns {Promise<Object>} Response data
     */
    async delete(endpoint, headers = {}) {
        const url = this._buildURL(endpoint);
        const request = new Request(url);
        request.method = "DELETE";
        request.headers = { ...this.defaultHeaders, ...headers };
        
        return await this._handleResponse(request);
    }
    
    /**
     * Build full URL with query parameters
     */
    _buildURL(endpoint, params = {}) {
        let url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
        
        const queryString = Object.keys(params)
            .filter(key => params[key] !== null && params[key] !== undefined)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        
        if (queryString) {
            url += (url.includes('?') ? '&' : '?') + queryString;
        }
        
        return url;
    }
    
    /**
     * Handle API response
     */
    async _handleResponse(request) {
        try {
            const response = await request.loadJSON();
            return response;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
}

/**
 * Webhook Manager
 * Send data to webhooks
 */
class WebhookManager {
    /**
     * Send POST request to webhook
     * @param {string} webhookURL - Webhook URL
     * @param {Object} payload - Data to send
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Response
     */
    async send(webhookURL, payload, options = {}) {
        const request = new Request(webhookURL);
        request.method = options.method || "POST";
        request.headers = {
            "Content-Type": "application/json",
            ...options.headers
        };
        request.body = JSON.stringify(payload);
        
        try {
            const response = await request.loadJSON();
            return { success: true, data: response };
        } catch (error) {
            console.error("Webhook error:", error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Send to IFTTT webhook
     * @param {string} eventName - IFTTT event name
     * @param {string} key - IFTTT webhook key
     * @param {Object} values - Values object (value1, value2, value3)
     * @returns {Promise<Object>} Response
     */
    async sendToIFTTT(eventName, key, values = {}) {
        const url = `https://maker.ifttt.com/trigger/${eventName}/with/key/${key}`;
        return await this.send(url, values);
    }
    
    /**
     * Send to Zapier webhook
     * @param {string} webhookURL - Zapier webhook URL
     * @param {Object} data - Data to send
     * @returns {Promise<Object>} Response
     */
    async sendToZapier(webhookURL, data) {
        return await this.send(webhookURL, data);
    }
    
    /**
     * Send to Make (formerly Integromat) webhook
     * @param {string} webhookURL - Make webhook URL
     * @param {Object} data - Data to send
     * @returns {Promise<Object>} Response
     */
    async sendToMake(webhookURL, data) {
        return await this.send(webhookURL, data);
    }
}

/**
 * Authentication Helper
 * Manage API authentication
 */
class AuthHelper {
    /**
     * Create Basic Auth header
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {Object} Headers object
     */
    basicAuth(username, password) {
        const credentials = `${username}:${password}`;
        const encoded = Data.fromString(credentials).toBase64String();
        return {
            "Authorization": `Basic ${encoded}`
        };
    }
    
    /**
     * Create Bearer Token header
     * @param {string} token - Access token
     * @returns {Object} Headers object
     */
    bearerAuth(token) {
        return {
            "Authorization": `Bearer ${token}`
        };
    }
    
    /**
     * Create API Key header
     * @param {string} apiKey - API key
     * @param {string} headerName - Header name (default: X-API-Key)
     * @returns {Object} Headers object
     */
    apiKeyAuth(apiKey, headerName = "X-API-Key") {
        return {
            [headerName]: apiKey
        };
    }
}

/**
 * Rate Limiter
 * Prevent API rate limit violations
 */
class RateLimiter {
    constructor(maxRequests, timeWindowMs) {
        this.maxRequests = maxRequests;
        this.timeWindowMs = timeWindowMs;
        this.requests = [];
    }
    
    /**
     * Check if request is allowed and record it
     * @returns {boolean} True if request is allowed
     */
    async checkLimit() {
        const now = Date.now();
        const maxRetries = 10; // Prevent infinite waiting
        let retries = 0;
        
        while (retries < maxRetries) {
            // Remove old requests outside time window
            this.requests = this.requests.filter(
                timestamp => now - timestamp < this.timeWindowMs
            );
            
            if (this.requests.length < this.maxRequests) {
                this.requests.push(Date.now());
                return true;
            }
            
            const oldestRequest = this.requests[0];
            const waitTime = this.timeWindowMs - (Date.now() - oldestRequest);
            
            console.log(`Rate limit reached. Waiting ${waitTime}ms... (attempt ${retries + 1}/${maxRetries})`);
            await this._sleep(waitTime);
            retries++;
        }
        
        throw new Error("Rate limit: Maximum retry attempts exceeded");
    }
    
    /**
     * Sleep for specified milliseconds
     */
    async _sleep(ms) {
        return new Promise(resolve => {
            Timer.schedule(ms, false, resolve);
        });
    }
}

/**
 * Common API Integrations
 */
class CommonAPIs {
    /**
     * Notion API Client
     */
    static notion(apiKey) {
        return new APIClient("https://api.notion.com/v1", {
            "Authorization": `Bearer ${apiKey}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json"
        });
    }
    
    /**
     * Airtable API Client
     */
    static airtable(apiKey, baseId) {
        return new APIClient(`https://api.airtable.com/v0/${baseId}`, {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        });
    }
    
    /**
     * GitHub API Client
     */
    static github(token) {
        return new APIClient("https://api.github.com", {
            "Authorization": `token ${token}`,
            "Accept": "application/vnd.github.v3+json"
        });
    }
    
    /**
     * Slack API Client
     */
    static slack(token) {
        return new APIClient("https://slack.com/api", {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        });
    }
    
    /**
     * Discord Webhook
     */
    static async discordWebhook(webhookURL, content, options = {}) {
        const payload = {
            content: content,
            username: options.username,
            avatar_url: options.avatarURL,
            embeds: options.embeds
        };
        
        const request = new Request(webhookURL);
        request.method = "POST";
        request.headers = { "Content-Type": "application/json" };
        request.body = JSON.stringify(payload);
        
        try {
            await request.load();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Telegram Bot API
     */
    static telegram(botToken) {
        return new APIClient(`https://api.telegram.org/bot${botToken}`, {
            "Content-Type": "application/json"
        });
    }
}

/**
 * Data Storage Helper
 * Store and retrieve data from iCloud or local storage
 */
class DataStorage {
    constructor(fileName, useICloud = true) {
        this.fileName = fileName;
        this.fm = useICloud ? FileManager.iCloud() : FileManager.local();
        this.filePath = this.fm.joinPath(
            this.fm.documentsDirectory(),
            fileName
        );
    }
    
    /**
     * Save data to file
     * @param {Object} data - Data to save
     */
    async save(data) {
        const jsonString = JSON.stringify(data, null, 2);
        this.fm.writeString(this.filePath, jsonString);
        
        if (this.fm.isFileStoredIniCloud(this.filePath)) {
            await this.fm.downloadFileFromiCloud(this.filePath);
        }
    }
    
    /**
     * Load data from file
     * @returns {Object} Loaded data or null
     */
    async load() {
        if (!this.fm.fileExists(this.filePath)) {
            return null;
        }
        
        if (this.fm.isFileStoredIniCloud(this.filePath)) {
            await this.fm.downloadFileFromiCloud(this.filePath);
        }
        
        const jsonString = this.fm.readString(this.filePath);
        
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Error parsing stored data:", error);
            return null;
        }
    }
    
    /**
     * Check if data file exists
     * @returns {boolean}
     */
    exists() {
        return this.fm.fileExists(this.filePath);
    }
    
    /**
     * Delete data file
     */
    delete() {
        if (this.fm.fileExists(this.filePath)) {
            this.fm.remove(this.filePath);
        }
    }
}

// Export classes
module.exports = {
    APIClient,
    WebhookManager,
    AuthHelper,
    RateLimiter,
    CommonAPIs,
    DataStorage
};
