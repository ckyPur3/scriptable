/*------------------------------------------------------------------------------------------------------
Script: AgentOrchestrator.js
Author: AI Agent System
Date: 2026-01-30
Version: 1.0
Description: Orchestrator agent that coordinates development tools, AI assistants, and workflow automation
------------------------------------------------------------------------------------------------------*/

// Import the iOS Dev Tools library
const DevTools = importModule('iOSDevTools');

// ============================================== CONFIGURATION ============================================== //

const TASKS_FILE = "AgentOrchestrator/tasks.json";
const WORKFLOWS_FILE = "AgentOrchestrator/workflows.json";
const AGENTS_FILE = "AgentOrchestrator/agents.json";

// ============================================== AGENT DEFINITIONS ============================================== //

const AVAILABLE_AGENTS = {
    github: {
        id: "github",
        name: "GitHub Agent",
        description: "Manages GitHub repositories, issues, PRs, and notifications",
        script: "DevGitHub",
        capabilities: ["repository_management", "issue_tracking", "pr_review", "notifications"],
        icon: "📦"
    },
    api_tester: {
        id: "api_tester",
        name: "API Testing Agent",
        description: "Tests and debugs API endpoints",
        script: "DevAPITester",
        capabilities: ["api_testing", "endpoint_debugging", "request_benchmarking"],
        icon: "🔌"
    },
    ai_assistant: {
        id: "ai_assistant",
        name: "AI Assistant Agent",
        description: "Provides AI-powered code assistance and prompt management",
        script: "AIPromptManager",
        capabilities: ["code_review", "prompt_management", "ai_integration"],
        icon: "🤖"
    },
    weather: {
        id: "weather",
        name: "Weather Agent",
        description: "Provides weather information and forecasts",
        script: "LSWeather",
        capabilities: ["weather_data", "calendar_integration"],
        icon: "⛅"
    },
    contacts: {
        id: "contacts",
        name: "Contacts Agent",
        description: "Manages favorite contacts and quick actions",
        script: "FavContacts",
        capabilities: ["contact_management", "quick_communication"],
        icon: "👥"
    }
};

// ============================================== TASK MANAGEMENT ============================================== //

/**
 * Initialize orchestrator storage
 */
function initialize() {
    DevTools.createDirectory("AgentOrchestrator");
    
    if (!DevTools.readFromFile(TASKS_FILE)) {
        DevTools.saveToFile(TASKS_FILE, []);
    }
    if (!DevTools.readFromFile(WORKFLOWS_FILE)) {
        DevTools.saveToFile(WORKFLOWS_FILE, getDefaultWorkflows());
    }
    if (!DevTools.readFromFile(AGENTS_FILE)) {
        DevTools.saveToFile(AGENTS_FILE, Object.values(AVAILABLE_AGENTS));
    }
}

/**
 * Get default workflows
 * @returns {Array} Default workflow definitions
 */
function getDefaultWorkflows() {
    return [
        {
            id: "morning_routine",
            name: "Morning Dev Routine",
            description: "Check GitHub notifications, weather, and review tasks",
            steps: [
                { agent: "weather", action: "get_forecast" },
                { agent: "github", action: "check_notifications" },
                { agent: "github", action: "list_repositories" }
            ],
            schedule: "daily",
            enabled: true
        },
        {
            id: "api_health_check",
            name: "API Health Check",
            description: "Test critical API endpoints",
            steps: [
                { agent: "api_tester", action: "test_endpoints", params: { endpoints: [] } }
            ],
            schedule: "hourly",
            enabled: false
        },
        {
            id: "code_review_workflow",
            name: "Code Review Workflow",
            description: "Automated code review process",
            steps: [
                { agent: "github", action: "list_pull_requests" },
                { agent: "ai_assistant", action: "review_code" }
            ],
            schedule: "manual",
            enabled: true
        }
    ];
}

/**
 * Create new task
 * @param {Object} task - Task definition
 * @returns {boolean} Success status
 */
function createTask(task) {
    const tasks = DevTools.readFromFile(TASKS_FILE) || [];
    
    task.id = DevTools.generateUUID();
    task.status = "pending";
    task.createdAt = new Date().toISOString();
    task.updatedAt = new Date().toISOString();
    
    tasks.push(task);
    return DevTools.saveToFile(TASKS_FILE, tasks);
}

/**
 * Get all tasks
 * @param {string} status - Filter by status (optional)
 * @returns {Array} Tasks
 */
function getTasks(status = null) {
    const tasks = DevTools.readFromFile(TASKS_FILE) || [];
    
    if (status) {
        return tasks.filter(t => t.status === status);
    }
    
    return tasks;
}

/**
 * Update task status
 * @param {string} taskId - Task ID
 * @param {string} status - New status
 * @param {Object} result - Task result
 * @returns {boolean} Success status
 */
function updateTaskStatus(taskId, status, result = null) {
    const tasks = DevTools.readFromFile(TASKS_FILE) || [];
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return false;
    
    task.status = status;
    task.updatedAt = new Date().toISOString();
    
    if (result) {
        task.result = result;
    }
    
    if (status === "completed") {
        task.completedAt = new Date().toISOString();
    }
    
    return DevTools.saveToFile(TASKS_FILE, tasks);
}

/**
 * Get workflows
 * @returns {Array} Workflows
 */
function getWorkflows() {
    return DevTools.readFromFile(WORKFLOWS_FILE) || [];
}

/**
 * Save workflow
 * @param {Object} workflow - Workflow definition
 * @returns {boolean} Success status
 */
function saveWorkflow(workflow) {
    const workflows = getWorkflows();
    
    workflow.id = workflow.id || DevTools.generateUUID();
    workflow.createdAt = workflow.createdAt || new Date().toISOString();
    workflow.updatedAt = new Date().toISOString();
    
    const index = workflows.findIndex(w => w.id === workflow.id);
    
    if (index >= 0) {
        workflows[index] = workflow;
    } else {
        workflows.push(workflow);
    }
    
    return DevTools.saveToFile(WORKFLOWS_FILE, workflows);
}

// ============================================== ORCHESTRATION ============================================== //

/**
 * Route task to appropriate agent
 * @param {Object} task - Task object
 * @returns {Promise<Object>} Agent and execution plan
 */
async function routeTask(task) {
    const logger = new DevTools.Logger("Orchestrator", false);
    logger.info(`Routing task: ${task.description}`);
    
    // Simple keyword-based routing
    const keywords = task.description.toLowerCase();
    
    let selectedAgent = null;
    
    if (keywords.includes("github") || keywords.includes("repository") || keywords.includes("pr") || keywords.includes("issue")) {
        selectedAgent = AVAILABLE_AGENTS.github;
    } else if (keywords.includes("api") || keywords.includes("endpoint") || keywords.includes("test")) {
        selectedAgent = AVAILABLE_AGENTS.api_tester;
    } else if (keywords.includes("ai") || keywords.includes("code review") || keywords.includes("prompt")) {
        selectedAgent = AVAILABLE_AGENTS.ai_assistant;
    } else if (keywords.includes("weather") || keywords.includes("forecast")) {
        selectedAgent = AVAILABLE_AGENTS.weather;
    } else if (keywords.includes("contact") || keywords.includes("call") || keywords.includes("message")) {
        selectedAgent = AVAILABLE_AGENTS.contacts;
    }
    
    if (!selectedAgent) {
        logger.warn("No specific agent found, using AI assistant as default");
        selectedAgent = AVAILABLE_AGENTS.ai_assistant;
    }
    
    logger.info(`Selected agent: ${selectedAgent.name}`);
    
    return {
        agent: selectedAgent,
        confidence: 0.8
    };
}

/**
 * Execute workflow
 * @param {Object} workflow - Workflow definition
 * @returns {Promise<Object>} Execution result
 */
async function executeWorkflow(workflow) {
    const logger = new DevTools.Logger("Orchestrator", false);
    logger.info(`Executing workflow: ${workflow.name}`);
    
    const results = [];
    
    for (const step of workflow.steps) {
        logger.info(`Executing step with agent: ${step.agent}`);
        
        const agent = AVAILABLE_AGENTS[step.agent];
        
        if (!agent) {
            logger.error(`Agent not found: ${step.agent}`);
            results.push({
                agent: step.agent,
                success: false,
                error: "Agent not found"
            });
            continue;
        }
        
        // In a real implementation, this would call the actual agent script
        // For now, we'll simulate the execution
        results.push({
            agent: agent.name,
            action: step.action,
            success: true,
            timestamp: new Date().toISOString()
        });
        
        await DevTools.sleep(100); // Small delay between steps
    }
    
    return {
        workflow: workflow.name,
        totalSteps: workflow.steps.length,
        results: results,
        success: results.every(r => r.success),
        completedAt: new Date().toISOString()
    };
}

/**
 * Execute single task
 * @param {Object} task - Task to execute
 * @returns {Promise<Object>} Execution result
 */
async function executeTask(task) {
    const logger = new DevTools.Logger("Orchestrator", false);
    logger.info(`Executing task: ${task.description}`);
    
    updateTaskStatus(task.id, "in_progress");
    
    try {
        const routing = await routeTask(task);
        
        // Simulate task execution
        const result = {
            agent: routing.agent.name,
            confidence: routing.confidence,
            success: true,
            message: `Task executed by ${routing.agent.name}`,
            timestamp: new Date().toISOString()
        };
        
        updateTaskStatus(task.id, "completed", result);
        
        logger.info(`Task completed successfully`);
        return result;
        
    } catch (error) {
        logger.error(`Task failed: ${error.message}`);
        updateTaskStatus(task.id, "failed", { error: error.message });
        throw error;
    }
}

// ============================================== UI FUNCTIONS ============================================== //

/**
 * Show agent dashboard
 */
async function showAgentDashboard() {
    const table = new UITable();
    table.showSeparators = true;
    
    // Header
    const headerRow = new UITableRow();
    headerRow.isHeader = true;
    headerRow.addText("Available Agents");
    table.addRow(headerRow);
    
    // Agents
    for (const agent of Object.values(AVAILABLE_AGENTS)) {
        const row = new UITableRow();
        
        const nameCell = row.addText(`${agent.icon} ${agent.name}`);
        nameCell.titleFont = Font.boldSystemFont(14);
        
        const descCell = row.addText(agent.description);
        descCell.titleFont = Font.systemFont(11);
        descCell.titleColor = Color.gray();
        
        table.addRow(row);
    }
    
    // Tasks
    const tasksHeader = new UITableRow();
    tasksHeader.isHeader = true;
    tasksHeader.addText("Recent Tasks");
    table.addRow(tasksHeader);
    
    const tasks = getTasks();
    const recentTasks = tasks.slice(-5).reverse();
    
    for (const task of recentTasks) {
        const row = new UITableRow();
        
        const statusIcon = task.status === "completed" ? "✅" : 
                          task.status === "failed" ? "❌" : 
                          task.status === "in_progress" ? "🔄" : "⏳";
        
        const taskCell = row.addText(`${statusIcon} ${task.description}`);
        taskCell.titleFont = Font.systemFont(12);
        
        table.addRow(row);
    }
    
    await table.present();
}

/**
 * Create new task UI
 */
async function createNewTask() {
    const description = await DevTools.showInputDialog(
        "New Task",
        "Enter task description:",
        "Review GitHub PRs"
    );
    
    if (!description) return;
    
    const priority = await DevTools.showAlert(
        "Priority",
        "Select task priority:",
        ["Low", "Medium", "High"]
    );
    
    const priorities = ["low", "medium", "high"];
    
    const task = {
        description: description,
        priority: priorities[priority],
        type: "manual"
    };
    
    if (createTask(task)) {
        await DevTools.showAlert("Success", "Task created successfully!");
        
        // Ask if they want to execute now
        const execute = await DevTools.showAlert(
            "Execute Now?",
            "Would you like to execute this task now?",
            ["Yes", "No"]
        );
        
        if (execute === 0) {
            const result = await executeTask(task);
            await DevTools.showAlert(
                "Task Completed",
                `Handled by: ${result.agent}\nStatus: ${result.success ? 'Success' : 'Failed'}`
            );
        }
    }
}

/**
 * Show workflow manager
 */
async function showWorkflowManager() {
    const workflows = getWorkflows();
    
    const table = new UITable();
    table.showSeparators = true;
    
    const headerRow = new UITableRow();
    headerRow.isHeader = true;
    headerRow.addText("Workflows");
    table.addRow(headerRow);
    
    for (const workflow of workflows) {
        const row = new UITableRow();
        row.dismissOnSelect = false;
        
        const statusIcon = workflow.enabled ? "✅" : "⏸️";
        const nameCell = row.addText(`${statusIcon} ${workflow.name}`);
        nameCell.titleFont = Font.boldSystemFont(14);
        
        const descCell = row.addText(workflow.description);
        descCell.titleFont = Font.systemFont(11);
        descCell.titleColor = Color.gray();
        
        const stepsCell = row.addText(`${workflow.steps.length} steps • ${workflow.schedule}`);
        stepsCell.titleFont = Font.systemFont(10);
        stepsCell.titleColor = Color.blue();
        
        row.onSelect = async (idx) => {
            const selected = workflows[idx];
            const action = await DevTools.showAlert(
                selected.name,
                selected.description,
                ["Execute", "Toggle", "Cancel"]
            );
            
            if (action === 0) {
                const result = await executeWorkflow(selected);
                await DevTools.showAlert(
                    "Workflow Complete",
                    `Executed ${result.totalSteps} steps\nStatus: ${result.success ? 'Success' : 'Failed'}`
                );
            } else if (action === 1) {
                selected.enabled = !selected.enabled;
                saveWorkflow(selected);
                await showWorkflowManager();
            }
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
        "Agent Orchestrator",
        "Choose an action:",
        ["Dashboard", "New Task", "Workflows", "Settings"]
    );
    
    switch (choice) {
        case 0:
            await showAgentDashboard();
            break;
        case 1:
            await createNewTask();
            break;
        case 2:
            await showWorkflowManager();
            break;
        case 3:
            await DevTools.showAlert("Settings", "Settings coming soon!");
            break;
    }
}

// ============================================== WIDGET ============================================== //

/**
 * Create orchestrator widget
 * @returns {ListWidget} Configured widget
 */
function createWidget() {
    const widget = new ListWidget();
    widget.backgroundColor = new Color("#2d2d2d");
    
    // Title
    const title = widget.addText("🎯 Agent Orchestrator");
    title.font = Font.boldSystemFont(14);
    title.textColor = Color.white();
    
    widget.addSpacer(8);
    
    // Stats
    const tasks = getTasks();
    const pendingTasks = tasks.filter(t => t.status === "pending").length;
    const completedTasks = tasks.filter(t => t.status === "completed").length;
    
    const stats = widget.addText(`⏳ ${pendingTasks} pending • ✅ ${completedTasks} completed`);
    stats.font = Font.systemFont(11);
    stats.textColor = new Color("#aaaaaa");
    
    widget.addSpacer(12);
    
    // Active agents
    const agentsText = widget.addText(`${Object.keys(AVAILABLE_AGENTS).length} agents available`);
    agentsText.font = Font.systemFont(10);
    agentsText.textColor = new Color("#888888");
    
    return widget;
}

// ============================================== MAIN ============================================== //

async function main() {
    initialize();
    
    if (config.runsInWidget) {
        const widget = createWidget();
        Script.setWidget(widget);
        Script.complete();
        return;
    }
    
    await showMainMenu();
}

await main();
