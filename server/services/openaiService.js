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


module.exports = {
    extractAssignmentWithAI,
    generateMotivationalMessage,
    generateTaskSuggestion
};

