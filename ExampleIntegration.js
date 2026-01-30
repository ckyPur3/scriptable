/*------------------------------------------------------------------------------------------------------
Script: ExampleIntegration.js
Author: Example Scripts
Date: 2026-01-30
Version: 1.0
Description: Example script demonstrating integration of all development tools
------------------------------------------------------------------------------------------------------*/

// Import the iOS Dev Tools library
const DevTools = importModule('iOSDevTools');

// ============================================== EXAMPLE 1: DEVICE INFO ============================================== //

async function exampleDeviceInfo() {
    console.log("=== Example 1: Device Information ===");
    
    const deviceInfo = DevTools.getDeviceInfo();
    console.log(`Device: ${deviceInfo.name}`);
    console.log(`Model: ${deviceInfo.model}`);
    console.log(`iOS Version: ${deviceInfo.systemVersion}`);
    console.log(`Battery: ${Math.round(deviceInfo.batteryLevel * 100)}%`);
    console.log(`Free Space: ${Math.round(deviceInfo.diskSpace.free / 1024 / 1024 / 1024)} GB`);
    
    // Check battery
    if (DevTools.isLowBattery()) {
        console.log("⚠️ Battery is low!");
    }
}

// ============================================== EXAMPLE 2: API REQUEST ============================================== //

async function exampleAPIRequest() {
    console.log("\n=== Example 2: API Request with Retry ===");
    
    // Make API request with automatic retry
    const result = await DevTools.httpRequestWithRetry(
        'https://api.github.com/users/github',
        { retries: 3, timeout: 10 }
    );
    
    if (result.success) {
        console.log(`✓ User: ${result.data.name}`);
        console.log(`✓ Followers: ${result.data.followers}`);
        console.log(`✓ Attempt: ${result.attempt}`);
    } else {
        console.log(`✗ Error: ${result.error}`);
    }
}

// ============================================== EXAMPLE 3: CACHING ============================================== //

async function exampleCaching() {
    console.log("\n=== Example 3: Request Caching ===");
    
    // First request - will fetch from API
    console.log("First request (from API)...");
    const result1 = await DevTools.cachedRequest(
        'https://api.github.com/users/octocat',
        'github_user_octocat',
        1 // Cache for 1 hour
    );
    console.log(`✓ From cache: ${result1.fromCache}`);
    console.log(`✓ User: ${result1.data.name}`);
    
    // Second request - will use cache
    console.log("\nSecond request (from cache)...");
    const result2 = await DevTools.cachedRequest(
        'https://api.github.com/users/octocat',
        'github_user_octocat',
        1
    );
    console.log(`✓ From cache: ${result2.fromCache}`);
    console.log(`✓ Cache age: ${Math.round(result2.age * 60)} minutes`);
}

// ============================================== EXAMPLE 4: FILE OPERATIONS ============================================== //

async function exampleFileOperations() {
    console.log("\n=== Example 4: File Operations ===");
    
    // Save data
    const data = {
        name: "Test Project",
        version: "1.0.0",
        created: new Date().toISOString()
    };
    
    console.log("Saving data...");
    DevTools.saveToFile("example_data.json", data);
    console.log("✓ Data saved");
    
    // Read data
    console.log("\nReading data...");
    const readData = DevTools.readFromFile("example_data.json");
    console.log(`✓ Name: ${readData.name}`);
    console.log(`✓ Version: ${readData.version}`);
    
    // Create directory
    console.log("\nCreating directory...");
    DevTools.createDirectory("ExampleProject/src");
    console.log("✓ Directory created");
    
    // List files
    console.log("\nListing files...");
    const files = DevTools.listFiles();
    console.log(`✓ Found ${files.length} files/directories`);
}

// ============================================== EXAMPLE 5: KEYCHAIN ============================================== //

async function exampleKeychain() {
    console.log("\n=== Example 5: Secure Storage ===");
    
    // Save to keychain
    console.log("Saving API key to keychain...");
    DevTools.saveToKeychain("example_api_key", "sk-test-12345");
    console.log("✓ API key saved securely");
    
    // Check if exists
    const exists = DevTools.keychainContains("example_api_key");
    console.log(`✓ Key exists: ${exists}`);
    
    // Retrieve from keychain
    const apiKey = DevTools.getFromKeychain("example_api_key");
    console.log(`✓ Retrieved: ${apiKey.substring(0, 10)}...`);
    
    // Remove from keychain
    console.log("\nRemoving from keychain...");
    DevTools.removeFromKeychain("example_api_key");
    console.log("✓ API key removed");
}

// ============================================== EXAMPLE 6: LOGGING ============================================== //

async function exampleLogging() {
    console.log("\n=== Example 6: Advanced Logging ===");
    
    // Create logger
    const logger = new DevTools.Logger("ExampleApp", false);
    
    logger.info("Application started");
    logger.debug("Debug information");
    logger.warn("Warning message");
    logger.error("Error occurred");
    
    console.log("✓ Logs generated");
}

// ============================================== EXAMPLE 7: NOTIFICATIONS ============================================== //

async function exampleNotifications() {
    console.log("\n=== Example 7: Notifications ===");
    
    // Send immediate notification
    await DevTools.sendNotification(
        "Test Notification",
        "This is a test notification from Example Integration",
        null,
        { sound: "default" }
    );
    console.log("✓ Notification sent");
    
    // Schedule notification for 10 seconds from now
    const futureDate = new Date(Date.now() + 10000);
    await DevTools.sendNotification(
        "Scheduled Notification",
        "This notification was scheduled",
        futureDate
    );
    console.log("✓ Notification scheduled for 10 seconds from now");
}

// ============================================== EXAMPLE 8: UTILITIES ============================================== //

async function exampleUtilities() {
    console.log("\n=== Example 8: Utility Functions ===");
    
    // UUID generation
    const uuid = DevTools.generateUUID();
    console.log(`✓ UUID: ${uuid}`);
    
    // Date formatting
    const now = new Date();
    const formatted = DevTools.formatDate(now, "yyyy-MM-dd HH:mm:ss");
    console.log(`✓ Formatted date: ${formatted}`);
    
    // Relative time
    const pastDate = new Date(Date.now() - 3600000); // 1 hour ago
    const relative = DevTools.getRelativeTime(pastDate);
    console.log(`✓ Relative time: ${relative}`);
    
    // Sleep
    console.log("✓ Sleeping for 1 second...");
    await DevTools.sleep(1000);
    console.log("✓ Awake!");
}

// ============================================== EXAMPLE 9: NETWORK CHECK ============================================== //

async function exampleNetworkCheck() {
    console.log("\n=== Example 9: Network Connectivity ===");
    
    const status = await DevTools.checkNetworkConnectivity();
    
    if (status.isConnected) {
        console.log("✓ Internet connection available");
    } else {
        console.log("✗ No internet connection");
        console.log(`  Error: ${status.error}`);
    }
}

// ============================================== EXAMPLE 10: CLIPBOARD ============================================== //

async function exampleClipboard() {
    console.log("\n=== Example 10: Clipboard Operations ===");
    
    // Copy to clipboard
    const testData = "Hello from Scriptable!";
    DevTools.copyToClipboard(testData);
    console.log("✓ Copied to clipboard");
    
    // Read from clipboard
    const clipboardContent = DevTools.getFromClipboard();
    console.log(`✓ Clipboard content: ${clipboardContent}`);
}

// ============================================== MAIN ============================================== //

async function main() {
    console.log("╔═══════════════════════════════════════════════════════╗");
    console.log("║   iOS DevTools - Integration Examples                ║");
    console.log("║   Demonstrating all features                          ║");
    console.log("╚═══════════════════════════════════════════════════════╝\n");
    
    try {
        // Run all examples
        await exampleDeviceInfo();
        await exampleAPIRequest();
        await exampleCaching();
        await exampleFileOperations();
        await exampleKeychain();
        await exampleLogging();
        await exampleNotifications();
        await exampleUtilities();
        await exampleNetworkCheck();
        await exampleClipboard();
        
        console.log("\n╔═══════════════════════════════════════════════════════╗");
        console.log("║   All examples completed successfully! ✓              ║");
        console.log("╚═══════════════════════════════════════════════════════╝");
        
        // Show completion alert
        await DevTools.showAlert(
            "Examples Complete",
            "All integration examples have been executed. Check the console for details."
        );
        
    } catch (error) {
        console.error("\n✗ Error occurred:", error.message);
        await DevTools.showAlert("Error", error.message);
    }
}

// Run the examples
await main();
