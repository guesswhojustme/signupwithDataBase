import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  profilePic: { type: String },
  email: { type: String, required: true, minLength: 4, unique: true },
  username: { type: String, required: true, minLength: 4, unique: true },
  password: { type: String, required: true, minLength: 4 },
  favorites: [{ type: String }], // Array of strings
  cart: [{ type: String }], // Array of strings
});

const userModel = mongoose.model("user", userSchema);

export default userModel;
