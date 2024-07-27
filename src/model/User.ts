import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  messages: Message[];
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAdmin: boolean;
  isAcceptingMessages: boolean;
}

const userSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email",
    ],
  },

  password: {
    type: String,
    required: [true, "Password is required"],
  },

  messages: [messageSchema],

  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: String,
    required: true,
  },
  verifyCodeExpiry: {
    type: Date,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
});

const userModel =
  (mongoose.models.Users as mongoose.Model<User>) ||
  mongoose.model<User>("Users", userSchema);

export default userModel;
