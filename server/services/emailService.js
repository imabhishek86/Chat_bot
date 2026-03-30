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
<<<<<<< HEAD
const sendReminder = async (assignment, customMessage = null) => {
    try {
        const defaultMessage = `Your assignment "${assignment.title}" is due soon (${new Date(assignment.deadline).toLocaleString()}). You've got this!`;
        const messageBody = customMessage || defaultMessage;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Sending to self for demo
            subject: `🚀 StudyFlow: Smart Alert for ${assignment.title}`,
            text: messageBody
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {

=======
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
>>>>>>> 3dd829c3d0d072bd55ec48ca1d184a87e642a64f
        console.error('❌ Email Service Error:', error);
    }
};

module.exports = { sendReminder };
