const express = require('express');
const Cart = require('../models/Cart');

const router = express.Router();

// Add item to cart
router.post('/', async (req, res) => {
    try {
        const newCartItem = new Cart(req.body);
        const savedCartItem = await newCartItem.save();
        res.status(200).json(savedCartItem);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedCartItem = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedCartItem);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get cart items
router.get('/:userId', async (req, res) => {
    try {
        const cartItems = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cartItems);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete item from cart
router.delete('/:id', async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Item has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});




module.exports = router;