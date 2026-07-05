const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth.js')
const { addOrder, getOrders, updateOrder, deleteOrder, getMyOrder } = require('../controllers/orderController.js')





router.get('/', protect, adminOnly, getOrders)
router.put('/:id', protect, adminOnly, updateOrder)
router.delete('/:id', protect, adminOnly, deleteOrder)


router.post('/', protect, addOrder)


router.get('/myorders/:email', protect, getMyOrder)


module.exports = router;