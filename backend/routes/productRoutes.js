const express = require('express');
const router = express.Router();
const Product = require('../models/Product.js'); // Pulls in our Mongoose structure
const { getProduct, addProduct, updateProduct, deleteProduct } = require('../controllers/productController.js')


router.get('/', getProduct)
router.post('/', addProduct) 
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct) 


module.exports = router;