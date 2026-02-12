const MenuItem = require('../models/menuItem');

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

exports.createItem = async (req, res) => {
    try {
        const item = await MenuItem.create(req.body);
        sendJSON(res, 201, item);
    } catch (error) {
        console.error(error);
        sendJSON(res, 500, { message: 'Server Error' });
    }
};

exports.getMenu = async (req, res) => {
    try {
        const menu = await MenuItem.findAll();
        sendJSON(res, 200, menu);
    } catch (error) {
        console.error(error);
        sendJSON(res, 500, { message: 'Server Error' });
    }
};

exports.getPublicMenu = async (req, res) => {
    try {
        const menu = await MenuItem.findAll();
        // Filter for available items for public menu
        const availableMenu = menu.filter(item => item.available);
        sendJSON(res, 200, availableMenu);
    } catch (error) {
        console.error(error);
        sendJSON(res, 500, { message: 'Server Error' });
    }
};

exports.updateItem = async (req, res) => {
    try {
        const item = await MenuItem.updateById(req.params.id, req.body);
        if (!item) {
            return sendJSON(res, 404, { message: 'Item not found' });
        }
        sendJSON(res, 200, item);
    } catch (error) {
        console.error(error);
        sendJSON(res, 500, { message: 'Server Error' });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const item = await MenuItem.deleteById(req.params.id);
        if (!item) {
            return sendJSON(res, 404, { message: 'Item not found' });
        }
        sendJSON(res, 200, { message: 'Item deleted' });
    } catch (error) {
        console.error(error);
        sendJSON(res, 500, { message: 'Server Error' });
    }
};