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
            description: assignment.description || 'Deadline tracked by StudyFlow',
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

        return response.data;
    } catch (error) {
        console.error('Google Calendar Add Event Error:', error.message);
        return null;
    }
};

module.exports = {
    getAuthUrl,
    saveTokens,
    addEvent
};
