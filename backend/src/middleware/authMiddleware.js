const jwt = require('jsonwebtoken');

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

exports.protect = (req, res, next) => {
    let token = req.headers.authorization;

    if(!token || !token.startsWith('Bearer')) {
         return sendJSON(res, 401, { message: 'Not authorized' });
    }

    token = token.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        sendJSON(res, 401, { message: 'Token invalid' });
    }
};

exports.adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return sendJSON(res, 403, { message: 'Admin access only' });
    }
    next();
};