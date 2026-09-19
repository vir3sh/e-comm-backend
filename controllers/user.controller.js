import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill all fileds",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User Created",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fill all fileds",
      });
    }

    const userExist = await User.findOne({ email }).select("+password");
    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: "User doesnot exist",
      });
    }

    const comparePassword = await bcrypt.compare(password, userExist.password);

    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const token = jwt.sign({ userId: userExist._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "logged in",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to log in",
      error: error.message,
    });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_MAIL &&
      password === process.env.ADMIN_PASS
    ) {
      const token = jwt.sign({ email, role: "admin" }, process.env.SECRET_KEY, {
        expiresIn: "7d",
      });
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        token,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to log in",
      error: error.message,
    });
  }
};
