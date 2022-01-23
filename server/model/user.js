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
  streamTitle: String,
  liveStatus: {
    type: String,
    enum: ["OFFLINE", "ONLINE"],
    required: true,
    default: "OFFLINE",
  },
  clients: [String],
  viewers: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("User", UserSchema);
