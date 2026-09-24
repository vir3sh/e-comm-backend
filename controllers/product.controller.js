import Product from "../models/product.js";
import { v2 as cloudinary } from "cloudinary";
import createSlug from "../utils/createSlug.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const image5 = req.files.image5 && req.files.image5[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          folder: "ecommerce/products",
        });
        return result.secure_url;
      }),
    );
    const slug = createSlug(name);

    const productData = {
      name,
      slug,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: sizes ? JSON.parse(sizes) : [],
      image: imagesUrl,
      date: Date.now(),
    };

    // console.log(productData);

    const product = new Product(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "cant view list of products",
      error,
    });
  }
};

export const deleteProducts = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "product not found",
      });
    }
    res.json({ success: false, message: "product removed" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "couldn't delete",
    });
  }
};

export const singleProduct = async (req, res) => {
  try {
    const singleProduct = await Product.findOne({ slug: req.params.id });
    if (!singleProduct) {
      return res.status(400).json({
        success: true,
        message: "product not found",
      });
    }
    res.json({ success: true, singleProduct });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "couldn't fetch single product",
      error,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // Find existing product
    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Existing images
    let imagesUrl = existingProduct.image || [];

    // Get newly uploaded images
    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );

    // Upload new images to Cloudinary
    if (images.length > 0) {
      const newImages = await Promise.all(
        images.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
            folder: "ecommerce/products",
          });

          return result.secure_url;
        }),
      );

      imagesUrl = newImages;
    }

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestseller: bestseller === "true",
      image: imagesUrl,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, productData, {
      returnDocument: "after",
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
