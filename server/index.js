require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const statsRoutes = require('./routes/statsRoutes');
const assignmentController = require('./controllers/assignmentController');
const calendarRoutes = require('./routes/calendarRoutes');
const plannerRoutes = require('./routes/plannerRoutes');
const riskRoutes = require('./routes/riskRoutes');
const breakdownRoutes = require('./routes/breakdownRoutes');
const optimizerRoutes = require('./routes/optimizerRoutes');
const reportRoutes = require('./routes/reportRoutes');
const automationService = require('./services/automationService');
const reminderService = require('./services/reminderService');

const app = express();
// ... (middleware and connection)

// Initialize Services
reminderService.initReminders();
automationService.initAutomation();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studyflow')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.warn('⚠️ WARNING: Server is running in UNCONNECTED mode. Database features will be unavailable.');
    });

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/breakdown', breakdownRoutes);
app.use('/api/optimizer', optimizerRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/suggestions', assignmentController.getAISuggestion);


app.get('/api/status', (req, res) => {
    res.json({ status: 'active', message: 'StudyFlow Backend is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
