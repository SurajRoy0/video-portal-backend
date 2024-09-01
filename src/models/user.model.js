import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true, // index is use to search username in optimized way
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // Cloudinary url
      required: [true, "Profile Picture is required"],
    },
    coverImage: {
      type: String, // Cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
    // If the password field has not been modified, skip hashing and proceed to the next middleware
    if (!this.isModified('password')) return next();
  
    // Hash the password with a salt round of 10
    this.password = await bcrypt.hash(this.password, 10);
  
    // Call the next middleware
    next();
  });

  userSchema.methods.isPasswordCorrect = async function (password) {
    // Compare the provided password with the hashed password stored in the database
    return await bcrypt.compare(password, this.password);
  };

  
  userSchema.methods.generateAccessToken = function () {
    // Define payload for the access token
    const payload = {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    };
  
    // Sign and return the access token
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    });
  };
  
  userSchema.methods.generateRefreshToken = function () {
    // Define payload for the refresh token
    const payload = {
      _id: this._id,
    };
  
    // Sign and return the refresh token
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
  };
  
  

export const User = mongoose.model("User", userSchema);
