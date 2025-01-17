const express = require('express');
const product = require('../models/Product');

const router = express.Router();

// Create a new product
router.post('/', async (req, res) => {
    try {
        const newproduct = new product(req.body);
        const savedproduct = await newproduct.save();
        res.status(201).json(savedproduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get a specific product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update an product by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedproduct = await product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedproduct) {
            return res.status(404).json({ message: 'product not found' });
        }
        res.status(200).json(updatedproduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete an product by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedproduct = await product.findByIdAndDelete(req.params.id);
        if (!deletedproduct) {
            return res.status(404).json({ message: 'product not found' });
        }
        res.status(200).json({ message: 'product deleted' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;