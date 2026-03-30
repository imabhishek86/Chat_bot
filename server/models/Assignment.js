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
<<<<<<< HEAD
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    userId: {


=======
    priority: {
        type: String,
        enum: {
            values: ['High', 'Medium', 'Low'],
            message: 'Priority must be High, Medium, or Low'
        },
        default: 'Medium'
    },
    userId: {
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to a User model if implemented later
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

<<<<<<< HEAD
AssignmentSchema.pre('save', function() {
=======
AssignmentSchema.pre('save', function(next) {
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
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
<<<<<<< HEAD
});


=======
    next();
});

>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
module.exports = mongoose.model('Assignment', AssignmentSchema);
