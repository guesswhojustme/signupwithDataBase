import bcrypt from "bcryptjs";
export const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 4000;

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Jjae:ybWdste8V4Gt7O9K@cluster0.jv7imod.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log("connected to database");
  } catch (error) {
    console.log("failed to connect:", error);
  }
};

connectDB();


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, minLength: 4, unique: true },
  password: { type: String, required: true, minLength: 4 },
});

const userModel = mongoose.model("anotherUser", userSchema);

app.post("/register", async (req: any, res: any) => {
  const { email, password } = req.body;

  const newUser = new userModel({
    email,
    password: await bcrypt.hash(password, 10),
  });
  await newUser.save();
  return res.status(200).json("user created");
});

app.listen(PORT, () => {
  console.log(`listening to http://localhost:${PORT}`);
});
