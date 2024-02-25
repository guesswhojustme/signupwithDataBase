import userModel from "../models/user";
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import pulsePlayUserModel from "../models/pulsePlayUsers";

const router = express.Router();
dotenv.config();

router.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;
    try {
      const existingEmail = await userModel.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ error: "Email Already Exists" });
      }
      const existingUsername = await userModel.findOne({ username });
      if (existingUsername) {
        return res.status(409).json({ error: "Username Already Exists" });
      }

      const newUser = new userModel({
        email,
        username,
        password: await bcrypt.hash(password, 10),
      });

      await newUser.save();
      return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/signupPulsePlay",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;
    try {
      const existingEmail = await pulsePlayUserModel.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ error: "Email Already Exists" });
      }
      const existingUsername = await pulsePlayUserModel.findOne({ username });
      if (existingUsername) {
        return res.status(409).json({ error: "Username Already Exists" });
      }

      const newUser = new pulsePlayUserModel({
        email,
        username,
        password: await bcrypt.hash(password, 10),
      });

      await newUser.save();
      return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const existingUser = await userModel.findOne({ email });
      if (!existingUser) {
        return res.status(404).json("Wrong Email or Password");
      }
      const passOk = await bcrypt.compare(password, existingUser.password);
      if (!passOk) {
        return res.status(404).json("Wrong Email or Password");
      }

      const secret = process.env.SECRET;
      if (!secret) {
        throw new Error("SECRET is not defined in the environment variables");
      }
      const token = jwt.sign(
        {
          email: existingUser.email,
          username: existingUser.username,
          id: existingUser._id,
          profilePic: existingUser.profilePic,
        },
        secret,
        {}
      );

      // Set the cookie to expire in   7 days
      res
        .cookie("token", token, {
          sameSite: "none", // Allows the cookie to be sent with cross-site requests
          secure: process.env.NODE_ENV === "production", // Only set the secure flag in production
          httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        })
        .json({
          email: existingUser.email,
          username: existingUser.username,
          id: existingUser._id,
          profilePic: existingUser.profilePic,
        });
    } catch (error) {
      next(error);
    }
  }
);

router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  // Set the cookie to expire in the past
  const expiresIn = new Date(0); // This sets the expiration date to the Unix epoch
  return res
    .cookie("token", "", { expires: expiresIn })
    .json("you have been logout");
});

module.exports = router;
