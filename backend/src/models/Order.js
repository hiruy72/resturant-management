const { pool } = require('../config/db');

class Order {
  static async create(orderData) {
    const { user_id, total_amount, status = 'pending', delivery_address, phone } = orderData;
    const query = `
      INSERT INTO orders (user_id, total_amount, status, delivery_address, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [user_id, total_amount, status, delivery_address, phone];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `;
    //send queries
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async addOrderItem(orderItemData) {
    const { order_id, menu_item_id, quantity, price } = orderItemData;
    const query = `
      INSERT INTO order_items (order_id, menu_item_id, quantity, price)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [order_id, menu_item_id, quantity, price];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getOrderItems(orderId) {
    const query = `
      SELECT oi.*, mi.name as item_name, mi.description as item_description
      FROM order_items oi
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = $1
    `;
    const result = await pool.query(query, [orderId]);
    return result.rows;
  }

  static async deleteById(id) {
    const query = 'DELETE FROM orders WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Order;
