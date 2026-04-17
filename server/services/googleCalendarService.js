const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const TOKEN_PATH = path.join(__dirname, '../tokens.json');

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const getAuthUrl = () => {
    const scopes = ['https://www.googleapis.com/auth/calendar'];
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
};

const saveTokens = async (code) => {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    return tokens;
};

const loadTokens = () => {
    if (fs.existsSync(TOKEN_PATH)) {
        const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
        oauth2Client.setCredentials(tokens);
        return true;
    }
    return false;
};

const addEvent = async (assignment) => {
    try {
        if (!loadTokens()) {
            console.warn('Google Calendar Tokens not found. Skipping sync.');
            return null;
        }

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        
        const event = {
            summary: `StudyFlow: ${assignment.title}`,
            description: `[Academic Load: ${assignment.estimatedHours || 0}h]\nPriority: ${assignment.priority}`,
            start: {
                date: new Date(assignment.deadline).toISOString().split('T')[0],
            },
            end: {
                date: new Date(assignment.deadline).toISOString().split('T')[0],
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        return response.data.id; // Return the ID for persistence
    } catch (error) {
        console.error('Google Calendar Add Event Error:', error.message);
        return null;
    }
};

const updateEvent = async (assignment) => {
    try {
        if (!loadTokens() || !assignment.googleEventId) return null;

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        
        const event = {
            summary: `${assignment.status === 'completed' ? '[DONE] ' : ''}StudyFlow: ${assignment.title}`,
            description: `[Academic Load: ${assignment.estimatedHours || 0}h]\nPriority: ${assignment.priority}\nStatus: ${assignment.status}`,
            start: {
                date: new Date(assignment.deadline).toISOString().split('T')[0],
            },
            end: {
                date: new Date(assignment.deadline).toISOString().split('T')[0],
            },
        };

        const response = await calendar.events.patch({
            calendarId: 'primary',
            eventId: assignment.googleEventId,
            resource: event,
        });

        return response.data;
    } catch (error) {
        console.error('Google Calendar Update Event Error:', error.message);
        return null;
    }
};

const deleteEvent = async (googleEventId) => {
    try {
        if (!loadTokens() || !googleEventId) return null;

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: googleEventId,
        });

        return true;
    } catch (error) {
        console.error('Google Calendar Delete Event Error:', error.message);
        return false;
    }
};

module.exports = {
    getAuthUrl,
    saveTokens,
    addEvent,
    updateEvent,
    deleteEvent
};
