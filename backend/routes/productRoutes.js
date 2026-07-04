const express = require('express');
const router = express.Router();
const Product = require('../models/Product.js'); 
const { protect, adminOnly } = require('../middleware/auth.js');
const { getProduct, addProduct, updateProduct, deleteProduct } = require('../controllers/productController.js')


router.get('/', getProduct)


router.post('/', protect, adminOnly, addProduct)
router.put('/:id', protect, adminOnly, updateProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)


module.exports = router;