/*------------------------------------------------------------------------------------------------------
Script: AIPromptManager.js
Author: AI Tools Library
Date: 2026-01-30
Version: 1.0
Description: AI prompt management and template library for iOS developers
------------------------------------------------------------------------------------------------------*/

// Import the iOS Dev Tools library
const DevTools = importModule('iOSDevTools');

// ============================================== CONFIGURATION ============================================== //

const PROMPTS_FILE = "AIPrompts/prompts.json";
const CATEGORIES_FILE = "AIPrompts/categories.json";

// ============================================== PROMPT TEMPLATES ============================================== //

const DEFAULT_PROMPTS = [
    {
        id: "code_review",
        name: "Code Review",
        category: "Development",
        template: "Review the following code and provide suggestions for improvement:\n\n```{{language}}\n{{code}}\n```\n\nFocus on:\n- Code quality\n- Performance\n- Security\n- Best practices",
        variables: ["language", "code"]
    },
    {
        id: "bug_fix",
        name: "Bug Fix Assistant",
        category: "Development",
        template: "I'm experiencing a bug in my {{language}} code:\n\nBug Description: {{description}}\n\nCode:\n```{{language}}\n{{code}}\n```\n\nError Message: {{error}}\n\nPlease help me identify and fix the issue.",
        variables: ["language", "description", "code", "error"]
    },
    {
        id: "api_documentation",
        name: "API Documentation Generator",
        category: "Development",
        template: "Generate comprehensive API documentation for the following endpoint:\n\nEndpoint: {{method}} {{endpoint}}\nDescription: {{description}}\n\nParameters:\n{{parameters}}\n\nResponse:\n{{response}}\n\nPlease include:\n- Description\n- Request/Response examples\n- Error codes\n- Usage notes",
        variables: ["method", "endpoint", "description", "parameters", "response"]
    },
    {
        id: "test_cases",
        name: "Test Case Generator",
        category: "Development",
        template: "Generate comprehensive test cases for the following function:\n\n```{{language}}\n{{code}}\n```\n\nInclude:\n- Unit tests\n- Edge cases\n- Error handling tests\n- Integration tests if applicable",
        variables: ["language", "code"]
    },
    {
        id: "refactor",
        name: "Code Refactoring",
        category: "Development",
        template: "Refactor the following {{language}} code to improve:\n- Readability\n- Maintainability\n- Performance\n\nCode:\n```{{language}}\n{{code}}\n```\n\nProvide the refactored code with explanations.",
        variables: ["language", "code"]
    },
    {
        id: "explain_code",
        name: "Code Explanation",
        category: "Learning",
        template: "Explain the following code in detail:\n\n```{{language}}\n{{code}}\n```\n\nPlease explain:\n- What it does\n- How it works\n- Key concepts used\n- Potential improvements",
        variables: ["language", "code"]
    },
    {
        id: "optimize",
        name: "Performance Optimization",
        category: "Development",
        template: "Analyze and optimize the following code for performance:\n\n```{{language}}\n{{code}}\n```\n\nCurrent Performance Issues: {{issues}}\n\nProvide optimized version with benchmarks and explanations.",
        variables: ["language", "code", "issues"]
    },
    {
        id: "feature_spec",
        name: "Feature Specification",
        category: "Planning",
        template: "Create a detailed specification for the following feature:\n\nFeature Name: {{name}}\nDescription: {{description}}\nUser Story: {{user_story}}\n\nPlease include:\n- Detailed requirements\n- Acceptance criteria\n- Technical considerations\n- Edge cases\n- API endpoints (if applicable)",
        variables: ["name", "description", "user_story"]
    },
    {
        id: "data_structure",
        name: "Data Structure Design",
        category: "Development",
        template: "Design an optimal data structure for the following use case:\n\nUse Case: {{use_case}}\nOperations Needed: {{operations}}\nExpected Data Volume: {{volume}}\nPerformance Requirements: {{performance}}\n\nProvide:\n- Recommended data structure\n- Time/Space complexity analysis\n- Implementation example in {{language}}",
        variables: ["use_case", "operations", "volume", "performance", "language"]
    },
    {
        id: "debugging",
        name: "Debugging Assistant",
        category: "Development",
        template: "Help me debug this issue:\n\nProblem: {{problem}}\nExpected Behavior: {{expected}}\nActual Behavior: {{actual}}\n\nCode:\n```{{language}}\n{{code}}\n```\n\nLogs/Errors:\n```\n{{logs}}\n```\n\nProvide debugging steps and potential solutions.",
        variables: ["problem", "expected", "actual", "language", "code", "logs"]
    }
];

// ============================================== PROMPT MANAGEMENT ============================================== //

/**
 * Initialize prompts database
 */
function initializePrompts() {
    DevTools.createDirectory("AIPrompts");
    
    const existing = DevTools.readFromFile(PROMPTS_FILE);
    if (!existing) {
        DevTools.saveToFile(PROMPTS_FILE, DEFAULT_PROMPTS);
    }
}

/**
 * Get all prompts
 * @returns {Array} All prompts
 */
function getAllPrompts() {
    initializePrompts();
    return DevTools.readFromFile(PROMPTS_FILE) || [];
}

/**
 * Get prompts by category
 * @param {string} category - Category name
 * @returns {Array} Filtered prompts
 */
function getPromptsByCategory(category) {
    const prompts = getAllPrompts();
    return prompts.filter(p => p.category === category);
}

/**
 * Save new prompt
 * @param {Object} prompt - Prompt object
 * @returns {boolean} Success status
 */
function savePrompt(prompt) {
    const prompts = getAllPrompts();
    
    prompt.id = prompt.id || DevTools.generateUUID();
    prompt.createdAt = new Date().toISOString();
    
    prompts.push(prompt);
    return DevTools.saveToFile(PROMPTS_FILE, prompts);
}

/**
 * Update existing prompt
 * @param {string} id - Prompt ID
 * @param {Object} updates - Updates to apply
 * @returns {boolean} Success status
 */
function updatePrompt(id, updates) {
    const prompts = getAllPrompts();
    const index = prompts.findIndex(p => p.id === id);
    
    if (index === -1) return false;
    
    prompts[index] = { ...prompts[index], ...updates, updatedAt: new Date().toISOString() };
    return DevTools.saveToFile(PROMPTS_FILE, prompts);
}

/**
 * Delete prompt
 * @param {string} id - Prompt ID
 * @returns {boolean} Success status
 */
function deletePrompt(id) {
    const prompts = getAllPrompts();
    const filtered = prompts.filter(p => p.id !== id);
    return DevTools.saveToFile(PROMPTS_FILE, filtered);
}

/**
 * Fill prompt template with variables
 * @param {string} template - Prompt template
 * @param {Object} variables - Variable values
 * @returns {string} Filled prompt
 */
function fillTemplate(template, variables) {
    let filled = template;
    
    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        filled = filled.replace(regex, value);
    }
    
    return filled;
}

/**
 * Extract variables from template
 * @param {string} template - Prompt template
 * @returns {Array<string>} Variable names
 */
function extractVariables(template) {
    const regex = /{{(\w+)}}/g;
    const variables = [];
    let match;
    
    while ((match = regex.exec(template)) !== null) {
        if (!variables.includes(match[1])) {
            variables.push(match[1]);
        }
    }
    
    return variables;
}

// ============================================== UI FUNCTIONS ============================================== //

/**
 * Show prompt selector
 * @returns {Promise<Object>} Selected prompt
 */
async function selectPrompt() {
    const prompts = getAllPrompts();
    
    if (prompts.length === 0) {
        await DevTools.showAlert("No Prompts", "No prompts available. Add some first!");
        return null;
    }
    
    const table = new UITable();
    table.showSeparators = true;
    
    // Group by category
    const categories = [...new Set(prompts.map(p => p.category))];
    
    for (const category of categories) {
        const headerRow = new UITableRow();
        headerRow.isHeader = true;
        headerRow.addText(category);
        table.addRow(headerRow);
        
        const categoryPrompts = prompts.filter(p => p.category === category);
        
        for (const prompt of categoryPrompts) {
            const row = new UITableRow();
            row.dismissOnSelect = true;
            
            const nameCell = row.addText(prompt.name);
            nameCell.titleFont = Font.boldSystemFont(14);
            
            const varsText = prompt.variables ? `Variables: ${prompt.variables.join(', ')}` : "No variables";
            const varsCell = row.addText(varsText);
            varsCell.titleFont = Font.systemFont(10);
            varsCell.titleColor = Color.gray();
            
            row.onSelect = () => prompt;
            
            table.addRow(row);
        }
    }
    
    await table.present();
}

/**
 * Build prompt with variable input
 * @param {Object} prompt - Prompt template
 * @returns {Promise<string>} Filled prompt
 */
async function buildPrompt(prompt) {
    const variables = {};
    
    for (const varName of prompt.variables || []) {
        const value = await DevTools.showInputDialog(
            `Enter ${varName}`,
            `Provide value for ${varName}:`,
            ""
        );
        
        if (value === null) {
            return null; // User cancelled
        }
        
        variables[varName] = value;
    }
    
    return fillTemplate(prompt.template, variables);
}

/**
 * Create new prompt
 */
async function createNewPrompt() {
    const name = await DevTools.showInputDialog("Prompt Name", "Enter prompt name:", "My Custom Prompt");
    if (!name) return;
    
    const category = await DevTools.showInputDialog("Category", "Enter category:", "Custom");
    if (!category) return;
    
    const template = await DevTools.showInputDialog(
        "Template",
        "Enter prompt template (use {{variable}} for variables):",
        "Describe {{task}} in {{language}}"
    );
    if (!template) return;
    
    const variables = extractVariables(template);
    
    const prompt = {
        name: name,
        category: category,
        template: template,
        variables: variables
    };
    
    if (savePrompt(prompt)) {
        await DevTools.showAlert("Success", "Prompt saved successfully!");
    } else {
        await DevTools.showAlert("Error", "Failed to save prompt");
    }
}

/**
 * Use prompt and copy to clipboard
 */
async function usePrompt() {
    const prompts = getAllPrompts();
    
    const table = new UITable();
    table.showSeparators = true;
    
    for (const prompt of prompts) {
        const row = new UITableRow();
        row.dismissOnSelect = false;
        
        const nameCell = row.addText(prompt.name);
        nameCell.titleFont = Font.boldSystemFont(14);
        
        const categoryCell = row.addText(prompt.category);
        categoryCell.titleFont = Font.systemFont(12);
        categoryCell.titleColor = Color.gray();
        
        row.onSelect = async (idx) => {
            const selectedPrompt = prompts[idx];
            const filled = await buildPrompt(selectedPrompt);
            
            if (filled) {
                DevTools.copyToClipboard(filled);
                await DevTools.showAlert("Copied!", "Prompt copied to clipboard. You can now paste it into your AI assistant.");
            }
        };
        
        table.addRow(row);
    }
    
    await table.present();
}

/**
 * Show main menu
 */
async function showMainMenu() {
    const choice = await DevTools.showAlert(
        "AI Prompt Manager",
        "Choose an action:",
        ["Use Prompt", "Create Prompt", "Browse Prompts"]
    );
    
    switch (choice) {
        case 0:
            await usePrompt();
            break;
        case 1:
            await createNewPrompt();
            break;
        case 2:
            await selectPrompt();
            break;
    }
}

// ============================================== WIDGET ============================================== //

/**
 * Create widget showing prompt stats
 * @returns {ListWidget} Configured widget
 */
function createWidget() {
    const widget = new ListWidget();
    widget.backgroundColor = new Color("#1e1e1e");
    
    const prompts = getAllPrompts();
    const categories = [...new Set(prompts.map(p => p.category))];
    
    // Title
    const title = widget.addText("AI Prompts");
    title.font = Font.boldSystemFont(16);
    title.textColor = Color.white();
    
    widget.addSpacer(8);
    
    // Stats
    const stats = widget.addText(`${prompts.length} prompts in ${categories.length} categories`);
    stats.font = Font.systemFont(12);
    stats.textColor = new Color("#888888");
    
    widget.addSpacer(12);
    
    // Category breakdown
    for (const category of categories.slice(0, 4)) {
        const count = prompts.filter(p => p.category === category).length;
        const text = widget.addText(`${category}: ${count}`);
        text.font = Font.systemFont(11);
        text.textColor = Color.white();
        widget.addSpacer(4);
    }
    
    return widget;
}

// ============================================== MAIN ============================================== //

async function main() {
    initializePrompts();
    
    if (config.runsInWidget) {
        const widget = createWidget();
        Script.setWidget(widget);
        Script.complete();
        return;
    }
    
    await showMainMenu();
}

await main();
