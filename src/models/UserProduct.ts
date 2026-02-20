import mongoose from "mongoose";
import { UserDocument } from "./User";

export interface UserProductDocument extends Document {
  barcode: string;
  name: string;
  imageUrl: string;
  user: UserDocument;
}

const userProductSchema = new mongoose.Schema(
  {
    barcode: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    imageUrl: {
      type: String,
    },

    stock: {
      type: Number,
      default: 0,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<UserProductDocument>("UserProduct", userProductSchema);
