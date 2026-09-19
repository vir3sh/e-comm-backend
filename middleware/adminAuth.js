import jwt, { decode } from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Not Authorized",
    });
  }
};

export default adminAuth;
