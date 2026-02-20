import mongoose from "mongoose";


export interface ProductDocument extends Document {
  barcode: string;
  name: string;
  imageUrl: string;
}

const productSchema = new mongoose.Schema({
    barcode: {
      type: String,
      required: true
    },
    name: {
      type: String
    },
    scans: {
      type: Number,
      default: 0
    },
    imageUrl: {
      type: String
    }
   
  },
  {
    timestamps: true 
  }
);

export default mongoose.model<ProductDocument>("Product", productSchema);
