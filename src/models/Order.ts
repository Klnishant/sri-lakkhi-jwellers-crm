import mongoose, { Schema, ObjectId, Document } from "mongoose";

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
    discount: { type: Number, required: true },
    totalPayableAmmount: { type: Number, required: true },
  },
  { timestamps: true },
);

const OrderModel =
  (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
