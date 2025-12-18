const { Order, OrderItem, MenuItem, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.createOrder = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, deliveryAddress, paymentMethod } = req.body;
    const userId = req.user.id;

    let totalAmount = 0;
    const orderItemsData = [];
    
    // Calculate total and prepare order items
    for (const item of items) {
      const menuItem = await MenuItem.findByPk(item.menuItemId);
      if (!menuItem) {
        throw new Error(`Menu item ${item.menuItemId} not found`);
      }
      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;
      
      orderItemsData.push({
        MenuItemId: menuItem.id,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Add delivery fee
    totalAmount += 5.00; 

    const order = await Order.create({
      UserId: userId,
      totalAmount,
      status: 'pending',
      deliveryAddress,
      paymentMethod
    }, { transaction: t });

    for (const itemData of orderItemsData) {
      await OrderItem.create({
        OrderId: order.id,
        ...itemData
      }, { transaction: t });
    }

    await t.commit();
    res.status(201).json(order);
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      include: [{ model: OrderItem, include: [MenuItem] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, include: [MenuItem] }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Authorization check: User owns order OR is admin OR is driver
    if (order.UserId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Require Admin Role' });
    }
    const orders = await Order.findAll({
      include: [{ model: OrderItem, include: [MenuItem] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDriverOrders = async (req, res) => {
    try {
      if (req.user.role !== 'driver') {
          return res.status(403).json({ message: 'Require Driver Role' });
      }
      const orders = await Order.findAll({
        where: { 
          status: {
            [Op.or]: ['ready_for_pickup', 'out_for_delivery']
          }
        },
        include: [{ model: OrderItem, include: [MenuItem] }],
        order: [['createdAt', 'DESC']]
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (req.user.role !== 'admin' && req.user.role !== 'driver') {
         return res.status(403).json({ message: 'Unauthorized' });
    }

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};