import express from "express";
import {
  adminLogin,
  createUser,
  loginUser,
  me,
  logoutUser,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.post("/admin", adminLogin);
userRouter.get("/me", authMiddleware, me);

export default userRouter;
