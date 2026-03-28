const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends an email reminder for an assignment.
 * @param {Object} assignment - The assignment object
 */
const sendReminder = async (assignment) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Sending to self for now, or use assignment.userEmail if available
            subject: `🚨 Reminder: ${assignment.title} is due soon!`,
            text: `Your assignment "${assignment.title}" is due on ${new Date(assignment.deadline).toLocaleString()}`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent: ${info.response}`);
    } catch (error) {
        console.error('❌ Email Service Error:', error);
    }
};

module.exports = { sendReminder };
