const { pool } = require('../config/db');

class MenuItem {
  static async create(itemData) {
    const { name, description, price, category, image, isAvailable = true } = itemData;
    const query = `
      INSERT INTO menu_items (name, description, price, category, image, available)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [name, description, price, category, image, isAvailable];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM menu_items ORDER BY category, name';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM menu_items WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCategory(category) {
    const query = 'SELECT * FROM menu_items WHERE category = $1 ORDER BY name';
    const result = await pool.query(query, [category]);
    return result.rows;
  }

  static async updateById(id, itemData) {
    const { name, description, price, category, image, isAvailable } = itemData;
    const query = `
      UPDATE menu_items 
      SET name = $1, description = $2, price = $3, category = $4, image = $5, available = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    const values = [name, description, price, category, image, isAvailable, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async deleteById(id) {
    const query = 'DELETE FROM menu_items WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = MenuItem;
