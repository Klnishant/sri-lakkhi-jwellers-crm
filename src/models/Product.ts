import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    weight: number;
    price: number;
    stock: number;
    type: "Gold" | "Silver" | "Other";
    purity: "18k" | "22k" | "24k" | "Other";
    makingCharge: number;
    huid: string;
    hsn: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema<IProduct>(
    {
        name: { type: String, required: true },
        description: { type: String },
        weight: { type: Number, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        type: { type: String, enum: ["Gold", "Silver", "Other"], required: true },
        purity: { type: String, enum: ["18k", "22k", "24k", "Other"], required: true },
        makingCharge: { type: Number },
        huid: { type: String },
        hsn: { type: Number },
    },
    { timestamps: true }
);

const ProductModel = (mongoose.models.Product as mongoose.Model<IProduct>) || mongoose.model<IProduct>('Product', ProductSchema);

export default ProductModel;