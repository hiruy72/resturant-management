const Reservation = require('../models/Reservation');
const nodemailer = require('nodemailer');

// Helper function to send JSON response
const sendJSON = (res, statusCode, data) => {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end(JSON.stringify(data));
};

// Reuse email logic or import a helper, but for now specific to reservation
const sendReservationEmail = async (reservation) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Admin
            subject: `New Reservation: ${reservation.name}`,
            text: `
                New Reservation Details:
                Name: ${reservation.name}
                Date: ${reservation.date}
                Time: ${reservation.time}
                Guests: ${reservation.guests}
                Special Request: ${reservation.special_requests || 'None'}
                User ID: ${reservation.user_id}
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Reservation email sent');
    } catch (error) {
        console.error('Email sending failed:', error);
        // Don't throw, just log
    }
};

exports.createReservation = async (req, res) => {
    try {
        const { name, email, phone, date, time, guests, special_requests } = req.body;

        // Validate required fields
        if (!name || !name.trim()) {
            return sendJSON(res, 400, { message: 'Name is required' });
        }
        
        if (!email || !email.trim()) {
            return sendJSON(res, 400, { message: 'Email is required' });
        }
        
        if (!phone || !phone.trim()) {
            return sendJSON(res, 400, { message: 'Phone number is required' });
        }
        
        if (!date) {
            return sendJSON(res, 400, { message: 'Date is required' });
        }
        
        if (!time) {
            return sendJSON(res, 400, { message: 'Time is required' });
        }
        
        if (!guests || guests < 1) {
            return sendJSON(res, 400, { message: 'Number of guests must be at least 1' });
        }

        // Validate date is not in the past
        const reservationDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (reservationDate < today) {
            return sendJSON(res, 400, { message: 'Reservation date cannot be in the past' });
        }

        console.log('Creating reservation for user:', req.user.id);
        console.log('Reservation data:', { name, email, phone, date, time, guests, special_requests });

        const reservation = await Reservation.create({
            user_id: req.user.id,
            name,
            email,
            phone,
            date,
            time,
            guests,
            special_requests
        });

        console.log('Reservation created:', reservation);

        // Send email asynchronously
        sendReservationEmail(reservation);

        sendJSON(res, 201, reservation);
    } catch (error) {
        console.error('Reservation creation error:', error);
        sendJSON(res, 500, { 
            message: 'Server Error', 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
};

exports.getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findByUserId(req.user.id);
        sendJSON(res, 200, reservations);
    } catch (error) {
        console.error(error);
        sendJSON(res, 500, { message: 'Server Error' });
    }
};

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.findAll();
        sendJSON(res, 200, reservations);
    } catch (error) {
        console.error(error);
        sendJSON(res, 500, { message: 'Server Error' });
    }
};

exports.updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return sendJSON(res, 404, { message: 'Reservation not found' });
        }

        const updatedReservation = await Reservation.updateStatus(req.params.id, status);

        // Send email notification to user
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: reservation.email,
            subject: `Reservation Status Update: ${status}`,
            text: `
                Hello ${reservation.name},

                Your reservation status has been updated to: ${status}.
                
                Details:
                Date: ${reservation.date}
                Time: ${reservation.time}
                
                Thank you for choosing us!
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Status update email sent to user');
        } catch (emailError) {
            console.error('Failed to send status email:', emailError);
        }

        sendJSON(res, 200, updatedReservation);
    } catch (error) {
        console.error(error);
        sendJSON(res, 500, { message: 'Server Error' });
    }
};