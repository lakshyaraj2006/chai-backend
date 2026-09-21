import mongoose, { Schema } from "mongoose";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants.js";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true
        },
        avatar: {
            type: String,
            required: true
        },
        coverImage: {
            type: String
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: true,
            select: false
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

userSchema.pre("save", async function() {
    if (!this.isModified("password")) return;

    this.password = await argon2.hash(this.password);
})

userSchema.method({
  async isPasswordCorrect(candidatePassword) {
    if (!this.password) {
      throw new Error("Password field not selected - use .select('+password')");
    }
    const result = await argon2.verify(this.password, candidatePassword);
    return result;
  },

  generateAccessToken() {
    const payload = {
      id: this._id.toString(),
      username: this.username,
    };

    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
  },

  generateRefreshToken() {
    const payload = {
      id: this._id.toString(),
    };

    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: "30d",
    });
  },
});

export const User = mongoose.model('User', userSchema);