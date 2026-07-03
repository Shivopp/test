const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const {protect } =require('../middleware/auth.js')
const { addOrder, getOrders, updateOrder, deleteOrder, getMyOrder } = require('../controllers/orderController.js')




router.get('/', getOrders)
router.post('/', addOrder)
router.put('/:id', updateOrder) 
router.delete('/:id', deleteOrder)
router.get('/myorders/:email', protect, getMyOrder)


module.exports = router;