const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
require('dotenv').config();

// Initialize Stripe with the secret API key from environment variables
const stripe = require('stripe')(process.env.STRIPE_KEY);

console.log(process.env.STRIPE_KEY);

// Route to create a Stripe Checkout session
router.post('/create-checkout-session', async (req, res) => {
  const { userId, products } = req.body;

  try {
    // Create a new Cart document
    const cart = new Cart({
      userId,
      products
    });

    // Save the cart to the database
    await cart.save();

    // Calculate total amount
    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      totalAmount += product.price * item.quantity;
    }

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
              description: product.desc,
              images: [product.img],
            },
            unit_amount: product.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      mode: 'payment',
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cart',
      metadata: { cartId: cart._id.toString() }
    });

    // Respond with the Stripe session ID
    res.json({ status: true, id: session.id });
  } catch (err) {
    // Handle errors and respond with an error message
    return res.status(401).json({ success: false, message: 'something went wrong', err });
  }
});

module.exports = router;