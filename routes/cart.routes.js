import express from "express";
import {
  addToCart,
  getCart,
  updateCart,
} from "../controllers/cart.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, addToCart);
cartRouter.post("/update", authMiddleware, updateCart);
cartRouter.post("/get", authMiddleware, getCart);

export default cartRouter;
