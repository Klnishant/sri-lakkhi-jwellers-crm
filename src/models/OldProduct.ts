import mongoose, { Document, ObjectId, Schema } from "mongoose";

export interface IProduct extends Document {
  orderId?: ObjectId;
  name: string;
  description: string;
  weight: number;
  price: number;
  stock: number;
  type: "Gold" | "Silver" | "Other";
  purity: "18k" | "22k" | "24k" | "Other";
  huid: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema: Schema = new Schema<IProduct>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    name: { type: String, required: true },
    description: { type: String },
    weight: { type: Number, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    type: { type: String, enum: ["Gold", "Silver", "Other"], required: true },
    purity: {
      type: String,
      enum: ["18k", "22k", "24k", "Other"],
      required: true,
    },
    huid: { type: String },
  },
  { timestamps: true },
);

const ProductModel =
  (mongoose.models.Product as mongoose.Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default ProductModel;
