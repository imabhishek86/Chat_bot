require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const chatRoutes = require('./routes/chatRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const reminderService = require('./services/reminderService');

const app = express();
// ... (middleware and connection)

// Initialize Services
reminderService.initReminders();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studyflow')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/assignments', assignmentRoutes);


app.get('/api/status', (req, res) => {
    res.json({ status: 'active', message: 'StudyFlow Backend is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
