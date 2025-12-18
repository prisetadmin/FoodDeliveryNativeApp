const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/categories', menuController.getCategories);
router.get('/menu', menuController.getMenuItems);

module.exports = router;
