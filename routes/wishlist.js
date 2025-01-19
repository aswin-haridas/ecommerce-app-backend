const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Define the Wishlist schema with timestamps and references
const wishlistSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Wishlist = mongoose.model("Wishlist", wishlistSchema);

// POST route for saving or removing a wishlist item
router.post("/", async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id; // Assuming user ID is available through authentication middleware

    // Find the user's wishlist
    let wishlist = await Wishlist.findOne({ user: userId });

    if (wishlist) {
      // If product is already in the wishlist, remove it
      const productIndex = wishlist.products.indexOf(productId);
      if (productIndex > -1) {
        wishlist.products.splice(productIndex, 1);
        await wishlist.save();
        return res.status(200).json({ message: "Item removed from wishlist" });
      }
      // Otherwise, add the product
      wishlist.products.push(productId);
    } else {
      // Create a new wishlist if none exists
      wishlist = new Wishlist({ user: userId, products: [productId] });
    }

    await wishlist.save();
    res.status(201).json({ message: "Item added to wishlist", wishlist });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    res.status(500).json({ error: "Failed to update wishlist" });
  }
});

// GET route to fetch wishlist items
router.get("/", async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available through authentication middleware
    const wishlist = await Wishlist.findOne({ user: userId }).populate("products");
    res.status(200).json(wishlist || { products: [] });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

module.exports = router;
