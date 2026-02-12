const http = require('http');
const url = require('url');
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const { connectDB } = require('./src/config/db');

// Import controllers
const authController = require('./src/controllers/authController');
const orderController = require('./src/controllers/orderController');
const reservationController = require('./src/controllers/reservationController');
const menuController = require('./src/controllers/menuController');
const userController = require('./src/controllers/userController');

// Import middleware
const { protect, adminOnly } = require('./src/middleware/authMiddleware');

// Connect to database
connectDB();

// Helper function to parse JSON body
const parseBody = (req) => {
    return new Promise((resolve, reject) => {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                if (body) {
                    resolve(JSON.parse(body));
                } else {
                    resolve({});
                }
            } catch (error) {
                reject(error);
            }
        });
        
        req.on('error', (error) => {
            reject(error);
        });
    });
};

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

// Helper function to handle CORS preflight
const handleCORS = (res) => {
    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
};

// Route handler
const handleRequest = async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    
    console.log(`${method} ${path}`);
    
    // Handle CORS preflight requests
    if (method === 'OPTIONS') {
        handleCORS(res);
        return;
    }
    
    try {
        // Parse request body for POST/PUT requests
        if (method === 'POST' || method === 'PUT') {
            req.body = await parseBody(req);
        }
        
        // Add query parameters
        req.query = parsedUrl.query;
        
        // Route matching
        if (path.startsWith('/api/auth')) {
            await handleAuthRoutes(req, res, path, method);
        } else if (path.startsWith('/api/orders')) {
            await handleOrderRoutes(req, res, path, method);
        } else if (path.startsWith('/api/reservations')) {
            await handleReservationRoutes(req, res, path, method);
        } else if (path.startsWith('/api/menu')) {
            await handleMenuRoutes(req, res, path, method);
        } else if (path.startsWith('/api/users')) {
            await handleUserRoutes(req, res, path, method);
        } else {
            sendJSON(res, 404, { message: 'Route not found' });
        }
        
    } catch (error) {
        console.error('Server error:', error);
        sendJSON(res, 500, { message: 'Internal server error' });
    }
};

// Auth routes handler
const handleAuthRoutes = async (req, res, path, method) => {
    if (path === '/api/auth/register' && method === 'POST') {
        await authController.register(req, res);
    } else if (path === '/api/auth/login' && method === 'POST') {
        await authController.login(req, res);
    } else {
        sendJSON(res, 404, { message: 'Auth route not found' });
    }
};

// Order routes handler
const handleOrderRoutes = async (req, res, path, method) => {
    // Apply authentication middleware
    const authResult = await applyMiddleware(req, res, protect);
    if (!authResult) return; // Authentication failed
    
    if (path === '/api/orders' && method === 'POST') {
        await orderController.placeOrder(req, res);
    } else if (path === '/api/orders' && method === 'GET') {
        await orderController.getMyOrders(req, res);
    } else if (path === '/api/orders/all' && method === 'GET') {
        const adminResult = await applyMiddleware(req, res, adminOnly);
        if (!adminResult) return;
        await orderController.getAllOrders(req, res);
    } else if (path.match(/^\/api\/orders\/\d+$/) && method === 'PUT') {
        const adminResult = await applyMiddleware(req, res, adminOnly);
        if (!adminResult) return;
        // Extract ID from path
        req.params = { id: path.split('/').pop() };
        await orderController.updateOrderStatus(req, res);
    } else {
        sendJSON(res, 404, { message: 'Order route not found' });
    }
};

// Reservation routes handler
const handleReservationRoutes = async (req, res, path, method) => {
    // Apply authentication middleware
    const authResult = await applyMiddleware(req, res, protect);
    if (!authResult) return;
    
    if (path === '/api/reservations' && method === 'POST') {
        await reservationController.createReservation(req, res);
    } else if (path === '/api/reservations' && method === 'GET') {
        await reservationController.getMyReservations(req, res);
    } else if (path === '/api/reservations/all' && method === 'GET') {
        const adminResult = await applyMiddleware(req, res, adminOnly);
        if (!adminResult) return;
        await reservationController.getAllReservations(req, res);
    } else if (path.match(/^\/api\/reservations\/\d+$/) && method === 'PUT') {
        const adminResult = await applyMiddleware(req, res, adminOnly);
        if (!adminResult) return;
        req.params = { id: path.split('/').pop() };
        await reservationController.updateReservationStatus(req, res);
    } else {
        sendJSON(res, 404, { message: 'Reservation route not found' });
    }
};

// Menu routes handler
const handleMenuRoutes = async (req, res, path, method) => {
    if (path === '/api/menu' && method === 'GET') {
        // Check if user is admin to show all items, otherwise show only available
        const authHeader = req.headers.authorization;
        let isAdmin = false;
        
        if (authHeader && authHeader.startsWith('Bearer')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                isAdmin = decoded.role === 'admin';
            } catch (error) {
                // Not authenticated or invalid token, show public menu
            }
        }
        
        if (isAdmin) {
            await menuController.getMenu(req, res); // All items for admin
        } else {
            await menuController.getPublicMenu(req, res); // Only available items for public
        }
    } else if (path === '/api/menu' && method === 'POST') {
        const authResult = await applyMiddleware(req, res, protect);
        if (!authResult) return;
        const adminResult = await applyMiddleware(req, res, adminOnly);
        if (!adminResult) return;
        await menuController.createItem(req, res);
    } else if (path.match(/^\/api\/menu\/\d+$/) && method === 'PUT') {
        const authResult = await applyMiddleware(req, res, protect);
        if (!authResult) return;
        const adminResult = await applyMiddleware(req, res, adminOnly);
        if (!adminResult) return;
        req.params = { id: path.split('/').pop() };
        await menuController.updateItem(req, res);
    } else if (path.match(/^\/api\/menu\/\d+$/) && method === 'DELETE') {
        const authResult = await applyMiddleware(req, res, protect);
        if (!authResult) return;
        const adminResult = await applyMiddleware(req, res, adminOnly);
        if (!adminResult) return;
        req.params = { id: path.split('/').pop() };
        await menuController.deleteItem(req, res);
    } else {
        sendJSON(res, 404, { message: 'Menu route not found' });
    }
};

// User routes handler
const handleUserRoutes = async (req, res, path, method) => {
    const authResult = await applyMiddleware(req, res, protect);
    if (!authResult) return;
    
    if (path === '/api/users/profile' && method === 'GET') {
        await userController.getProfile(req, res);
    } else {
        sendJSON(res, 404, { message: 'User route not found' });
    }
};

// Middleware application helper
const applyMiddleware = async (req, res, middleware) => {
    return new Promise((resolve) => {
        const next = () => resolve(true);
        
        // Override res.status and res.json for middleware compatibility
        res.status = (code) => {
            res.statusCode = code;
            return res;
        };
        
        res.json = (data) => {
            sendJSON(res, res.statusCode || 200, data);
            resolve(false); // Middleware sent response
        };
        
        try {
            middleware(req, res, next);
        } catch (error) {
            console.error('Middleware error:', error);
            sendJSON(res, 500, { message: 'Middleware error' });
            resolve(false);
        }
    });
};

// Create HTTP server
const server = http.createServer(handleRequest);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Pure Node.js server running on port ${PORT}`);
    console.log('No Express.js - using only Node.js built-in modules!');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});