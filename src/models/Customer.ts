import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  phone: string;
  adress: string;
  dob: Date;
  anniversary: Date;
  dueAmount: number;
  advanceAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema<ICustomer>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    adress: { type: String, required: true },
    dob: { type: Date },
    anniversary: { type: Date },
    dueAmount: { type: Number, default: 0 },
    advanceAmount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const CustomerModel = (mongoose.models.Customer as mongoose.Model<ICustomer>) || mongoose.model<ICustomer>("Customer", CustomerSchema);

export default CustomerModel;
