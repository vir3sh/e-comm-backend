import Razorpay from "razorpay";
import orderModel from "../models/order.js";
import User from "../models/user.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
export const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user._id.toString();
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await User.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while placing order",
    });
  }
};

export const placeOrderRazorpay = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.user._id.toString();

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: newOrder._id.toString(),
    };

    const razorpayOrder = await razorpayInstance.orders.create(options);

    return res.json({
      success: true,
      order: razorpayOrder,
    });
  } catch (error) {
    console.log("Razorpay Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const userId = req.user._id.toString();

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status === "paid") {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await User.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Payment Successful" });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});

    if (orders.length <= 0) {
      console.log("no order found");
    }
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "could not fetch all orders",
      error,
    });
  }
};

export const userOrders = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch your orders",
      error,
    });
  }
};
export const orderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await orderModel.findByIdAndUpdate(orderId, { status });
    // if (!order) {
    //   console.log("error while uodateding status");
    // }

    res.json({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "could not fetch order status",
    });
  }
};
