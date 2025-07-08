const Menu = require('../models/Menu');

const menuController = {
  // Get all menu items
  async getAllMenuItems(req, res) {
    try {
      const menuItems = await Menu.findAll();
      res.json(menuItems);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ error: 'Failed to fetch menu items' });
    }
  },

  // Get single menu item
  async getMenuItem(req, res) {
    try {
      const item = await Menu.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: 'Menu item not found' });
      }
      res.json(item);
    } catch (error) {
      console.error('Error fetching menu item:', error);
      res.status(500).json({ error: 'Failed to fetch menu item' });
    }
  }
};

module.exports = menuController;
