/*------------------------------------------------------------------------------------------------------
Script: ai-utils.js
Author: AI Features Library
Description: AI-powered utilities for intelligent automation in Scriptable
Version: 1.0.0
-----------------------------------------------------------------------------------------------------*/

/**
 * AI Service Configuration
 * Configure API keys and settings for different AI services
 */
const AI_CONFIG = {
    openai: {
        apiKey: "", // Set your OpenAI API key here
        baseURL: "https://api.openai.com/v1",
        defaultModel: "gpt-4o-mini",
        defaultMaxTokens: 1000
    },
    claude: {
        apiKey: "", // Set your Anthropic API key here
        baseURL: "https://api.anthropic.com/v1",
        defaultModel: "claude-3-5-sonnet-20241022",
        defaultMaxTokens: 1000,
        version: "2023-06-01"
    }
};

/**
 * Generic AI Service Wrapper
 * Provides a unified interface for different AI services
 */
class AIService {
    constructor(provider = "openai", apiKey = null) {
        this.provider = provider;
        this.config = AI_CONFIG[provider];
        
        if (apiKey) {
            this.config.apiKey = apiKey;
        }
        
        if (!this.config.apiKey) {
            console.warn(`Warning: API key not set for ${provider}. Please configure it in AI_CONFIG or pass it to the constructor.`);
        }
    }
    
    /**
     * Send a chat completion request
     * @param {string} prompt - The user prompt
     * @param {Object} options - Additional options (model, maxTokens, temperature, systemPrompt)
     * @returns {Promise<string>} AI response text
     */
    async chat(prompt, options = {}) {
        if (!this.config.apiKey) {
            throw new Error(`API key not configured for ${this.provider}`);
        }
        
        const model = options.model || this.config.defaultModel;
        const maxTokens = options.maxTokens || this.config.defaultMaxTokens;
        const temperature = options.temperature || 0.7;
        const systemPrompt = options.systemPrompt || null;
        
        if (this.provider === "openai") {
            return await this._chatOpenAI(prompt, model, maxTokens, temperature, systemPrompt);
        } else if (this.provider === "claude") {
            return await this._chatClaude(prompt, model, maxTokens, temperature, systemPrompt);
        } else {
            throw new Error(`Unsupported provider: ${this.provider}`);
        }
    }
    
    /**
     * OpenAI chat completion
     */
    async _chatOpenAI(prompt, model, maxTokens, temperature, systemPrompt) {
        const messages = [];
        
        if (systemPrompt) {
            messages.push({
                role: "system",
                content: systemPrompt
            });
        }
        
        messages.push({
            role: "user",
            content: prompt
        });
        
        const request = new Request(`${this.config.baseURL}/chat/completions`);
        request.method = "POST";
        request.headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.config.apiKey}`
        };
        request.body = JSON.stringify({
            model: model,
            messages: messages,
            max_tokens: maxTokens,
            temperature: temperature
        });
        
        const response = await request.loadJSON();
        
        if (response.error) {
            throw new Error(`OpenAI API Error: ${response.error.message}`);
        }
        
        return response.choices[0].message.content;
    }
    
    /**
     * Claude chat completion
     */
    async _chatClaude(prompt, model, maxTokens, temperature, systemPrompt) {
        const request = new Request(`${this.config.baseURL}/messages`);
        request.method = "POST";
        request.headers = {
            "Content-Type": "application/json",
            "x-api-key": this.config.apiKey,
            "anthropic-version": this.config.version
        };
        
        const body = {
            model: model,
            max_tokens: maxTokens,
            temperature: temperature,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        };
        
        if (systemPrompt) {
            body.system = systemPrompt;
        }
        
        request.body = JSON.stringify(body);
        
        const response = await request.loadJSON();
        
        if (response.error) {
            throw new Error(`Claude API Error: ${response.error.message}`);
        }
        
        return response.content[0].text;
    }
    
    /**
     * Analyze an image with AI
     * @param {Image} image - Image object to analyze
     * @param {string} prompt - Question or instruction about the image
     * @param {Object} options - Additional options
     * @returns {Promise<string>} AI analysis result
     */
    async analyzeImage(image, prompt, options = {}) {
        if (this.provider !== "openai") {
            throw new Error("Image analysis is currently only supported with OpenAI");
        }
        
        if (!this.config.apiKey) {
            throw new Error("API key not configured");
        }
        
        const model = options.model || "gpt-4o-mini";
        const maxTokens = options.maxTokens || 500;
        
        // Convert image to base64
        const base64Image = Data.fromPNG(image).toBase64String();
        
        const request = new Request(`${this.config.baseURL}/chat/completions`);
        request.method = "POST";
        request.headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.config.apiKey}`
        };
        request.body = JSON.stringify({
            model: model,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/png;base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: maxTokens
        });
        
        const response = await request.loadJSON();
        
        if (response.error) {
            throw new Error(`OpenAI API Error: ${response.error.message}`);
        }
        
        return response.choices[0].message.content;
    }
}

/**
 * AI-powered text utilities
 */
class AITextUtils {
    constructor(aiService) {
        this.ai = aiService;
    }
    
    /**
     * Summarize long text
     * @param {string} text - Text to summarize
     * @param {number} maxLength - Maximum summary length in words
     * @returns {Promise<string>} Summary
     */
    async summarize(text, maxLength = 100) {
        const prompt = `Summarize the following text in ${maxLength} words or less:\n\n${text}`;
        return await this.ai.chat(prompt, {
            systemPrompt: "You are a helpful assistant that creates concise, accurate summaries."
        });
    }
    
    /**
     * Generate smart suggestions based on context
     * @param {string} context - Context for suggestions
     * @param {number} count - Number of suggestions to generate
     * @returns {Promise<Array<string>>} Array of suggestions
     */
    async generateSuggestions(context, count = 5) {
        const prompt = `Based on this context: "${context}"\n\nGenerate ${count} helpful suggestions or action items. Return only the suggestions, one per line.`;
        const response = await this.ai.chat(prompt);
        return response.split('\n').filter(s => s.trim()).slice(0, count);
    }
    
    /**
     * Improve or rewrite text
     * @param {string} text - Original text
     * @param {string} style - Target style (formal, casual, concise, detailed)
     * @returns {Promise<string>} Improved text
     */
    async improveText(text, style = "concise") {
        const prompt = `Rewrite the following text to be more ${style}:\n\n${text}`;
        return await this.ai.chat(prompt);
    }
    
    /**
     * Extract key information from text
     * @param {string} text - Text to analyze
     * @param {Array<string>} fields - Fields to extract (e.g., ["date", "location", "person"])
     * @returns {Promise<Object>} Extracted information
     */
    async extractInfo(text, fields) {
        const prompt = `Extract the following information from this text: ${fields.join(', ')}\n\nText: ${text}\n\nReturn the result as JSON with keys: ${fields.join(', ')}`;
        const response = await this.ai.chat(prompt, {
            systemPrompt: "You extract information and return valid JSON only, no other text."
        });
        
        try {
            // Try to parse JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(response);
        } catch (e) {
            console.error("Failed to parse AI response as JSON:", e);
            return { raw: response };
        }
    }
    
    /**
     * Sentiment analysis
     * @param {string} text - Text to analyze
     * @returns {Promise<Object>} Sentiment result with score and label
     */
    async analyzeSentiment(text) {
        const prompt = `Analyze the sentiment of this text and respond with a JSON object containing "score" (number from -1 to 1, where -1 is very negative and 1 is very positive) and "label" (positive/negative/neutral):\n\n${text}`;
        const response = await this.ai.chat(prompt, {
            systemPrompt: "You analyze sentiment and return valid JSON only."
        });
        
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(response);
        } catch (e) {
            return { score: 0, label: "neutral", raw: response };
        }
    }
    
    /**
     * Generate creative content
     * @param {string} topic - Topic or theme
     * @param {string} type - Type of content (quote, joke, fact, story)
     * @returns {Promise<string>} Generated content
     */
    async generateContent(topic, type = "quote") {
        const prompts = {
            quote: `Generate an inspiring quote about ${topic}.`,
            joke: `Generate a funny, family-friendly joke about ${topic}.`,
            fact: `Share an interesting fact about ${topic}.`,
            story: `Write a short, engaging story (2-3 sentences) about ${topic}.`
        };
        
        const prompt = prompts[type] || prompts.quote;
        return await this.ai.chat(prompt);
    }
}

/**
 * Smart automation helpers
 */
class AIAutomation {
    constructor(aiService) {
        this.ai = aiService;
    }
    
    /**
     * Smart notification content generator
     * @param {Object} context - Context information (weather, events, etc.)
     * @returns {Promise<Object>} Notification title and body
     */
    async generateSmartNotification(context) {
        const contextStr = JSON.stringify(context);
        const prompt = `Based on this context: ${contextStr}\n\nGenerate a helpful notification. Return JSON with "title" and "body" fields.`;
        
        const response = await this.ai.chat(prompt, {
            systemPrompt: "You generate concise, helpful notifications in JSON format.",
            maxTokens: 200
        });
        
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(response);
        } catch (e) {
            return {
                title: "Smart Notification",
                body: response.substring(0, 100)
            };
        }
    }
    
    /**
     * Natural language to task parser
     * @param {string} naturalLanguage - Natural language description of a task
     * @returns {Promise<Object>} Structured task object
     */
    async parseTask(naturalLanguage) {
        const prompt = `Parse this task description into a structured format: "${naturalLanguage}"\n\nReturn JSON with: title, dueDate (ISO format or null), priority (high/medium/low), category, and notes.`;
        
        const response = await this.ai.chat(prompt, {
            systemPrompt: "You parse natural language into structured task data as JSON."
        });
        
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(response);
        } catch (e) {
            return {
                title: naturalLanguage,
                dueDate: null,
                priority: "medium",
                category: "general",
                notes: ""
            };
        }
    }
    
    /**
     * Smart response suggestions
     * @param {string} message - Incoming message
     * @param {string} context - Additional context
     * @returns {Promise<Array<string>>} Suggested responses
     */
    async suggestResponses(message, context = "") {
        const contextPart = context ? `\nContext: ${context}` : "";
        const prompt = `Generate 3 appropriate response suggestions to this message: "${message}"${contextPart}\n\nReturn only the responses, one per line.`;
        
        const response = await this.ai.chat(prompt, {
            systemPrompt: "You suggest helpful, appropriate message responses."
        });
        
        return response.split('\n').filter(s => s.trim()).slice(0, 3);
    }
}

// Export functions and classes
module.exports = {
    AI_CONFIG,
    AIService,
    AITextUtils,
    AIAutomation
};
