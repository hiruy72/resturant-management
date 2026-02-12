const { pool } = require('../config/db');

class Reservation {
  static async create(reservationData) {
    const { user_id, name, email, phone, date, time, guests, special_requests, status = 'pending' } = reservationData;
    const query = `
      INSERT INTO reservations (user_id, name, email, phone, date, time, guests, special_requests, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [user_id, name, email, phone, date, time, guests, special_requests, status];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = `
      SELECT r.*, u.name as user_name, u.email as user_email
      FROM reservations r
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.date DESC, r.time DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT r.*, u.name as user_name, u.email as user_email
      FROM reservations r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT r.*, u.name as user_name, u.email as user_email
      FROM reservations r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.user_id = $1
      ORDER BY r.date DESC, r.time DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE reservations 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    return result.rows[0];
  }

  static async updateById(id, reservationData) {
    const { name, email, phone, date, time, guests, special_requests, status } = reservationData;
    const query = `
      UPDATE reservations 
      SET name = $1, email = $2, phone = $3, date = $4, time = $5, guests = $6, special_requests = $7, status = $8, updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `;
    const values = [name, email, phone, date, time, guests, special_requests, status, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteById(id) {
    const query = 'DELETE FROM reservations WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Reservation;
