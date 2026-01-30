/*------------------------------------------------------------------------------------------------------
Script: DevCodeSnippets.js
Author: Development Tools Library
Date: 2026-01-30
Version: 1.0
Description: Code snippet manager for iOS developers - save, organize, and reuse code snippets
------------------------------------------------------------------------------------------------------*/

// Import the iOS Dev Tools library
const DevTools = importModule('iOSDevTools');

// ============================================== CONFIGURATION ============================================== //

const SNIPPETS_FILE = "CodeSnippets/snippets.json";
const TAGS_FILE = "CodeSnippets/tags.json";

// ============================================== DEFAULT SNIPPETS ============================================== //

const DEFAULT_SNIPPETS = [
    {
        id: "async_await",
        title: "Async/Await Pattern",
        language: "javascript",
        code: `async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}`,
        description: "Standard async/await pattern with error handling",
        tags: ["async", "fetch", "error-handling"],
        category: "Patterns"
    },
    {
        id: "retry_logic",
        title: "Retry Logic with Backoff",
        language: "javascript",
        code: `async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}`,
        description: "Retry function with exponential backoff",
        tags: ["retry", "backoff", "resilience"],
        category: "Patterns"
    },
    {
        id: "debounce",
        title: "Debounce Function",
        language: "javascript",
        code: `function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
        description: "Debounce function to limit execution rate",
        tags: ["debounce", "performance", "optimization"],
        category: "Utilities"
    },
    {
        id: "deep_clone",
        title: "Deep Clone Object",
        language: "javascript",
        code: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}`,
        description: "Deep clone objects including nested structures",
        tags: ["clone", "object", "utilities"],
        category: "Utilities"
    },
    {
        id: "scriptable_notification",
        title: "Scriptable Notification",
        language: "javascript",
        code: `async function sendNotification(title, body, sound = 'default') {
  const notification = new Notification();
  notification.title = title;
  notification.body = body;
  notification.sound = sound;
  await notification.schedule();
}`,
        description: "Send local notification in Scriptable",
        tags: ["scriptable", "notification", "ios"],
        category: "Scriptable"
    },
    {
        id: "scriptable_widget",
        title: "Basic Scriptable Widget",
        language: "javascript",
        code: `function createWidget() {
  const widget = new ListWidget();
  widget.backgroundColor = new Color('#1e1e1e');
  
  const title = widget.addText('Hello World');
  title.font = Font.boldSystemFont(16);
  title.textColor = Color.white();
  
  widget.addSpacer(8);
  
  const subtitle = widget.addText('Subtitle text');
  subtitle.font = Font.systemFont(12);
  subtitle.textColor = Color.gray();
  
  return widget;
}

if (config.runsInWidget) {
  const widget = createWidget();
  Script.setWidget(widget);
  Script.complete();
}`,
        description: "Basic Scriptable widget template",
        tags: ["scriptable", "widget", "ios"],
        category: "Scriptable"
    },
    {
        id: "api_request",
        title: "API Request Template",
        language: "javascript",
        code: `async function apiRequest(url, options = {}) {
  const req = new Request(url);
  req.method = options.method || 'GET';
  req.headers = options.headers || {};
  
  if (options.body) {
    req.body = JSON.stringify(options.body);
    req.headers['Content-Type'] = 'application/json';
  }
  
  try {
    const response = await req.loadJSON();
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message };
  }
}`,
        description: "Flexible API request template",
        tags: ["api", "http", "request"],
        category: "Network"
    },
    {
        id: "cache_manager",
        title: "Simple Cache Manager",
        language: "javascript",
        code: `class CacheManager {
  constructor(cacheName) {
    this.fm = FileManager.iCloud();
    this.cachePath = this.fm.joinPath(
      this.fm.documentsDirectory(), 
      \`Cache/\${cacheName}\`
    );
  }
  
  async get(key, maxAge = 3600000) {
    const filePath = this.fm.joinPath(this.cachePath, key);
    if (!this.fm.fileExists(filePath)) return null;
    
    const modified = this.fm.modificationDate(filePath);
    const age = Date.now() - modified.getTime();
    
    if (age > maxAge) {
      this.fm.remove(filePath);
      return null;
    }
    
    const data = this.fm.readString(filePath);
    return JSON.parse(data);
  }
  
  async set(key, value) {
    if (!this.fm.fileExists(this.cachePath)) {
      this.fm.createDirectory(this.cachePath, true);
    }
    const filePath = this.fm.joinPath(this.cachePath, key);
    this.fm.writeString(filePath, JSON.stringify(value));
  }
}`,
        description: "Simple file-based cache with TTL",
        tags: ["cache", "storage", "scriptable"],
        category: "Storage"
    }
];

// ============================================== SNIPPET MANAGEMENT ============================================== //

/**
 * Initialize snippets database
 */
function initializeSnippets() {
    DevTools.createDirectory("CodeSnippets");
    
    const existing = DevTools.readFromFile(SNIPPETS_FILE);
    if (!existing) {
        DevTools.saveToFile(SNIPPETS_FILE, DEFAULT_SNIPPETS);
    }
}

/**
 * Get all snippets
 * @returns {Array} All snippets
 */
function getAllSnippets() {
    initializeSnippets();
    return DevTools.readFromFile(SNIPPETS_FILE) || [];
}

/**
 * Get snippets by category
 * @param {string} category - Category name
 * @returns {Array} Filtered snippets
 */
function getSnippetsByCategory(category) {
    const snippets = getAllSnippets();
    return snippets.filter(s => s.category === category);
}

/**
 * Get snippets by tag
 * @param {string} tag - Tag name
 * @returns {Array} Filtered snippets
 */
function getSnippetsByTag(tag) {
    const snippets = getAllSnippets();
    return snippets.filter(s => s.tags && s.tags.includes(tag));
}

/**
 * Search snippets
 * @param {string} query - Search query
 * @returns {Array} Matching snippets
 */
function searchSnippets(query) {
    const snippets = getAllSnippets();
    const lowerQuery = query.toLowerCase();
    
    return snippets.filter(s => 
        s.title.toLowerCase().includes(lowerQuery) ||
        s.description.toLowerCase().includes(lowerQuery) ||
        s.code.toLowerCase().includes(lowerQuery) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(lowerQuery)))
    );
}

/**
 * Save snippet
 * @param {Object} snippet - Snippet object
 * @returns {boolean} Success status
 */
function saveSnippet(snippet) {
    const snippets = getAllSnippets();
    
    snippet.id = snippet.id || DevTools.generateUUID();
    snippet.createdAt = snippet.createdAt || new Date().toISOString();
    snippet.updatedAt = new Date().toISOString();
    
    const index = snippets.findIndex(s => s.id === snippet.id);
    
    if (index >= 0) {
        snippets[index] = snippet;
    } else {
        snippets.push(snippet);
    }
    
    return DevTools.saveToFile(SNIPPETS_FILE, snippets);
}

/**
 * Delete snippet
 * @param {string} id - Snippet ID
 * @returns {boolean} Success status
 */
function deleteSnippet(id) {
    const snippets = getAllSnippets();
    const filtered = snippets.filter(s => s.id !== id);
    return DevTools.saveToFile(SNIPPETS_FILE, filtered);
}

/**
 * Get all unique tags
 * @returns {Array<string>} All tags
 */
function getAllTags() {
    const snippets = getAllSnippets();
    const tags = new Set();
    
    snippets.forEach(s => {
        if (s.tags) {
            s.tags.forEach(t => tags.add(t));
        }
    });
    
    return Array.from(tags).sort();
}

/**
 * Get all unique categories
 * @returns {Array<string>} All categories
 */
function getAllCategories() {
    const snippets = getAllSnippets();
    const categories = new Set();
    
    snippets.forEach(s => {
        if (s.category) {
            categories.add(s.category);
        }
    });
    
    return Array.from(categories).sort();
}

// ============================================== UI FUNCTIONS ============================================== //

/**
 * Show snippets browser
 */
async function browseSnippets() {
    const snippets = getAllSnippets();
    
    if (snippets.length === 0) {
        await DevTools.showAlert("No Snippets", "No snippets available.");
        return;
    }
    
    const table = new UITable();
    table.showSeparators = true;
    
    const categories = getAllCategories();
    
    for (const category of categories) {
        const headerRow = new UITableRow();
        headerRow.isHeader = true;
        headerRow.addText(category);
        table.addRow(headerRow);
        
        const categorySnippets = getSnippetsByCategory(category);
        
        for (const snippet of categorySnippets) {
            const row = new UITableRow();
            row.dismissOnSelect = false;
            
            const titleCell = row.addText(snippet.title);
            titleCell.titleFont = Font.boldSystemFont(14);
            
            const langCell = row.addText(`${snippet.language} • ${snippet.tags ? snippet.tags.join(', ') : 'no tags'}`);
            langCell.titleFont = Font.systemFont(10);
            langCell.titleColor = Color.gray();
            
            row.onSelect = async () => {
                await showSnippetDetail(snippet);
            };
            
            table.addRow(row);
        }
    }
    
    await table.present();
}

/**
 * Show snippet detail
 * @param {Object} snippet - Snippet to display
 */
async function showSnippetDetail(snippet) {
    const table = new UITable();
    
    // Title
    const titleRow = new UITableRow();
    titleRow.isHeader = true;
    titleRow.addText(snippet.title);
    table.addRow(titleRow);
    
    // Description
    const descRow = new UITableRow();
    descRow.addText(snippet.description);
    table.addRow(descRow);
    
    // Metadata
    const metaRow = new UITableRow();
    metaRow.addText(`Language: ${snippet.language} | Category: ${snippet.category}`);
    table.addRow(metaRow);
    
    // Tags
    if (snippet.tags && snippet.tags.length > 0) {
        const tagsRow = new UITableRow();
        tagsRow.addText(`Tags: ${snippet.tags.join(', ')}`);
        table.addRow(tagsRow);
    }
    
    // Code
    const codeHeader = new UITableRow();
    codeHeader.isHeader = true;
    codeHeader.addText("Code");
    table.addRow(codeHeader);
    
    const codeRow = new UITableRow();
    const codeText = codeRow.addText(snippet.code);
    codeText.titleFont = Font.regularMonospacedSystemFont(10);
    table.addRow(codeRow);
    
    // Actions
    const actionsHeader = new UITableRow();
    actionsHeader.isHeader = true;
    actionsHeader.addText("Actions");
    table.addRow(actionsHeader);
    
    const copyRow = new UITableRow();
    copyRow.addButton("Copy Code");
    copyRow.onSelect = () => {
        DevTools.copyToClipboard(snippet.code);
    };
    table.addRow(copyRow);
    
    await table.present();
}

/**
 * Create new snippet
 */
async function createNewSnippet() {
    const title = await DevTools.showInputDialog("Title", "Enter snippet title:", "My Snippet");
    if (!title) return;
    
    const description = await DevTools.showInputDialog("Description", "Enter description:", "");
    if (!description) return;
    
    const language = await DevTools.showInputDialog("Language", "Enter language:", "javascript");
    if (!language) return;
    
    const code = await DevTools.showInputDialog("Code", "Paste your code:", "// Your code here");
    if (!code) return;
    
    const category = await DevTools.showInputDialog("Category", "Enter category:", "Utilities");
    
    const tagsStr = await DevTools.showInputDialog("Tags", "Enter tags (comma-separated):", "tag1, tag2");
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];
    
    const snippet = {
        title: title,
        description: description,
        language: language,
        code: code,
        category: category || "Uncategorized",
        tags: tags
    };
    
    if (saveSnippet(snippet)) {
        await DevTools.showAlert("Success", "Snippet saved successfully!");
    } else {
        await DevTools.showAlert("Error", "Failed to save snippet");
    }
}

/**
 * Search snippets UI
 */
async function searchSnippetsUI() {
    const query = await DevTools.showInputDialog("Search", "Enter search query:", "");
    if (!query) return;
    
    const results = searchSnippets(query);
    
    if (results.length === 0) {
        await DevTools.showAlert("No Results", `No snippets found for "${query}"`);
        return;
    }
    
    const table = new UITable();
    table.showSeparators = true;
    
    const headerRow = new UITableRow();
    headerRow.isHeader = true;
    headerRow.addText(`Search Results (${results.length})`);
    table.addRow(headerRow);
    
    for (const snippet of results) {
        const row = new UITableRow();
        row.dismissOnSelect = false;
        
        const titleCell = row.addText(snippet.title);
        titleCell.titleFont = Font.boldSystemFont(14);
        
        const descCell = row.addText(snippet.description);
        descCell.titleFont = Font.systemFont(11);
        descCell.titleColor = Color.gray();
        
        row.onSelect = async () => {
            await showSnippetDetail(snippet);
        };
        
        table.addRow(row);
    }
    
    await table.present();
}

/**
 * Browse by tags
 */
async function browseByTags() {
    const tags = getAllTags();
    
    if (tags.length === 0) {
        await DevTools.showAlert("No Tags", "No tags available.");
        return;
    }
    
    const table = new UITable();
    table.showSeparators = true;
    
    const headerRow = new UITableRow();
    headerRow.isHeader = true;
    headerRow.addText("Tags");
    table.addRow(headerRow);
    
    for (const tag of tags) {
        const snippets = getSnippetsByTag(tag);
        
        const row = new UITableRow();
        row.dismissOnSelect = false;
        
        const tagCell = row.addText(`#${tag}`);
        tagCell.titleFont = Font.boldSystemFont(14);
        
        const countCell = row.addText(`${snippets.length} snippet${snippets.length !== 1 ? 's' : ''}`);
        countCell.titleFont = Font.systemFont(11);
        countCell.titleColor = Color.gray();
        
        row.onSelect = async () => {
            await showTagSnippets(tag, snippets);
        };
        
        table.addRow(row);
    }
    
    await table.present();
}

/**
 * Show snippets for a tag
 * @param {string} tag - Tag name
 * @param {Array} snippets - Snippets with this tag
 */
async function showTagSnippets(tag, snippets) {
    const table = new UITable();
    table.showSeparators = true;
    
    const headerRow = new UITableRow();
    headerRow.isHeader = true;
    headerRow.addText(`#${tag} (${snippets.length})`);
    table.addRow(headerRow);
    
    for (const snippet of snippets) {
        const row = new UITableRow();
        row.dismissOnSelect = false;
        
        const titleCell = row.addText(snippet.title);
        titleCell.titleFont = Font.boldSystemFont(14);
        
        row.onSelect = async () => {
            await showSnippetDetail(snippet);
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
        "Code Snippets",
        "Choose an action:",
        ["Browse", "Search", "Tags", "New Snippet"]
    );
    
    switch (choice) {
        case 0:
            await browseSnippets();
            break;
        case 1:
            await searchSnippetsUI();
            break;
        case 2:
            await browseByTags();
            break;
        case 3:
            await createNewSnippet();
            break;
    }
}

// ============================================== WIDGET ============================================== //

/**
 * Create snippet widget
 * @returns {ListWidget} Configured widget
 */
function createWidget() {
    const widget = new ListWidget();
    widget.backgroundColor = new Color("#1e1e1e");
    
    const snippets = getAllSnippets();
    const categories = getAllCategories();
    
    // Title
    const title = widget.addText("📝 Code Snippets");
    title.font = Font.boldSystemFont(14);
    title.textColor = Color.white();
    
    widget.addSpacer(8);
    
    // Stats
    const stats = widget.addText(`${snippets.length} snippets in ${categories.length} categories`);
    stats.font = Font.systemFont(11);
    stats.textColor = new Color("#888888");
    
    return widget;
}

// ============================================== MAIN ============================================== //

async function main() {
    initializeSnippets();
    
    if (config.runsInWidget) {
        const widget = createWidget();
        Script.setWidget(widget);
        Script.complete();
        return;
    }
    
    await showMainMenu();
}

await main();
