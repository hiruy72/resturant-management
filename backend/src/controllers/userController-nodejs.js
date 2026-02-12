const User = require('../models/User');

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

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return sendJSON(res, 404, { message: 'User not found' });
        }
        
        // Remove password from response
        const { password, ...userProfile } = user;
        sendJSON(res, 200, userProfile);
    } catch (error) {
        console.error(error);
        sendJSON(res, 500, { message: 'Server Error' });
    }
};