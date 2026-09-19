import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import connectCloudinary from "./config/cloudinary.js";
import cookieParser from "cookie-parser";
import orderRouter from "./routes/order.routes.js";
import cartRouter from "./routes/cart.routes.js";

connectDb();
connectCloudinary();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "API is running",
  });
});

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
