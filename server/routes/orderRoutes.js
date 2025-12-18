const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getMyOrders);
router.get('/', auth, orderController.getAllOrders);
router.get('/driver', auth, orderController.getDriverOrders);
router.get('/:id', auth, orderController.getOrderById);
router.put('/:id', auth, orderController.updateOrderStatus);

module.exports = router;