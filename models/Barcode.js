import mongoose from "mongoose";

const barcodeSchema = new mongoose.Schema({
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

export default mongoose.model("Barcode", barcodeSchema);
