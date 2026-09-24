import express from "express";
import {
  addProduct,
  deleteProducts,
  listProducts,
  singleProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
    { name: "image5", maxCount: 1 },
  ]),
  addProduct,
);

productRouter.delete("/:id", adminAuth, deleteProducts);
productRouter.get("/list", listProducts);
productRouter.get("/:id", singleProduct);
productRouter.put(
  "/:id",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct,
);

export default productRouter;
