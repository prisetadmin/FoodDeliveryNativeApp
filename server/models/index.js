const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Associations
Category.hasMany(MenuItem);
MenuItem.belongsTo(Category);

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

MenuItem.hasMany(OrderItem);
OrderItem.belongsTo(MenuItem);

module.exports = {
  sequelize,
  User,
  Category,
  MenuItem,
  Order,
  OrderItem
};