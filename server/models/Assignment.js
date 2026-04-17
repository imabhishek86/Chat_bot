const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Assignment title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    deadline: {
        type: Date,
        required: [true, 'Deadline is required']
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'missed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    userId: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to a User model if implemented later
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    estimatedHours: {
        type: Number,
        default: 0
    },
    googleEventId: {
        type: String,
        required: false
    }
});

AssignmentSchema.pre('save', function() {
    if (this.isModified('deadline') || this.isNew) {
        const now = new Date();
        const diffDays = (this.deadline - now) / (1000 * 60 * 60 * 24);
        
        if (diffDays <= 2) {
            this.priority = 'High';
        } else if (diffDays <= 5) {
            this.priority = 'Medium';
        } else {
            this.priority = 'Low';
        }
    }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
