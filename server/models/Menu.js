const { pool } = require('../config/database');

class Menu {
  /**
   * Get all menu items with their categories
   */
  static async findAll() {
    try {
      const query = `
        SELECT m.*, c.name AS category_name 
        FROM menu_items m
        JOIN menu_categories c ON m.category_id = c.id
        ORDER BY c.display_order, m.name
      `;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      console.error('Error in Menu.findAll:', error);
      throw error;
    }
  }

  /**
   * Get a single menu item by ID
   */
  static async findById(id) {
    try {
      const query = 'SELECT * FROM menu_items WHERE id = $1';
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      console.error('Error in Menu.findById:', error);
      throw error;
    }
  }

  // Add more methods as needed
}

module.exports = Menu;
