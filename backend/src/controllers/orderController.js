const Order = require('../models/Order');
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

exports.placeOrder = async (req, res) => {
    try {
        const { items, totalPrice, delivery_address, phone } = req.body;
        
        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            return sendJSON(res, 400, { message: 'Items are required and must be a non-empty array' });
        }
        
        if (!totalPrice || totalPrice <= 0) {
            return sendJSON(res, 400, { message: 'Total price is required and must be greater than 0' });
        }
        
        if (!delivery_address || !delivery_address.trim()) {
            return sendJSON(res, 400, { message: 'Delivery address is required' });
        }
        
        if (!phone || !phone.trim()) {
            return sendJSON(res, 400, { message: 'Phone number is required' });
        }

        console.log('Creating order for user:', req.user.id);
        console.log('Order data:', { items, totalPrice, delivery_address, phone });
        
        const order = await Order.create({
            user_id: req.user.id,
            total_amount: totalPrice,
            delivery_address,
            phone
        });

        console.log('Order created:', order);

        // Add order items
        for (const item of items) {
            if (!item.menu_item_id || !item.quantity || !item.price) {
                return sendJSON(res, 400, { 
                    message: 'Each item must have menu_item_id, quantity, and price' 
                });
            }
            
            await Order.addOrderItem({
                order_id: order.id,
                menu_item_id: item.menu_item_id,
                quantity: item.quantity,
                price: item.price
            });
        }

        console.log('Order items added successfully');
        sendJSON(res, 201, order);
    } catch (error) {
        console.error('Order placement error:', error);
        sendJSON(res, 500, { 
            message: 'Server Error', 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.findByUserId(req.user.id);
        
        // Get order items for each order
        for (let order of orders) {
            order.items = await Order.getOrderItems(order.id);
        }
        
        sendJSON(res, 200, orders);
    } catch (error) {
        console.error(error);
        sendJSON(res, 500, { message: 'Server Error' });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        
        // Get order items for each order
        for (let order of orders) {
            order.items = await Order.getOrderItems(order.id);
        }
        
        sendJSON(res, 200, orders);
    } catch (error) {
        console.error(error);
        sendJSON(res, 500, { message: 'Server Error' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return sendJSON(res, 404, { message: 'Order not found' });
        }

        const updatedOrder = await Order.updateStatus(req.params.id, status);

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
            to: order.user_email,
            subject: `Order Status Update: ${status}`,
            text: `
                Hello ${order.user_name},

                Your order status has been updated to: ${status}.
                
                Total Price: ${order.total_amount}
                
                Thank you for ordering with us!
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Order status email sent');
        } catch (emailError) {
            console.error('Failed to send status email:', emailError);
        }

        sendJSON(res, 200, updatedOrder);
    } catch (error) {
        console.error(error);
        sendJSON(res, 500, { message: 'Server Error' });
    }
};