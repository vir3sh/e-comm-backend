import express from "express";
import {
  adminLogin,
  createUser,
  loginUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/", createUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

export default userRouter;
