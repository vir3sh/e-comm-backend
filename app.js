import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import connectCloudinary from "./config/cloudinary.js";
import testCloudinary from "./utils/testCloudinary.js";
import cookieParser from "cookie-parser";
import orderRouter from "./routes/order.routes.js";
import cartRouter from "./routes/cart.routes.js";

// dotenv.config();
connectDb();
connectCloudinary();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);

app.listen(5000, () => {
  console.log("server is running");
});
