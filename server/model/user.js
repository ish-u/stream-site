import mongoose from "mongoose";
const reqStr = {
  type: String,
  required: true,
};

const userRef = {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
};

// User Schema
const UserSchema = new mongoose.Schema({
  name: reqStr,
  username: reqStr,
  password: reqStr,
  email: reqStr,
  profile: reqStr,
  streamKey: reqStr,
  followers: [userRef],
  following: [userRef],
});

export default mongoose.model("User", UserSchema);
