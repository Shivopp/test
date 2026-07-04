const Order = require('../models/Order');

async function getOrders(req, res) {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function addOrder(req, res) {
    try {
        const { customerName, email, phone, address, paymentMethod, items, totalAmount } = req.body;
        const newOrder = new Order({
            customerName,
            email,
            phone: phone || '',
            address,
            paymentMethod: paymentMethod || 'Not specified',
            items,
            totalAmount
        });
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
async function updateOrder(req, res) {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
async function deleteOrder(req, res) {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json({ message: "Order deleted successfully from database!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
async function getMyOrder(req, res) {
    try {
      
        if (req.user.email !== req.params.email) {
            return res.status(403).json({ message: "Not authorized to view these orders" });
        }
        const orders = await Order.find({ email: req.params.email }).sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addOrder, getOrders, updateOrder, deleteOrder, getMyOrder
}