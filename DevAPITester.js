/*------------------------------------------------------------------------------------------------------
Script: DevAPITester.js
Author: Development Tools Library
Date: 2026-01-30
Version: 1.0
Description: API testing and debugging tool for iOS developers
------------------------------------------------------------------------------------------------------*/

// Import the iOS Dev Tools library
const DevTools = importModule('iOSDevTools');

// ============================================== CONFIGURATION ============================================== //

const REQUESTS_FILE = "APITester/saved_requests.json";
const HISTORY_FILE = "APITester/request_history.json";

// ============================================== REQUEST MANAGEMENT ============================================== //

/**
 * Save API request template
 * @param {Object} request - Request object
 * @returns {boolean} Success status
 */
function saveRequest(request) {
    DevTools.createDirectory("APITester");
    const saved = DevTools.readFromFile(REQUESTS_FILE) || [];
    
    request.id = DevTools.generateUUID();
    request.createdAt = new Date().toISOString();
    
    saved.push(request);
    return DevTools.saveToFile(REQUESTS_FILE, saved);
}

/**
 * Get saved requests
 * @returns {Array} Saved requests
 */
function getSavedRequests() {
    return DevTools.readFromFile(REQUESTS_FILE) || [];
}

/**
 * Add to request history
 * @param {Object} request - Request details
 * @param {Object} response - Response details
 */
function addToHistory(request, response) {
    const history = DevTools.readFromFile(HISTORY_FILE) || [];
    
    history.unshift({
        id: DevTools.generateUUID(),
        timestamp: new Date().toISOString(),
        request: request,
        response: response
    });
    
    // Keep only last 50 requests
    if (history.length > 50) {
        history.splice(50);
    }
    
    DevTools.saveToFile(HISTORY_FILE, history);
}

/**
 * Get request history
 * @returns {Array} Request history
 */
function getHistory() {
    return DevTools.readFromFile(HISTORY_FILE) || [];
}

// ============================================== API TESTING FUNCTIONS ============================================== //

/**
 * Execute API request with detailed logging
 * @param {Object} requestConfig - Request configuration
 * @returns {Promise<Object>} Response with timing and details
 */
async function executeRequest(requestConfig) {
    const startTime = Date.now();
    const logger = new DevTools.Logger("APITester", false);
    
    logger.info(`Executing ${requestConfig.method} ${requestConfig.url}`);
    
    try {
        const req = new Request(requestConfig.url);
        req.method = requestConfig.method || "GET";
        req.timeoutInterval = requestConfig.timeout || 30;
        
        // Headers
        if (requestConfig.headers) {
            req.headers = requestConfig.headers;
        }
        
        // Body
        if (requestConfig.body && requestConfig.method !== "GET") {
            if (typeof requestConfig.body === 'object') {
                req.body = JSON.stringify(requestConfig.body);
                if (!req.headers) req.headers = {};
                req.headers["Content-Type"] = "application/json";
            } else {
                req.body = requestConfig.body;
            }
        }
        
        // Execute request
        let responseData;
        let responseType = "json";
        
        try {
            responseData = await req.loadJSON();
        } catch {
            try {
                responseData = await req.loadString();
                responseType = "text";
            } catch {
                responseData = "Unable to parse response";
                responseType = "error";
            }
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const result = {
            success: true,
            status: 200,
            duration: duration,
            type: responseType,
            data: responseData,
            headers: req.response ? req.response.headers : {},
            timestamp: new Date().toISOString()
        };
        
        logger.info(`Request completed in ${duration}ms`);
        
        // Add to history
        addToHistory(requestConfig, result);
        
        return result;
        
    } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        const result = {
            success: false,
            error: error.message,
            duration: duration,
            timestamp: new Date().toISOString()
        };
        
        logger.error(`Request failed: ${error.message}`);
        
        // Add to history
        addToHistory(requestConfig, result);
        
        return result;
    }
}

/**
 * Test REST API endpoint
 * @param {string} baseUrl - Base API URL
 * @param {Object} endpoints - Endpoints to test
 * @returns {Promise<Object>} Test results
 */
async function testRESTAPI(baseUrl, endpoints) {
    const results = [];
    
    for (const endpoint of endpoints) {
        const url = `${baseUrl}${endpoint.path}`;
        const config = {
            url: url,
            method: endpoint.method || "GET",
            headers: endpoint.headers || {},
            body: endpoint.body || null
        };
        
        const result = await executeRequest(config);
        results.push({
            endpoint: endpoint.name || endpoint.path,
            ...result
        });
    }
    
    return {
        baseUrl: baseUrl,
        totalTests: results.length,
        passed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results: results
    };
}

/**
 * Benchmark API endpoint
 * @param {Object} requestConfig - Request configuration
 * @param {number} iterations - Number of iterations
 * @returns {Promise<Object>} Benchmark results
 */
async function benchmarkEndpoint(requestConfig, iterations = 5) {
    const results = [];
    
    for (let i = 0; i < iterations; i++) {
        const result = await executeRequest(requestConfig);
        results.push(result);
        
        if (i < iterations - 1) {
            await DevTools.sleep(1000); // Wait 1 second between requests
        }
    }
    
    const durations = results.map(r => r.duration);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    
    return {
        iterations: iterations,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        avgDuration: Math.round(avgDuration),
        minDuration: minDuration,
        maxDuration: maxDuration,
        results: results
    };
}

// ============================================== UI FUNCTIONS ============================================== //

/**
 * Show request builder UI
 */
async function showRequestBuilder() {
    const method = await DevTools.showAlert("HTTP Method", "Select method:", ["GET", "POST", "PUT", "DELETE"]);
    const methods = ["GET", "POST", "PUT", "DELETE"];
    
    const url = await DevTools.showInputDialog("URL", "Enter API endpoint URL:", "https://api.example.com/endpoint");
    if (!url) return;
    
    const config = {
        url: url,
        method: methods[method],
        headers: {},
        body: null
    };
    
    // Headers
    const addHeaders = await DevTools.showAlert("Headers", "Add custom headers?", ["Yes", "No"]);
    if (addHeaders === 0) {
        const headersJson = await DevTools.showInputDialog(
            "Headers (JSON)",
            "Enter headers as JSON:",
            '{"Authorization": "Bearer token"}'
        );
        if (headersJson) {
            try {
                config.headers = JSON.parse(headersJson);
            } catch (e) {
                await DevTools.showAlert("Error", "Invalid JSON format");
            }
        }
    }
    
    // Body
    if (config.method !== "GET") {
        const addBody = await DevTools.showAlert("Body", "Add request body?", ["Yes", "No"]);
        if (addBody === 0) {
            const bodyJson = await DevTools.showInputDialog(
                "Body (JSON)",
                "Enter body as JSON:",
                '{"key": "value"}'
            );
            if (bodyJson) {
                try {
                    config.body = JSON.parse(bodyJson);
                } catch (e) {
                    await DevTools.showAlert("Error", "Invalid JSON format");
                }
            }
        }
    }
    
    // Execute
    const action = await DevTools.showAlert("Action", "What would you like to do?", ["Execute", "Save", "Cancel"]);
    
    if (action === 0) {
        // Execute
        const result = await executeRequest(config);
        await showRequestResult(result);
    } else if (action === 1) {
        // Save
        const name = await DevTools.showInputDialog("Save Request", "Enter request name:", "My API Request");
        if (name) {
            config.name = name;
            saveRequest(config);
            await DevTools.showAlert("Success", "Request saved!");
        }
    }
}

/**
 * Show request result
 * @param {Object} result - Request result
 */
async function showRequestResult(result) {
    const table = new UITable();
    
    // Status
    const statusRow = new UITableRow();
    statusRow.isHeader = true;
    const statusText = result.success ? `✅ Success (${result.duration}ms)` : `❌ Failed (${result.duration}ms)`;
    statusRow.addText(statusText);
    table.addRow(statusRow);
    
    if (result.success) {
        // Response type
        const typeRow = new UITableRow();
        typeRow.addText(`Type: ${result.type}`);
        table.addRow(typeRow);
        
        // Data preview
        const dataHeader = new UITableRow();
        dataHeader.isHeader = true;
        dataHeader.addText("Response Data");
        table.addRow(dataHeader);
        
        const dataRow = new UITableRow();
        const dataPreview = typeof result.data === 'object' 
            ? JSON.stringify(result.data, null, 2).substring(0, 200) 
            : String(result.data).substring(0, 200);
        dataRow.addText(dataPreview);
        table.addRow(dataRow);
        
        // Copy button
        const copyRow = new UITableRow();
        copyRow.addButton("Copy Response");
        copyRow.onSelect = () => {
            const dataToCopy = typeof result.data === 'object' 
                ? JSON.stringify(result.data, null, 2) 
                : String(result.data);
            DevTools.copyToClipboard(dataToCopy);
        };
        table.addRow(copyRow);
    } else {
        // Error
        const errorRow = new UITableRow();
        errorRow.addText(`Error: ${result.error}`);
        table.addRow(errorRow);
    }
    
    await table.present();
}

/**
 * Show saved requests
 */
async function showSavedRequests() {
    const saved = getSavedRequests();
    
    if (saved.length === 0) {
        await DevTools.showAlert("No Saved Requests", "You haven't saved any requests yet.");
        return;
    }
    
    const table = new UITable();
    table.showSeparators = true;
    
    for (const request of saved) {
        const row = new UITableRow();
        row.dismissOnSelect = true;
        
        const nameCell = row.addText(request.name || request.url);
        nameCell.titleFont = Font.boldSystemFont(14);
        
        const methodCell = row.addText(`${request.method} - ${DevTools.getRelativeTime(new Date(request.createdAt))}`);
        methodCell.titleFont = Font.systemFont(12);
        methodCell.titleColor = Color.gray();
        
        row.onSelect = async () => {
            const result = await executeRequest(request);
            await showRequestResult(result);
        };
        
        table.addRow(row);
    }
    
    await table.present();
}

/**
 * Show request history
 */
async function showRequestHistory() {
    const history = getHistory();
    
    if (history.length === 0) {
        await DevTools.showAlert("No History", "No request history available.");
        return;
    }
    
    const table = new UITable();
    table.showSeparators = true;
    
    for (const item of history.slice(0, 20)) {
        const row = new UITableRow();
        row.dismissOnSelect = true;
        
        const urlCell = row.addText(item.request.url);
        urlCell.titleFont = Font.boldSystemFont(12);
        
        const statusText = item.response.success 
            ? `✅ ${item.response.duration}ms` 
            : `❌ ${item.response.error}`;
        const statusCell = row.addText(statusText);
        statusCell.titleFont = Font.systemFont(10);
        statusCell.titleColor = item.response.success ? Color.green() : Color.red();
        
        const timeCell = row.addText(DevTools.getRelativeTime(new Date(item.timestamp)));
        timeCell.titleFont = Font.systemFont(10);
        timeCell.titleColor = Color.gray();
        
        row.onSelect = async () => {
            await showRequestResult(item.response);
        };
        
        table.addRow(row);
    }
    
    await table.present();
}

/**
 * Main menu
 */
async function showMainMenu() {
    const choice = await DevTools.showAlert(
        "API Tester",
        "Choose an action:",
        ["New Request", "Saved Requests", "History", "Quick Test"]
    );
    
    switch (choice) {
        case 0:
            await showRequestBuilder();
            break;
        case 1:
            await showSavedRequests();
            break;
        case 2:
            await showRequestHistory();
            break;
        case 3:
            // Quick test of a URL
            const url = await DevTools.showInputDialog("Quick Test", "Enter URL to test:", "https://api.github.com");
            if (url) {
                const result = await executeRequest({ url: url, method: "GET" });
                await showRequestResult(result);
            }
            break;
    }
}

// ============================================== MAIN ============================================== //

await showMainMenu();
