const nodemailer= require('nodemailer');
const dotenv= require('dotenv');

// Load environment variables
dotenv.config();

// Create a transporter object
exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your email address from environment variable
        pass: process.env.EMAIL_PASS,  // Your email app password from environment variable
    },
});


