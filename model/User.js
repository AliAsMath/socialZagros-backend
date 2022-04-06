const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, require: true, min: 3, max: 20, unique: true },

    email: { type: String, require: true, min: 5, max: 50, unique: true },

    password: { type: String, require: true, min: 6 },

    profilePic: { type: String, default: "" },

    coverPic: { type: String, default: "" },

    followers: { type: Array, default: [] },

    followings: { type: Array, default: ["62378b65c8565465908804bf"] },

    isAdmin: { type: Boolean, default: false },

    description: { type: String, max: 50 },

    city: { type: String, max: 50 },

    relationship: { type: String, enum: ["Single", "Married", "-"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
