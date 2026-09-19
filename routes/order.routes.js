import express from "express";
import {
  placeOrderRazorpay,
  allOrders,
  orderStatus,
  placeOrder,
  verifyRazorpay,
  userOrders,
} from "../controllers/order.controller.js";
import adminAuth from "../middleware/adminAuth.js";
import authMiddleware from "../middleware/auth.middleware.js";
const orderRouter = express.Router();

orderRouter.post("/status", adminAuth, orderStatus);
orderRouter.post("/all-orders", adminAuth, allOrders);

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/razorpay", authMiddleware, placeOrderRazorpay);

orderRouter.post("/verify", authMiddleware, verifyRazorpay);
orderRouter.post("/my-orders", authMiddleware, userOrders);

export default orderRouter;