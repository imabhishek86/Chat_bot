const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Extracts assignment details from a natural language message using OpenAI.
 * Expected Output: { title: "Name", deadline: "YYYY-MM-DD" }
 */
const extractAssignmentWithAI = async (message) => {
    try {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your_openai_api_key')) {
            throw new Error('OpenAI API Key not configured');
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are an academic assistant. Extract the assignment title and deadline (YYYY-MM-DD). 
                    Return STRICTLY JSON. 
                    Format: { "title": "string", "deadline": "YYYY-MM-DD" }
                    Current date: ${new Date().toISOString().split('T')[0]}`
                },
                {
                    role: "user",
                    content: message
                }
            ],
            response_format: { type: "json_object" }
        });

        const rawContent = response.choices[0].message.content;
        
        try {
            const parsed = JSON.parse(rawContent);
            
            if (!parsed.title || !parsed.deadline) {
                console.warn('AI JSON missing required fields:', parsed);
                return null;
            }

            return {
                title: String(parsed.title),
                deadline: String(parsed.deadline) // Should be YYYY-MM-DD
            };
        } catch (parseError) {
            console.error('AI JSON Parsing Failed:', parseError.message);
            return null;
        }
        
    } catch (error) {
        console.error('OpenAI API Error:', error.message);
        return null;
    }
};


/**
 * Generates a short, motivational reminder message for an assignment.
 * Helps reduce student stress and increase engagement.
 */
const generateMotivationalMessage = async (assignment) => {
    try {
        if (!process.env.OPENAI_API_KEY) return null;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an encouraging academic coach. Write a single, short (max 2 sentences) motivational sentence for a student whose assignment is due tomorrow. Be supportive, slightly charismatic, and focus on progress."
                },
                {
                    role: "user",
                    content: `Assignment: ${assignment.title}. Deadline: ${new Date(assignment.deadline).toDateString()}.`
                }
            ],
            max_tokens: 60
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        return null; // Fallback to generic message in email service
    }
};


const generateTaskSuggestion = async (assignments) => {
    try {
        if (!process.env.OPENAI_API_KEY || assignments.length === 0) return null;

        const taskList = assignments.map(a => 
            `- ${a.title} (Due: ${new Date(a.deadline).toDateString()}, Priority: ${a.priority || 'Medium'})`
        ).join('\n');

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a highly efficient productivity coach. Analyze a student's list of pending assignments and suggest exactly ONE task they should tackle next. Focus on deadlines and priority. Be concise, professional, and slightly motivating (max 3 sentences)."
                },
                {
                    role: "user",
                    content: `Here are my pending assignments:\n${taskList}\n\nWhich one should I do first and why?`
                }
            ],
            max_tokens: 100
        });

        return response.choices[0].message.content.trim();
    } catch (error) {
        console.error('AI Suggestion Error:', error.message);
        return null;
    }
};


const generateCategorizedSuggestion = async (assignments, mode) => {
    try {
        if (!process.env.OPENAI_API_KEY) return null;

        const taskList = assignments.map(a => 
            `- ${a.title} (Due: ${new Date(a.deadline).toDateString()}, Priority: ${a.priority || 'Medium'})`
        ).join('\n');

        let systemPrompt = "You are a direct, professional study assistant. ";
        if (mode === 'URGENT') {
            systemPrompt += "The student has an immediate deadline in < 2 days. Give a sharp, urgent instruction to start the specific most urgent task NOW.";
        } else if (mode === 'WARNING') {
            systemPrompt += "The student has > 5 pending tasks. Warn them about the heavy load and suggest a strategic starting point.";
        } else {
            systemPrompt += "The student is on track. Give one simple, motivational next step for their easiest or nearest task.";
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: assignments.length > 0 
                        ? `Tasks:\n${taskList}\n\nProvide ONE concise suggestion (max 20 words).`
                        : "No tasks. Give a short 5-word motivational boost."
                }
            ],
            max_tokens: 60
        });

        return response.choices[0].message.content.trim().replace(/^"|"$/g, '');
    } catch (error) {
        console.error('Categorized AI Suggestion Error:', error.message);
        return null;
    }
};


/**
 * Generates a 7-day study plan based on assignments
 */
const generateStudyPlan = async (assignments) => {
    try {
        if (!assignments || assignments.length === 0) {
            return {
                plan: [
                    { day: "Monday", tasks: ["Clear! No pending assignments."], focus: "Maintenance" },
                    { day: "Tuesday", tasks: [], focus: "Maintenance" },
                    { day: "Wednesday", tasks: [], focus: "Maintenance" },
                    { day: "Thursday", tasks: [], focus: "Maintenance" },
                    { day: "Friday", tasks: [], focus: "Maintenance" },
                    { day: "Saturday", tasks: [], focus: "Maintenance" },
                    { day: "Sunday", tasks: [], focus: "Rest" }
                ],
                motivation: "You're all caught up! Take some time to relax."
            };
        }

        const taskSummary = assignments.map(a => 
            `- ${a.title} (Deadline: ${new Date(a.deadline).toDateString()}, Priority: ${a.priority})`
        ).join('\n');

        const prompt = `
        You are an expert Academic Success Coach. 
        Given the following assignments, create a strategic 7-day study plan (starting today).
        
        Assignments:
        ${taskSummary}
        
        Rules:
        1. Prioritize tasks with closer deadlines and "High" priority. 
        2. Distribute larger tasks logically.
        3. Include a specific "Focus" area for each day.
        4. Return ONLY a JSON object with this structure:
        {
          "plan": [
            { "day": "Day Name", "tasks": ["Task A", "Task B"], "focus": "Overall focus" }
          ],
          "motivation": "A short motivational quote"
        }
        
        Keep tasks concise and actionable. Ensure the plan covers exactly 7 days.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
            response_format: { type: "json_object" }
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error('Error generating study plan:', error);
        throw error;
    }
};

/**
 * Predicts risk for a set of assignments based on deadlines and total workload.
 */
const predictRisk = async (assignments) => {
    try {
        if (!assignments || assignments.length === 0) return [];

        const taskCtx = assignments.map(a => 
            `- ID: ${a._id || a.id}, Title: ${a.title}, Deadline: ${new Date(a.deadline).toDateString()}, Priority: ${a.priority}`
        ).join('\n');

        const prompt = `
        Analyze this student's pending workload and identify assignments that are "At Risk" of being missed.
        
        Current Date: ${new Date().toDateString()}
        Tasks:
        ${taskCtx}
        
        Risk Rules:
        1. Consider workload density (too many tasks due around the same time).
        2. High priority tasks with < 3 days are high risk.
        3. Medium/Low priority tasks with < 2 days are at risk.
        4. If more than 5 tasks are due in a 2-day window, mark ALL as "at risk".
        
        Return ONLY a JSON array of objects:
        [
          { "id": "task_id_here", "risk": true, "message": "Short warning (max 10 words)" }
        ]
        Include ONLY tasks that ARE at risk.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        return Array.isArray(parsed) ? parsed : (parsed.risks || []);
    } catch (error) {
        console.error('Risk Prediction Error:', error);
        return [];
    }
};

/**
 * Breaks down a complex task into actionable sub-tasks.
 */
const breakDownTask = async (title) => {
    try {
        if (!title) return [];

        const prompt = `
        Break down the following academic task into exactly 5 granular, actionable sub-tasks.
        
        Task: ${title}
        
        Rule:
        - Return ONLY a JSON array of strings.
        - Steps should be logical and chronological.
        - Each step should be max 8 words.
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        const parsed = JSON.parse(response.choices[0].message.content);
        return Array.isArray(parsed) ? parsed : (parsed.steps || parsed.subtasks || []);
    } catch (error) {
        console.error('Task Breakdown Error:', error);
        return [];
    }
};

/**
 * Optimizes deadlines by prioritizing urgent tasks and suggesting delays for low-priority ones.
 */
const optimizeDeadlines = async (assignments) => {
    try {
        if (!assignments || assignments.length === 0) return { optimized: [], focus: [], delay: [], reasoning: "No pending assignments to optimize." };

        const taskCtx = assignments.map(a => 
            `- ID: ${a._id || a.id}, Title: ${a.title}, Deadline: ${new Date(a.deadline).toDateString()}, Priority: ${a.priority}, Status: ${a.status}`
        ).join('\n');

        const prompt = `
        You are an elite productivity strategist. Analyze these assignments and propose an "Optimized Deadline Plan".
        
        Goals:
        1. Identify "Focus Now" tasks (High priority AND deadline < 3 days).
        2. Identify "Safe to Delay" tasks (Low/Medium priority AND deadline > 5 days).
        3. Suggest a specific "Actionable Schedule" that re-orders work to minimize stress.
        
        Current Date: ${new Date().toDateString()}
        Tasks:
        ${taskCtx}
        
        Return STRICTLY a JSON object:
        {
          "focus": ["Task Title A", "Task Title B"],
          "delay": [{"title": "Task Title C", "reason": "Why delay?"}],
          "optimized_plan": [
            {"day": "Day 1-2", "activity": "Specific tasks and goals"},
            {"day": "Day 3-5", "activity": "Future mapping"}
          ],
          "overall_strategy": "A 2-sentence summary of the approach."
        }
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Switched for broader compatibility
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        });

        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.warn('AI Optimization failed, using rule-based fallback:', error.message);
        
        // Rule-based Fallback Logic
        const now = new Date();
        const focus = assignments
            .filter(a => {
                const deadline = new Date(a.deadline);
                const diffDays = (deadline - now) / (1000 * 60 * 60 * 24);
                return diffDays < 3 || a.priority === 'High';
            })
            .map(a => a.title)
            .slice(0, 3);

        const delay = assignments
            .filter(a => {
                const deadline = new Date(a.deadline);
                const diffDays = (deadline - now) / (1000 * 60 * 60 * 24);
                return diffDays > 5 && a.priority === 'Low';
            })
            .map(a => ({
                title: a.title,
                reason: "Longer lead time and lower relative priority allows for strategic deferral."
            }));

        const sorted = [...assignments].sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        const plan = [
            { day: "Next 48h", activity: `Intense focus on: ${focus.join(', ') || 'nearest deadlines'}` },
            { day: "Day 3-7", activity: `Progressive work on remaining tasks: ${sorted.slice(focus.length).map(a => a.title).join(', ') || 'future schedule items'}` }
        ];

        return {
            focus,
            delay,
            optimized_plan: plan,
            overall_strategy: "Prioritizing near-term deadlines while maintaining steady progress on long-term goals. (AI Fallback Active)"
        };
    }
};

module.exports = {
    extractAssignmentWithAI,
    generateMotivationalMessage,
    generateTaskSuggestion,
    generateCategorizedSuggestion,
    generateStudyPlan,
    predictRisk,
    breakDownTask,
    optimizeDeadlines
};

