import mongoose, { Schema, ObjectId, Document } from "mongoose";
import { IProduct } from "./OldProduct";

export interface IOrder extends Document {
  customerId: ObjectId;
  products: {
    productId: ObjectId;
    quantity: number;
  }[];
  totalAmount: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  grossWeight: number;
  customDuty: number;
  sgst: number;
  cgst: number;
  igst: number;
  gstOnMakingCharge: number;
  discount: number;
  totalPayableAmmount: number;
  invoiceNumber: string;
  invoiceUrl: string;
  oldProducts: {
    name: string;
    description: string;
    weight: number;
    price: number;
    quantity: number;
    type: "Gold" | "Silver" | "Other";
    purity: "18k" | "22k" | "24k" | "Other";
    huid: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema<IOrder>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    grossWeight: { type: Number, required: true },
    customDuty: { type: Number, required: true },
    sgst: { type: Number, required: true },
    cgst: { type: Number, required: true },
    igst: { type: Number, required: true },
    gstOnMakingCharge: { type: Number, required: true },
    discount: { type: Number },
    totalPayableAmmount: { type: Number, required: true },
    invoiceNumber: { type: String, required: true },
    invoiceUrl: { type: String, required: true },
    oldProducts: [
      {
        name: { type: String, required: true },
        description: { type: String },
        weight: { type: Number, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number },
        type: { type: String, enum: ["Gold", "Silver", "Other"], required: true },
        purity: {
          type: String,
          enum: ["18k", "22k", "24k", "Other"],
          required: true,
        },
        huid: { type: String },
      },
    ],
  },
  { timestamps: true },
);

const OrderModel =
  (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
