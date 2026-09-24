import mongoose from "mongoose";
import User from "../models/user.js";

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.user;

    // Validate required fields
    if (!userId || !itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "userId, itemId and size are required",
      });
    }

    // Validate MongoDB IDs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(itemId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or itemId",
      });
    }

    // Find user
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get cart
    const cartData = userData.cartData || {};

    // Product already exists
    if (cartData[itemId]) {
      // Size already exists
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        // Size doesn't exist
        cartData[itemId][size] = 1;
      }
    } else {
      // Product doesn't exist
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    // Update database
    await User.findByIdAndUpdate(
      userId,
      { cartData },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      success: true,
      message: "Added to cart",
      cartData,
    });
  } catch (error) {
    console.error("Add to cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to add product to cart",
      error: error.message,
    });
  }
};

// Update cart
export const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.user;

    // Validate required fields
    if (!userId || !itemId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "userId, itemId, size and quantity are required",
      });
    }

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    // Validate MongoDB IDs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(itemId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or itemId",
      });
    }

    // Find user
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get cart
    const cartData = userData.cartData || {};

    // Check product
    if (!cartData[itemId]) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Check size
    if (cartData[itemId][size] === undefined) {
      return res.status(404).json({
        success: false,
        message: "Size not found in cart",
      });
    }

    // Update quantity
    cartData[itemId][size] = quantity;

    // Save cart
    await User.findByIdAndUpdate(
      userId,
      { cartData },
      { returnDocument: "after" },
    );

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      cartData,
    });
  } catch (error) {
    console.error("Update cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update cart",
      error: error.message,
    });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user;

    // Validate userId
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    // Find user
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = userData.cartData || {};

    return res.status(200).json({
      success: true,
      cartData,
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get cart",
      error: error.message,
    });
  }
};

//delete cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.user;

    // Validate required fields
    if (!userId || !itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "itemId and size are required",
      });
    }

    // Validate MongoDB IDs
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(itemId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId or itemId",
      });
    }

    // Find user
    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const cartData = userData.cartData || {};

    // Check product
    if (!cartData[itemId]) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Check size
    if (cartData[itemId][size] === undefined) {
      return res.status(404).json({
        success: false,
        message: "Size not found in cart",
      });
    }

    // Remove size
    delete cartData[itemId][size];

    // If no sizes are left, remove product
    if (Object.keys(cartData[itemId]).length === 0) {
      delete cartData[itemId];
    }

    // Save cart
    await User.findByIdAndUpdate(
      userId,
      { cartData },
      { returnDocument: "after" }
    );

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cartData,
    });
  } catch (error) {
    console.error("Remove cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to remove item from cart",
      error: error.message,
    });
  }
};