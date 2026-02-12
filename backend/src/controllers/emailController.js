const nodemailer = require('nodemailer');

exports.sendContactEmail = async (req, res) => {
    const { name, date, time, guests } = req.body;

    // Create a transporter
    // NOTE: For Gmail, you need to use an App Password if 2FA is enabled.
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,       // Sending to self/admin for now
        subject: `New Reservation Request from ${name}`,
        text: `
            New Reservation Details:
            
            Name: ${name}
            Date: ${date}
            Time: ${time}
            Guests: ${guests}
            
            Please contact the customer to confirm.
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        // If credentials are not set, sending will fail. 
        // We catch this to prevent crashing, but return 500.
        res.status(500).json({ message: 'Failed to send email', error: error.message });
    }
};
