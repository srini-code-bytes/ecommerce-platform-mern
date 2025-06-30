const sgMail = require('@sendgrid/mail');

async function sendEmail(email, otp) {
    try {
        // Set SendGrid API Key
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        // Email options
        const msg = {
            to: email, // Recipient address
            from: process.env.SENDGRID_EMAIL, // Sender address (must be verified in SendGrid)
            subject: 'Your E-mart OTP Code', // Email subject
            text: `Your OTP is ${otp}`, // Plain text body
            html: `<p>Your OTP is: <strong>${otp}</strong>. It expires in 5 minutes.</p>`, // HTML body
        };

        // Send the email
        const response = await sgMail.send(msg);
        console.log(`OTP Email sent: ${response[0].statusCode}`);
        return response;
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
        throw error;
    }
}

module.exports = sendEmail;
