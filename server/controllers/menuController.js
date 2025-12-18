const { Category, MenuItem } = require('../models');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMenuItems = async (req, res) => {
  try {
    const { categoryId } = req.query;
    const where = categoryId ? { CategoryId: categoryId } : {};
    const menuItems = await MenuItem.findAll({ where });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
